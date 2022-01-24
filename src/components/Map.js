import React, { useEffect, useState } from "react";
import styled from "styled-components";
import useDraggable from "../hooks/use-draggable";
import grid from "../images/grid.png";

export default function Map({
  imageUrl,
  val,
  loc,
  dim,
  fitImage,
  setLoc,
  isLoaded,
  gridVal,
  tokens,
}) {
  useEffect(() => {
    let imag = document.getElementById("ugh");

    fitImage();
    setLoc({
      x: imag.offsetLeft,
      y: imag.offsetTop,
    });

    window.addEventListener("resize", fitImage);
  }, [isLoaded]);
  return (
    <>
      <div
        id="mapBack"
        style={{
          display: "flex",
          flexGrow: 5,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            alignSelf: "center",

            width: `${dim.w}`,
            height: `${dim.h}`,
          }}
        >
          <div
            style={{
              position: "absolute",
              alignSelf: "center",
              width: `${dim.w}`,
              height: `${dim.h}`,
              top: loc.y,
              left: loc.x,
            }}
          >
            <div
              id="grid"
              style={{
                objectFit: "fill",
                background: `url(${grid}) no-repeat`,
                backgroundSize: `${gridVal.w}px `,
                position: "relative",
                width: `${dim.w}`,
                height: `${dim.h}`,
                zIndex: "10",
                opacity: "100%",
              }}
            ></div>
          </div>

          <div
            id="fuck"
            style={{
              justifyContent: "center",
              alignContent: "center",
              width: `${dim.w}`,
              height: `${dim.h}`,
            }}
          >
            <img
              id="ugh"
              src={imageUrl}
              style={{ width: `${dim.w}`, height: `${dim.h}` }}
              alt=""
            />
          </div>
        </div>

        {/*
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
        ></div>*/}
      </div>
    </>
  );
}
