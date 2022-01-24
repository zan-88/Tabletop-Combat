import React, { useEffect, useState } from "react";
import styled from "styled-components";
import draggable from "../Functions/draggable";
import useBorder from "../hooks/use-border";
import useDraggable from "../hooks/use-draggable";
import useGridBounds from "../hooks/use-gridBounds";

export default function Token({ dim, token, tokens, setTokens }) {
  const [tile, setTile] = useState(token.dim);
  const [initTile, setInitTile] = useState(token.dim);
  const { position: pos } = useGridBounds(
    token.id,
    { x: token.x, y: token.y },
    "grid",
    setTile,
    token.dim,
    dim,
    newToken,
    removeToken
  );

  function removeToken() {
    if (tokens.length > 1) {
      tokens.pop();
      setTokens(tokens);
    }
  }

  function newToken() {
    console.log("loc: " + token.x);
    setTokens([
      ...tokens,
      {
        x: token.x,
        y: token.y,
        url: token.url,
        id: "char_" + tokens.length,
        key: tokens.length,
        dim: initTile,
      },
    ]);
  }

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
        background: `url(${token.url}) center`,
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
