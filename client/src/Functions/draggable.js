import { useState } from "react";

export default function draggable(id) {
  let pos = { x: 0, y: 0 };
  let active = false;
  let offset = { x: 0, y: 0 };
  let inMouse = { x: null, y: null };
  const drag = document.getElementById(id);

  if (drag) {
    drag.addEventListener("mouseover", start, false);
  }

  function up(e) {
    stop(e.originalEvent);
    document.removeEventListener("mousemove", function (e) {
      if (active) {
        move(e);
      }
    });
    document.removeEventListener("mouseup", up);
  }

  function start(e) {
    document.addEventListener("mousemove", function (e) {
      if (active) {
        move(e);
      }
    });
    document.addEventListener("mouseup", up);
    inMouse = {
      x: e.clientX,
      y: e.clientY,
    };

    offset = {
      x: drag.offsetLeft,
      y: drag.offsetTop,
    };

    return (active = true);
  }

  function move(e) {
    e.preventDefault();
    pos = {
      x: offset.x + e.clientX - inMouse.x,
      y: offset.y + e.clientY - inMouse.y,
    };
    drag.style.left = pos.x + "px";
    drag.style.top = pos.y + "px";
  }

  function stop(e) {
    return (active = false);
  }
}
