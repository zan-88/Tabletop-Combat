import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import useDraggable from "../hooks/use-draggable";
import grid from "../images/grid.png";
import Token from "./Token";

export default function Map({
  imageUrl,
  val,
  loc,
  dim,
  fitImage,
  setLoc,
  isLoaded,
  gridVal,
  mapTokens,
  setMapTokens,
  tileSize,
}) {
  const [deleteKey, setDeleteKey] = useState(-1);
  const notInitial = useRef(false);

  //Delete Token effect
  useEffect(() => {
    if (notInitial.current) {
      let newArr = mapTokens;
      console.log("EVEN MORE FUCKK");
      newArr = newArr.filter(function (tok) {
        return tok.key !== deleteKey;
      });
      console.log(newArr);
      setMapTokens([...newArr]);
    } else {
      notInitial.current = true;
    }
  }, [deleteKey]);

  useEffect(() => {
    let imag = document.getElementById("ugh");
    // let border = document.getElementById("mapBack");
    // if (border !== null) {
    //   border.addEventListener("mouseout", function (e) {
    //     window.addEventListener("mouseup", function (e) {});
    //   });
    // }

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
      {mapTokens.length > 0 &&
        mapTokens.map((token) => (
          <Token
            tileSize={tileSize}
            key={token.key}
            token={token}
            setDeleteKey={setDeleteKey}
            setNewTokUrl={undefined}
            setMapTok={undefined}
          />
        ))}{" "}
    </>
  );
}
