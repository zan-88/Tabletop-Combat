import { logDOM } from "@testing-library/react";
import { useState, useEffect } from "react";

export default function useScalable(scale, container, anchor) {
  const [scalable, setScale] = useState(1);
  let inMouse = { x: 0, y: 0 };
  useEffect(() => {
    const drag = document.getElementById(scale);
    const down = function (e) {
      inMouse = {
        x: e.clientX,
        y: e.clientY,
      };
      e.stopPropagation();
      e.preventDefault();
      window.addEventListener("mousemove", move);
      window.addEventListener("mouseup", up);
    };

    function up(e) {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    }

    function move(e) {
      e.preventDefault();

      let cont = document.getElementById(container);
      let len = cont.offsetHeight;
      const diff = {
        x: e.clientX - anchor.current.x,
        y: e.clientY - anchor.current.y,
      };

      setScale(
        (Math.sqrt(diff.x * diff.x + diff.y * diff.y) +
          drag.offsetTop +
          drag.offsetHeight / 2) /
          len
      );
    }
    drag.addEventListener("mousedown", down, false);
    console.log("REEE");

    return () => {
      drag.removeEventListener("mousedown", down, false);
    };
  }, []);
  return {
    scalable,
  };
}
