import React, { useEffect, useState } from "react";
import styled from "styled-components";
import draggable from "../Functions/draggable";
import useBorder from "../hooks/use-border";
import useDraggable from "../hooks/use-draggable";
import useGridBounds from "../hooks/use-gridBounds";

export default function Token({ dim, token, tokens, newToken, removeToken }) {
  const [isPanel, setIsPanel] = useState(token.isPanel);
  const [tile, setTile] = useState(token.dim);
  const [initTile, setInitTile] = useState(token.dim);
  const { position: pos } = useGridBounds(
    token,
    { x: token.x, y: token.y },
    "grid",
    setTile,
    dim,
    newToken,
    removeToken
  );

  useEffect(() => {
    let border = document.getElementById("grid");
    if (border !== null) {
      let x = border.getBoundingClientRect().left;
      let y = border.getBoundingClientRect().top;
      let width = border.offsetWidth;
      let height = border.offsetHeight;
      if (
        !(pos.x > x && pos.x < x + width && pos.y > y && pos.y < y + height)
      ) {
        setTile(initTile);
      } else {
        setTile(dim);
      }
    }
  }, [dim]);

  return (
    <div
      id={token.id}
      style={{
        position: "absolute",
        backgroundImage: `url(${token.url})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        width: `${tile}px`,
        height: `${tile}px`,
        top: `${pos.y}px`,
        left: `${pos.x}px`,
        zIndex: "900000",
      }}
    />
  );
}
