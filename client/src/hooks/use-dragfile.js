import { useState, useEffect } from "react";
import React from "react";

export default function useDragFile(id) {
  useEffect(() => {
    const area = document.getElementById(id);
    if (area !== null) {
      //Drag over upload area with file
      area.addEventListener("dragover", (e) => over(e, area));

      //Leave Upload area with file
      area.addEventListener("dragleave", (e) => leave(e, area));

      //Drag over upload area with file
      area.addEventListener("mouseover", (e) => over(e, area));

      //Leave Upload area with file
      area.addEventListener("mouseleave", (e) => leave(e, area));
    }
  }, []);

  function over(e, el) {
    e.preventDefault();
    el.style.opacity = "100%";
  }

  function leave(e, el) {
    e.preventDefault();
    el.style.opacity = "50%";
  }
}
