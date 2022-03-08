import React, { useEffect, useState } from "react";
import Map from "./Map";
import * as GameRequest from "../Functions/gameRequest";
import PlayerTools from "./PlayerTools";

export default function PlayerCombat({
  playerInfo,
  setUrl,
  socket,
  partyCode,
  party,
  extToks,
}) {
  const [initDim, setInitDim] = useState({ w: 0, h: 0 });
  const [imgDim, setImgDim] = useState({ w: "", h: "" });
  const [isLoaded, setIsLoaded] = useState(false);
  const [mapTokens, setMapTokens] = useState([]);
  const [playerToken, setPlayerToken] = useState(null);
  const [grid, setGrid] = useState({ w: 2000, h: 1000 });
  const [tileSize, setTileSize] = useState(44);

  const imag = new Image();

  useEffect(() => {
    if (party) {
      setUrl(party.mapUrl);
      imag.src = party.mapUrl;
      imag.onload = function () {
        setIsLoaded(true);
      };
    }
  }, [party]);

  function fitImage() {
    //IMAGE FITTING FUNCTIONALITY
    let container = document.getElementById("mapBack");
    let img = document.getElementById("ugh");
    let hVal = container.offsetHeight;
    let wVal = container.offsetWidth;
    if (
      container.offsetWidth - img.width <
      container.offsetHeight - img.height
    ) {
      hVal = (img.height * container.offsetWidth) / img.width;
      setImgDim({ w: `${container.offsetWidth}px`, h: `${hVal}px` });
      setInitDim({ w: container.offsetWidth, h: hVal });
    } else {
      wVal = (img.width * container.offsetHeight) / img.height;
      setImgDim({ w: `${wVal}px`, h: `${container.offsetHeight}px` });
      setInitDim({ w: wVal, h: container.offsetHeight });
    }

    //GRID FITTING FUNCTIONALITY
    if (img !== null) {
      let contW = container.offsetWidth;
      let contH = container.offsetHeight;

      if (hVal === contH) {
        let offset = hVal;
        let sps = offset / party.gridVal;
        let width = 50 * sps; //50 might seem magic but it is the width of the grid img divided by the size in pixels of one square
        setGrid({ w: width, h: 0 });
        setTileSize(sps);
      } else {
        let offset = wVal;
        let sps = offset / party.gridVal;
        let dim = 50 * sps; //50 might seem magic but it is the width of the grid img divided by the size in pixels of one square
        setGrid({ w: dim, h: 0 });
        setTileSize(sps);
      }
    }
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        backgroundColor: "white",
        height: "100%",
      }}
    >
      <div
        id="selection"
        style={{
          flexBasis: "15%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#940a0a",
          zIndex: "1000",
        }}
      >
        <PlayerTools
          playerInfo={playerInfo}
          setPlayerToken={setPlayerToken}
          tileSize={tileSize}
          socket={socket}
        />
      </div>

      <Map
        imageUrl={party.mapUrl}
        dim={imgDim}
        fitImage={fitImage}
        isLoaded={isLoaded}
        gridVal={grid}
        mapTokens={mapTokens}
        setMapTokens={setMapTokens}
        tileSize={tileSize}
        playerToken={playerToken}
        socket={socket}
        partyCode={playerInfo.partyCode}
        setPlayerToken={setPlayerToken}
      />
    </div>
  );
}
