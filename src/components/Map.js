import React from "react";
import styled from "styled-components";
import useDraggable from "../hooks/use-draggable";
import grid from "../images/grid.png";

export default function Map({ imageUrl }) {
  const { position: pos } = useDraggable("grid");
  console.log(pos);
  const Grid = styled.div`
    box-sizing: border-box;
    background: url(${grid}) center;
    background-position: "center";
    background-size: 100%;
    width: 100%;
    height: 100%;
    opacity: 50%;
    top: ${pos.y}px;
    left: 10%;
    position: absolute;
    z-index: 1000;
  `;
  return (
    <>
      <div
        id="grid"
        style={{
          background: `url(${grid}) repeat`,
          top: -500 + pos.y,
          left: -500 + pos.x,
          overflow: "hidden",
          position: "absolute",
          width: "1000%",
          height: "1000%",
          zIndex: "1",
          opacity: "50%",
        }}
      ></div>
      <div
        style={{
          flexGrow: 5,
          alignContent: "center",
        }}
      >
        <div
          style={{
            backgroundRepeat: "no-repeat",
            boxSizing: "border-box",
            background: `url(${imageUrl}) no-repeat center`,
            backgroundSize: "contain",
            backgroundPosition: "center",
            width: "100%",
            height: "100%",
            overflow: "hidden",
          }}
        ></div>
      </div>
    </>
  );
}
