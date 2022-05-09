import { useState, useEffect } from "react";
import * as GridHelper from "../Functions/GridMapConv";

export default function useGridBounds(
  token,
  borderID,
  tileDim,
  setDeleteKey,
  setChangeKey,
  setNewTokUrl = null,
  setMapTok = null,
  setCoord,
  scrollDis = 0,
  isOwner,
  socket
) {
  const [position, setPosition] = useState(
    setNewTokUrl
      ? { x: token.x, y: token.y }
      : GridHelper.coordToMap({ x: token.x, y: token.y }, borderID, tileDim)
  );

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
        //DELETES TOKEN
        setDeleteKey(token.key);
        if (setNewTokUrl) {
          setNewTokUrl("");
          setNewTokUrl(token.url);
        }
      } else {
        //SETS TOKEN
        let loc = {
          x: Math.floor((e.clientX - x) / tileDim) * tileDim + x,
          y: Math.floor((e.clientY - y) / tileDim) * tileDim + y,
        };
        let coord = GridHelper.MapToCoord(loc, "grid", tileDim);
        setCoord(coord);
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
        if (setChangeKey) setChangeKey({ token: token, coord: coord });
        socket.emit("token-change-pos", {
          key: token.key,
          x: coord.x,
          y: coord.y,
          url: token.url,
          id: token.id,
        });
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

    if (isOwner) drag.addEventListener("mousedown", down);

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
