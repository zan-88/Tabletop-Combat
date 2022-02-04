import React, { useEffect } from "react";
import useGridBounds from "../hooks/use-gridBounds";

export default function Token({
  tileSize,
  token,
  setDeleteKey,
  setNewTokUrl,
  setMapTok,
}) {
  const { position: pos } = useGridBounds(
    token,
    "grid",
    tileSize,
    setDeleteKey,
    setNewTokUrl,
    setMapTok
  );

  useEffect(() => {
    token.x = pos.x;
    token.y = pos.y;
  }, [pos, token]);

  return (
    <div
      id={token.id}
      style={{
        zIndex: "100",
        position: "absolute",
        backgroundImage: `url(${token.url})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        width: `${token.dim}px`,
        height: `${token.dim}px`,
        top: `${pos.y}px`,
        left: `${pos.x}px`,
      }}
    />
  );
}
