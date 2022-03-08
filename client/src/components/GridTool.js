import React, { useEffect, useState } from "react";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";
import "bootstrap/dist/css/bootstrap.css";
import Button from "react-bootstrap/Button";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import styled from "styled-components";

export default function GridTool({
  setGrid,
  setTile,
  gridVal,
  partyCode,
  setPartyCode,
  isMap,
}) {
  let value = "";
  const [prevDim, setPrevDim] = useState(true);

  const [btnText, setBtnText] = useState("Set Map Before starting your party!");

  function handleAdjustClick() {
    let img = document.getElementById("ugh");
  }

  useEffect(() => {
    if (isMap) {
      setBtnText("Start Party!");
    }
  }, [isMap]);

  function handleAdjustSlide(e) {
    let val = parseInt(e.target.value);
    gridVal.current = val;
    let img = document.getElementById("ugh");
    let container = document.getElementById("mapBack");
    if (img !== null) {
      let imgW = img.offsetWidth;
      let imgH = img.offsetHeight;
      let contW = container.offsetWidth;
      let contH = container.offsetHeight;

      if (imgH === contH) {
        let offset = imgH;
        let sps = offset / val;
        //sps = Number.parseFloat(sps.toFixed(4));
        let width = 50 * sps; //50 might seem magic but it is the width of the grid img divided by the size in pixels of one square
        setGrid({ w: width, h: 0 });
        let temp;
        if (prevDim) {
          temp = Math.ceil(imgW / sps);
          setPrevDim(!prevDim);
        } else {
          temp = Math.floor(imgW / sps);
          setPrevDim(!prevDim);
        }
        temp = sps * temp;
        //setDim({ w: `${temp}px`, h: `${contH}px` });

        //Since height is going to have full squares, bases single tile dimension off height
        setTile(sps);
      } else {
        let offset = imgW;
        let sps = offset / val;
        //sps = Number.parseFloat(sps.toFixed(4));
        let dim = 50 * sps; //50 might seem magic but it is the width of the grid img divided by the size in pixels of one square
        setGrid({ w: dim, h: 0 });
        let temp;
        if (prevDim) {
          temp = Math.ceil(imgW / sps);
          setPrevDim(!prevDim);
        } else {
          temp = Math.floor(imgW / sps);
          setPrevDim(!prevDim);
        }
        temp = sps * temp;
        //setDim({ w: `${contW}px`, h: `${temp}px` });

        setTile(sps);
      }
    }
  }

  const handleParty = () => {
    let codeLen = 6;
    let temp = "";
    while (codeLen > 0) {
      temp += String.fromCharCode(Math.floor(Math.random() * 26) + 65);
      codeLen--;
    }
    setPartyCode(temp);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-evenly",
        padding: "5%",
        zIndex: "1000000000",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
          margin: "3%",
          marginBottom: "5%",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <div>
            <ArrowCircleLeftIcon></ArrowCircleLeftIcon> Less
          </div>
          <div>
            More
            <ArrowCircleRightIcon></ArrowCircleRightIcon>
          </div>
        </div>
        <Slider
          style={{
            zIndex: "1000000000",
            color: "red",
          }}
          aria-label="Small steps"
          defaultValue={20}
          step={1}
          getAriaValueText={value}
          min={5}
          max={50}
          valueLabelDisplay="auto"
          onChange={handleAdjustSlide}
        />
        {partyCode === "" && (
          <Button
            onClick={handleParty}
            variant="outline-dark"
            disabled={!isMap}
          >
            {btnText}
          </Button>
        )}
        {partyCode !== "" && <PartyCode>Party Code: {partyCode}</PartyCode>}
      </div>
    </div>
  );
}

const PartyCode = styled.div`
  color: black;
  font-size: 2vh;
  font-family: Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif;
  text-align: center;
`;
