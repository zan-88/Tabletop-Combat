import { logDOM } from "@testing-library/react";
import { useState, useEffect } from "react";

export default function useGridBounds(
  token,
  initPos,
  borderID,
  setDim,
  tileDim,
  newToken,
  removeToken
) {
  const [position, setPosition] = useState({
    x: initPos.x,
    y: initPos.y,
  });

  let inMouse = { x: null, y: null };
  let offset = { x: null, y: null };
  let initial = initPos;

  useEffect(() => {
    const drag = document.getElementById(token.id);

    const down = function (e) {
      const border = document.getElementById(borderID);
      if (border !== null) {
        let x = border.getBoundingClientRect().left;
        let y = border.getBoundingClientRect().top;
        let width = border.offsetWidth;
        let height = border.offsetHeight;
        if (
          !(
            e.clientX > x &&
            e.clientX < x + width &&
            e.clientY > y &&
            e.clientY < y + height
          )
        ) {
          newToken(token.url);
        }
      } else {
        newToken(token.url);
      }
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
      const border = document.getElementById(borderID);
      if (border !== null) {
        let x = border.getBoundingClientRect().left;
        let y = border.getBoundingClientRect().top;
        let width = border.offsetWidth;
        let height = border.offsetHeight;
        if (
          !(
            e.clientX > x &&
            e.clientX < x + width &&
            e.clientY > y &&
            e.clientY < y + height
          )
        ) {
          setDim(token.dim);
          console.log("KEY: " + token.key);
          setPosition({
            x: -1000,
            y: -1000,
          });
        } else {
          setDim(tileDim);
          console.log(position);
          console.log(initPos);
          console.log(Math.floor(e.clientX / tileDim));
          setPosition({
            x: Math.floor((e.clientX - x) / tileDim) * tileDim + x,
            y: Math.floor((e.clientY - y) / tileDim) * tileDim + y,
          });
        }
      } else {
        //setPosition(initial);
      }
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
      const border = document.getElementById(borderID);
      if (border !== null) {
        let x = border.getBoundingClientRect().left;
        let y = border.getBoundingClientRect().top;
        let width = border.offsetWidth;
        let height = border.offsetHeight;
        if (
          !(
            e.clientX > x &&
            e.clientX < x + width &&
            e.clientY > y &&
            e.clientY < y + height
          )
        ) {
          //setDim(token.dim);
        } else {
          //setDim(tileDim);
        }
      }
    }
    drag.addEventListener("mousedown", down);
    console.log("REEE");

    return () => {
      drag.removeEventListener("mousedown", down);
      document.body.removeEventListener("mousemove", move);
      document.body.removeEventListener("mouseup", up);
    };
  }, [tileDim]);
  return {
    position,
  };
}
