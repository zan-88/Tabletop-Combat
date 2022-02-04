import { logDOM } from "@testing-library/react";
import { useState, useEffect } from "react";

export default function useGridBounds(
  token,
  borderID,
  tileDim,
  setDeleteKey,
  setNewTokUrl = null,
  setMapTok = null
) {
  const [position, setPosition] = useState({
    x: token.x,
    y: token.y,
  });

  let inMouse = { x: null, y: null };
  let offset = { x: null, y: null };

  useEffect(() => {
    const drag = document.getElementById(token.id);

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

    //CLEAN UP LATER
    function up(e) {
      const border = document.getElementById(borderID);
      let x = border.getBoundingClientRect().left;
      let y = border.getBoundingClientRect().top;
      let width = border.offsetWidth;
      let height = border.offsetHeight;

      //If out of grid
      if (
        !(
          e.clientX > x &&
          e.clientX < x + width &&
          e.clientY > y &&
          e.clientY < y + height
        )
      ) {
        setDeleteKey(token.key);
        if (setNewTokUrl) {
          setNewTokUrl("");
          setNewTokUrl(token.url);
        }
      } else {
        console.log(position);
        let loc = {
          x: Math.floor((e.clientX - x) / tileDim) * tileDim + x,
          y: Math.floor((e.clientY - y) / tileDim) * tileDim + y,
        };
        setPosition(loc);
        let temp = { url: "", pos: { x: 0, y: 0 }, key: -1 };
        if (setMapTok) {
          temp = {
            url: token.url,
            pos: loc,
            key: token.key,
          };
          setDeleteKey(token.key);
          return setMapTok(temp);
        }
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
