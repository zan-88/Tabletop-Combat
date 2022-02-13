import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import React, { useState, useEffect, useRef } from "react";
import Adjust from "@mui/icons-material/Adjust";
import Build from "@mui/icons-material/Build";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Map from "./Map";
import TokensPanel from "./TokensPanel";
import { storage, db } from "../firebase";
import styled from "styled-components";
import useDragFile from "../hooks/use-dragfile";
import { useDropzone } from "react-dropzone";
import Tools from "./Tools";
import Grid4x4Icon from "@mui/icons-material/Grid4x4";
import GridTool from "./GridTool";

import grid from "../images/grid.png";
import draggable from "../Functions/draggable";
import Token from "./Token";

function Combat({ url, setUrl, urls, setUrls }) {
  const [value, setValue] = useState(0);

  const [image, setImage] = useState("");

  const [val, setVal] = useState(1);

  const notInitial = useRef(false);

  const [initDim, setInitDim] = useState({ w: 0, h: 0 });
  const [imgDim, setImgDim] = useState({ w: "", h: "" });
  const [isLoaded, setIsLoaded] = useState(false);
  const [loc, setLoc] = useState({ x: 0, y: 0 });
  const [mapTokens, setMapTokens] = useState([]);

  const [tokens, setTokens] = useState([]);
  const [tileSize, setTileSize] = useState(44);
  const gridVal = useRef(20);

  useDragFile("dragArea");

  //stores id for grid and changes if grid movement is not required
  const [grid, setGrid] = useState({ w: 2000, h: 1000 });

  // function tokenHandle(url) {
  //   let src = url;
  //   let val = tokens.length;
  //   let token = document.getElementById("token_" + val);

  //   console.log(token.offsetLeft + " | " + token.offsetTop);
  //   setTokens([
  //     ...tokens,
  //     {
  //       x: token.offsetLeft,
  //       y: token.offsetTop,
  //       url: src,
  //       id: "char_" + val,
  //       key: val,
  //       dim: token.offsetWidth,
  //     },
  //   ]);
  // }
  function fitImage() {
    //IMAGE FITTING FUNCTIONALITY
    let container = document.getElementById("mapBack");
    let img = document.getElementById("ugh");
    if (
      container.offsetWidth - img.width <
      container.offsetHeight - img.height
    ) {
      let hVal = (img.height * container.offsetWidth) / img.width;
      setImgDim({ w: `${container.offsetWidth}px`, h: `${hVal}px` });
      setInitDim({ w: container.offsetWidth, h: hVal });
    } else {
      let wVal = (img.width * container.offsetHeight) / img.height;
      setImgDim({ w: `${wVal}px`, h: `${container.offsetHeight}px` });
      setInitDim({ w: wVal, h: container.offsetHeight });
    }

    //GRID FITTING FUNCTIONALITY
    if (img !== null) {
      let imgW = img.offsetWidth;
      let imgH = img.offsetHeight;
      let contW = container.offsetWidth;
      let contH = container.offsetHeight;

      if (imgH === contH) {
        let offset = imgH;
        let sps = offset / gridVal.current;
        let width = 50 * sps; //50 might seem magic but it is the width of the grid img divided by the size in pixels of one square
        setGrid({ w: width, h: 0 });
        setTileSize(sps);
      } else {
        let offset = imgW;
        let sps = offset / gridVal.current;
        let dim = 50 * sps; //50 might seem magic but it is the width of the grid img divided by the size in pixels of one square
        setGrid({ w: dim, h: 0 });
        setTileSize(sps);
      }
    }
  }

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    maxFiles: 1,
    init: function () {
      this.hiddenFileInput.removeAttribute("multiple");
    },
    onDrop: (acceptedFiles) => {
      setImage(acceptedFiles[0]);
    },
  });

  useEffect(() => {
    if (notInitial.current) {
      handleUpload();
    } else {
      notInitial.current = true;
    }
  }, [image]);

  const img = new Image();

  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeMap = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    const uploadTask = storage.ref(`map/${image.name}`).put(image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        console.log(error);
      },
      () => {
        storage
          .ref("map")
          .child(image.path)
          .getDownloadURL()
          .then((url) => {
            setUrl(url);
            img.src = url;
            img.onload = function () {
              setIsLoaded(true);
            };
            db.collection("map")
              .doc("link")
              .set({
                map: url,
              })
              .then((docRef) => {
                console.log("Document written with ID: ", docRef.id);
              })
              .catch((error) => {
                console.error("Error adding document: ", error);
              });
          });
      }
    );
  };
  return (
    <>
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
          <Tabs
            style={{ backgroundColor: "black", zIndex: "1000" }}
            variant="scrollable"
            value={value}
            onChange={handleChangeTab}
            aria-label="simple tabs example"
          >
            <Tab
              style={{ minWidth: "33%", zIndex: "1000" }}
              icon={<Grid4x4Icon style={{ color: "white" }} />}
            />
            <Tab
              icon={<AccountCircleIcon style={{ color: "white" }} />}
              style={{ minWidth: "33%", zIndex: "1000" }}
            />
            <Tab
              icon={<Build style={{ color: "white" }} />}
              style={{ minWidth: "33%", zIndex: "1000" }}
            />
          </Tabs>
          <div style={{ display: value === 0 ? "inline" : "none" }}>
            <GridTool
              setGrid={setGrid}
              setTile={setTileSize}
              gridVal={gridVal}
            />
          </div>
          <div
            style={{ height: "100%", display: value === 1 ? "inline" : "none" }}
          >
            <TokensPanel
              urls={urls}
              setUrls={setUrls}
              setMapTokens={setMapTokens}
              tileSize={tileSize}
            />
          </div>
          <div style={{ display: value === 2 ? "inline" : "none" }}>
            <Tools />
          </div>
        </div>
        {url === "" ? (
          <MapSection>
            <MapBorder id="dragArea" {...getRootProps()}>
              <input style={{ width: "100%" }} {...getInputProps()} />
              <MapText>Choose Map Or Drag It Here</MapText>
              <CloudUploadIcon style={Cloud} />
            </MapBorder>
          </MapSection>
        ) : (
          <Map
            imageUrl={url}
            loc={loc}
            dim={imgDim}
            fitImage={fitImage}
            setLoc={setLoc}
            isLoaded={isLoaded}
            gridVal={grid}
            mapTokens={mapTokens}
            setMapTokens={setMapTokens}
            tileSize={tileSize}
          />
        )}
      </div>
    </>
  );
}

export default Combat;

const MapSection = styled.div`
  height: 100%;
  background-color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-grow: 5;
`;

const MapBorder = styled.div`
  border: 5px dashed #940a0a;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  align-self: center;
  width: 80%;
  height: 80%;
  color: #940a0a;
  opacity: 50%;
`;

const MapText = styled.div`
  font-size: 5vh;
  text-align: center;
`;

const MapBtn = styled.button`
  width: 40%;
  align-self: center;
  margin: 2%;
  padding: 3%;
  border-color: #940a0a;
  background-color: #940a0a;
  color: white;
  border-radius: 8px;
`;

const Cloud = {
  fontSize: "25vh",
  alignItems: "center",
  alignSelf: "center",
};
