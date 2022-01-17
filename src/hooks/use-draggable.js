import { logDOM } from "@testing-library/react";
import { useState, useEffect } from "react";

export default function useDraggable(id) {
  const [position, setPosition] = useState({
    x: 0,
    y: 0,
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
        x: e.clientX - inMouse.x,
        y: e.clientY - inMouse.y,
      };
      setPosition(pos);
    }
    drag.addEventListener("mousedown", down);
  }, []);
  return {
    position,
  };
}
