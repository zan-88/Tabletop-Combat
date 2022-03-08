import { useRef } from "react";
import { React, useState, useEffect } from "react";
import grid from "../images/grid.png";
export default function PlayerMap({ party }) {
  const initDim = useRef({ w: 1, h: 1 });
  const [imgDim, setImgDim] = useState({ w: "", h: "" });
  const [isLoaded, setIsLoaded] = useState(false);
  const [mapTokens, setMapTokens] = useState([]);
  const [gridSize, setGridSize] = useState({ w: 2000, h: 1000 });
  const [tileSize, setTileSize] = useState(44);
  const [loc, setLoc] = useState({ x: 0, y: 0 });

  function fitImage() {
    //IMAGE FITTING FUNCTIONALITY
    let container = document.getElementById("mapBack");
    let img = document.getElementById("ugh");
    // let wVal = 0;
    // let hVal = 0;
    // // if (
    // //   container.offsetWidth - initDim.current.w <
    // //   container.offsetHeight - initDim.current.h
    // // ) {
    // //   hVal = (initDim.current.h * container.offsetWidth) / initDim.current.w;
    // //   setImgDim({ w: `${container.offsetWidth}px`, h: `${hVal}px` });
    // //   console.log(initDim.current);
    // // } else {
    // //   wVal = (initDim.current.w * container.offsetHeight) / initDim.current.h;
    // //   setImgDim({ w: `${wVal}px`, h: `${container.offsetHeight}px` });
    // //   console.log(initDim.current);
    // // }
    // if (
    //   container.offsetWidth - img.naturalWidth <
    //   container.offsetHeight - img.naturalHeight
    // ) {
    //   hVal = (img.naturalHeight * container.offsetWidth) / img.naturalWidth;
    //   setImgDim({ w: `${container.offsetWidth}px`, h: `px` });
    //   console.log(img.naturalWidth);
    //   //setInitDim({ w: container.offsetWidth, h: hVal });
    // } else {
    //   wVal = (img.naturalWidth * container.offsetHeight) / img.naturalHeight;
    //   setImgDim({ w: `px`, h: `${container.offsetHeight}px` });
    //   console.log(img.naturalWidth);
    //   //setInitDim({ w: wVal, h: container.offsetHeight });
    // }

    //GRID FITTING FUNCTIONALITY
    if (img !== null) {
      let imgW = img.offsetWidth;
      let imgH = img.offsetHeight;
      let contW = container.offsetWidth;
      let contH = container.offsetHeight;

      if (imgH === contH) {
        let offset = imgH;
        let sps = offset / party.gridVal;
        let width = 50 * sps; //50 might seem magic but it is the width of the grid img divided by the size in pixels of one square
        setGridSize({ w: width, h: 0 });
        setTileSize(sps);
      } else {
        let offset = imgW;
        let sps = offset / party.gridVal;
        let dim = 50 * sps; //50 might seem magic but it is the width of the grid img divided by the size in pixels of one square
        setGridSize({ w: dim, h: 0 });
        setTileSize(sps);
      }
    }
  }

  useEffect(() => {
    let imag = document.getElementById("ugh");
    initDim.current.w = imag.offsetWidth;
    initDim.current.h = imag.offsetHeight;
    fitImage();
    setLoc({
      x: imag.offsetLeft,
      y: imag.clientTop,
    });

    window.addEventListener("resize", fitImage);

    return () => {
      window.removeEventListener("resize", fitImage);
    };
  }, [isLoaded]);
  return (
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

          width: `${imgDim.w}`,
          height: `${imgDim.h}`,
        }}
      >
        <div
          style={{
            position: "absolute",
            alignSelf: "center",
            width: `${imgDim.w}`,
            height: `${imgDim.h}`,
            top: loc.y,
            left: loc.x,
          }}
        >
          <div
            id="grid"
            style={{
              objectFit: "fill",
              background: `url(${grid}) no-repeat`,
              backgroundSize: `${gridSize.w}px `,
              position: "relative",
              width: `${imgDim.w}`,
              height: `${imgDim.h}`,
              zIndex: "10",
              opacity: "100%",
            }}
          ></div>
        </div>
      </div>
      <img
        id="ugh"
        src={party.mapUrl}
        style={{ width: "auto", height: "auto", objectFit: "contain" }}
        alt=""
      />
    </div>
  );
}
