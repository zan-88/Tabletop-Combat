import { useState, useEffect } from "react";
import React from "react";

export default function useDragFile(id) {
  const [map, setMap] = useState("");

  useEffect(() => {
    const area = document.getElementById(id);
    console.log("test");
    //Drag over upload area with file
    area.addEventListener("dragover", (e) => over(e, area));

    //Leave Upload area with file
    area.addEventListener("dragleave", (e) => leave(e, area));

    //Drag over upload area with file
    area.addEventListener("mouseover", (e) => over(e, area));

    //Leave Upload area with file
    area.addEventListener("mouseleave", (e) => leave(e, area));
  }, []);

  function over(e, el) {
    e.preventDefault();
    el.style.opacity = "100%";
  }

  function leave(e, el) {
    e.preventDefault();
    el.style.opacity = "50%";
  }

  function drop(e) {
    e.preventDefault();
    setMap(e.dataTransfer.files[0]);

    let fileReader = new FileReader();
    let URL = fileReader.result;

    fileReader.readAsDataURL(map);

    console.log("test" + URL);
  }

  return map;
}
