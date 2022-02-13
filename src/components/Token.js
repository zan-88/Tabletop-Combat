import React, { useEffect, useState, useRef } from "react";
import useGridBounds from "../hooks/use-gridBounds";
import * as GridHelper from "../Functions/GridMapConv";

export default function Token({
  tileSize,
  token,
  setDeleteKey,
  setNewTokUrl,
  setMapTok,
  isPanel = false,
  triggerResize = 0,
  scrollDis = 0,
}) {
  const [coord, setCoord] = useState({ x: token.x, y: token.y });

  const resized = useRef(coord);

  const [adjustedPos, setAdjustedPos] = useState({ x: token.x, y: token.y });

  const { position: pos } = useGridBounds(
    token,
    "grid",
    tileSize,
    setDeleteKey,
    setNewTokUrl,
    setMapTok,
    setCoord,
    scrollDis
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
        top: `${pos.y - triggerResize}px`,
        left: `${pos.x}px`,
      }}
    />
  );
}
