import React, { useEffect, useState, useRef } from "react";
import useGridBounds from "../hooks/use-gridBounds";
import * as GridHelper from "../Functions/GridMapConv";
import * as GameRequest from "../Functions/gameRequest";

export default function Token({
  tileSize,
  token,
  setDeleteKey,
  setChangeKey = null,
  setNewTokUrl,
  setMapTok,
  isPanel = false,
  scrollDis = 0,
  isOwner,
  socket,
}) {
  const [coord, setCoord] = useState({ x: token.x, y: token.y });

  const resized = useRef(coord);

  const [notInitial, setNotInitial] = useState(false);

  const { position: pos } = useGridBounds(
    token,
    "grid",
    tileSize,
    setDeleteKey,
    setChangeKey,
    setNewTokUrl,
    setMapTok,
    setCoord,
    scrollDis,
    isOwner,
    socket
  );

  useEffect(() => {
    if (!isPanel) {
      let temp = GridHelper.coordToMap(resized.current, "grid", tileSize);
      pos.x = temp.x;
      pos.y = temp.y;
    }
  }, [tileSize]);

  useEffect(() => {
    resized.current = GridHelper.MapToCoord(pos, "grid", tileSize);
  }, [pos]);

  useEffect(() => {
    if (!isPanel && notInitial) {
      GameRequest.updateToken({
        key: token.key,
        x: coord.x,
        y: coord.y,
        tileSize: tileSize,
      });
    }
    setNotInitial(true);
  }, [coord]);

  return (
    <div
      id={token.id}
      style={{
        zIndex: isPanel ? 0 : 10000,
        position: "absolute",
        backgroundImage: `url(${token.url})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        width: setMapTok ? token.dim : `${tileSize}px`,
        height: setMapTok ? token.dim : `${tileSize}px`,
        top: `${pos.y}px`,
        left: `${pos.x}px`,
      }}
    />
  );
}
