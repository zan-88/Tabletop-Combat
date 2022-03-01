import { logDOM } from "@testing-library/react";
import { useState, useEffect } from "react";

export default function useDraggable(id, initPos) {
  const [position, setPosition] = useState({
    x: initPos.x,
    y: initPos.y,
  });
  let inMouse = { x: null, y: null };
  let offset = { x: null, y: null };
  useEffect(() => {
    const drag = document.getElementById(id);
    const down = function (e) {
      inMouse = {
        x: e.clientX,
        y: e.clientY,
      };

      offset = {
        x: drag.offsetLeft,
        y: drag.offsetTop,
      };

      e.preventDefault();
      document.body.addEventListener("mousemove", move);
      document.body.addEventListener("mouseup", up);
    };

    function up(e) {
      document.body.removeEventListener("mousemove", move);
      document.body.removeEventListener("mouseup", up);
    }

    function move(e) {
      e.preventDefault();
      const pos = {
        x: offset.x + e.clientX - inMouse.x,
        y: offset.y + e.clientY - inMouse.y,
      };
      setPosition(pos);
    }
    drag.addEventListener("mousedown", down);
    console.log("REEE");

    return () => {
      drag.removeEventListener("mousedown", down);
      document.body.removeEventListener("mousemove", move);
      document.body.removeEventListener("mouseup", up);
    };
  }, []);
  return {
    position,
  };
}
