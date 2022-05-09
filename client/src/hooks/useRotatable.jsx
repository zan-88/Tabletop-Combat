import React, { useEffect, useState } from "react";

export default function useRotatable(draggable, container, p1, p2) {
  const [angle, setAngle] = useState(0);

  useEffect(() => {
    let drag = document.getElementById(draggable);
    let cont = document.getElementById(container);

    cont.style.transformOrigin = `center bottom`;

    const down1 = function (e) {
      e.preventDefault();

      move1(e);
      window.addEventListener("mousemove", move1);
      window.addEventListener("mouseup", up1);
    };

    function up1(e) {
      window.removeEventListener("mousemove", move1);
      window.removeEventListener("mouseup", up1);
    }

    function move1(e) {
      e.preventDefault();

      let a = Math.sqrt(
        Math.pow(p1.current.x - p2.current.x, 2) +
          Math.pow(p1.current.y - p2.current.y, 2)
      );
      let b = Math.sqrt(
        Math.pow(e.clientX - p2.current.x, 2) +
          Math.pow(e.clientY - p2.current.y, 2)
      );
      let c = Math.sqrt(
        Math.pow(e.clientX - p1.current.x, 2) +
          Math.pow(e.clientY - p1.current.y, 2)
      );

      let rot = Math.acos((c * c + a * a - b * b) / (2 * c * a));
      setAngle(
        e.clientX - p1.current.x > 0
          ? rot * (180 / Math.PI)
          : -1 * rot * (180 / Math.PI)
      );
    }

    //pivot.addEventListener("mousedown", down1);
    drag.addEventListener("mousedown", down1);
    return () => {
      //pivot.removeEventListener("mousedown", down1);
      drag.removeEventListener("mousedown", down1);
    };
  }, []);

  return {
    angle,
  };
}
