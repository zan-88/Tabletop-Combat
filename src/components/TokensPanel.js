import { ImageList } from "@material-ui/core";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { storage, db } from "../firebase";
import useDragFile from "../hooks/use-dragfile";
import { useDropzone } from "react-dropzone";
import styled from "styled-components";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Token from "./Token";
import * as GridHelper from "../Functions/GridMapConv";

function TokensPanel({ urls, setUrls, setMapTokens, tileSize }) {
  const notInitial = useRef(false);

  document.body.style.overflow = "hidden";

  let bar = document.getElementById("tokenBar");

  const [images, setImages] = useState([]);
  const [panelTokens, setPanelTokens] = useState([]);
  const [deleteKey, setDeleteKey] = useState(-1);
  const [newTokUrl, setNewTokUrl] = useState("");
  const [keyVal, setKeyVal] = useState(0);
  const [mapTok, setMapTok] = useState({
    url: "",
    pos: { x: 0, y: 0 },
    key: -1,
  });
  const scale = useRef(1);

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    maxFiles: 20,

    onDrop: (acceptedFiles) => {
      setImages(acceptedFiles);
      if (acceptedFiles.length > 1) {
        bar.style.justifyContent = "center";
      }
    },
  });

  useEffect(() => {
    if (notInitial.current) {
      newToken(urls[urls.length - 1]);
      //window.addEventListener("wheel", onScroll);
    } else {
      notInitial.current = true;
    }
  }, [urls]);

  useEffect(() => {
    if (notInitial.current) {
      handleUpload();
    } else {
      notInitial.current = true;
    }
  }, [images]);

  //Transfer token to map
  useEffect(() => {
    if (notInitial.current) {
      let coordPos = GridHelper.MapToCoord(mapTok.pos, "grid", tileSize);
      setMapTokens((prev) => [
        ...prev,
        {
          x: coordPos.x,
          y: coordPos.y,
          url: mapTok.url,
          id: "char_" + mapTok.key,
          key: mapTok.key,
          dim: tileSize,
          isPanel: true,
        },
      ]);
      newToken(mapTok.url);
    }
  }, [mapTok]);

  //Delete Token effect
  useEffect(() => {
    if (notInitial.current) {
      let newArr = panelTokens;
      console.log("EVEN MORE FUCKK");
      newArr = newArr.filter(function (tok) {
        return tok.key !== deleteKey;
      });
      console.log(newArr);
      setPanelTokens([...newArr]);
    }
  }, [deleteKey]);

  //New Token effect
  useEffect(() => {
    if (newTokUrl !== "") {
      newToken(newTokUrl);
    }
  }, [newTokUrl]);

  function handleTokens(e) {
    const border = document.getElementById("grid");
    console.log(e);
    let id = e.target.id;
    let key = parseInt(id.replace("char_", ""));
    let url = panelTokens[key].url;
    if (border) {
      let x = border.getBoundingClientRect().left;
      let y = border.getBoundingClientRect().top;
      let width = border.offsetWidth;
      let height = border.offsetHeight;

      if (
        e.clientX > x &&
        e.clientX < x + width &&
        e.clientY > y &&
        e.clientY < y + height
      ) {
        setMapTokens((toks) => [...toks, panelTokens[key]]);
      }
    }
    let newArr = panelTokens;
    console.log("FUCCCKKKK");
    newArr.splice(key, 1);
    console.log(newArr);
    setPanelTokens([...newArr]);
    console.log("KEY STUFF: " + key);
    newToken(url);
  }

  useDragFile("tokenArea");

  const handleUpload = () => {
    images.map((image) => {
      const uploadTask = storage.ref(`tokens/${image.name}`).put(image);
      uploadTask.on(
        "state_changed",
        (snapshot) => {},
        (error) => {
          console.log(error);
        },
        async () => {
          await storage
            .ref("tokens")
            .child(image.path)
            .getDownloadURL()
            .then((url) => {
              setUrls((prevState) => [...prevState, url]);

              /*
              db.collection("map")
                .doc("link")
                .add({
                  map: url,
                })
                .then((docRef) => {
                  console.log("Document written with ID: ", docRef.id);
                })
                .catch((error) => {
                  console.error("Error adding document: ", error);
                });*/
            });
        }
      );
    });
  };

  function newToken(url) {
    let val = urls.findIndex(function (temp) {
      return temp === url;
    });
    let panelLoc = document.getElementById("tokenBar");

    if (panelLoc) {
      let width = panelLoc.offsetWidth;
      let tokWidth = width / 2 - 0.05 * width;
      let height = panelLoc.offsetHeight;
      let x =
        val % 2 === 0
          ? panelLoc.offsetLeft + 0.05 * width
          : panelLoc.offsetLeft + width - (0.05 * width + tokWidth);
      let y =
        panelLoc.getBoundingClientRect().top +
        0.04 * height +
        tokWidth * (val / 2) +
        10 * val;
      let newArr = panelTokens;
      setKeyVal(keyVal + 1);
      newArr.push({
        x: x,
        y: y,
        url: url,
        id: "char_" + keyVal,
        key: keyVal,
        dim: tokWidth,
        isPanel: true,
      });

      setPanelTokens([...newArr]);
      console.log("______");
      console.log(panelTokens.length);
      console.log(panelTokens);
    }
  }

  // function handleMouseDown(tok) {
  //   let tmep = document.getElementById("tokenPlaced");

  //   if (panelTokens.length > 0) {
  //     tmep.innerHTML = `<Token
  //     key={tok.key}
  //     tileSize={tileSize}
  //     token={tok}
  //     setDeleteKey={setDeleteKey}
  //     setNewTokUrl={setNewTokUrl}
  //     setMapTok={setMapTok}
  //     isPanel={true}
  //   />`;
  //   }
  // }

  return (
    <TokenContainer>
      <TokenDrag>
        <TokenBorder id="tokenArea" {...getRootProps()}>
          <TokenText>Choose Tokens or Drag Here</TokenText>
          <input style={{ width: "100%" }} {...getInputProps()} />
          <CloudUploadIcon style={Cloud} />
        </TokenBorder>
      </TokenDrag>
      <TokenBar id="tokenBar">
        {/* {urls.map((url, i) => (
          <TokenHolder key={i} src={url} alt="" />
        ))} */}
        {/* {panelTokens.length > 0 &&
          panelTokens.map((token) => (
            <div
              onMouseDown={handleMouseDown(token)}
              key={token.key}
              style={{
                position: "relative",
                backgroundImage: `url(${token.url})`,
                left: `${token.x}px`,
                WebkitBackgroundSize: "contain",
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                width: `${token.dim}px`,
                height: `${token.dim}px`,
                minWidth: "100%",
              }}
            />
          ))}{" "}
        <div id="tokenPlaced"></div> */}
        <div>
          {panelTokens.length > 0 &&
            panelTokens.map((token) => (
              <Token
                key={token.key}
                tileSize={tileSize}
                token={token}
                setDeleteKey={setDeleteKey}
                setNewTokUrl={setNewTokUrl}
                setMapTok={setMapTok}
                isPanel={true}
              />
            ))}{" "}
        </div>
      </TokenBar>
    </TokenContainer>
  );
}

export default TokensPanel;

const TokenContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 100%;
  height: 100%;
`;

const TokenBar = styled.div`
  overflow-x: hidden;
  overflow-y: auto;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-content: flex-start;
  width: 100%;
  height: 80%;
`;

const TokenHolder = styled.img`
  flex-grow: 1;
`;

const TokenDrag = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  margin: 4%;
  height: 20%;
`;
const TokenBorder = styled.div`
  border: 5px dashed white;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 90%;
  color: white;
  opacity: 50%;
  z-index: 100;
`;

const TokenText = styled.div`
  font-size: 1.1em;
  text-align: center;
  padding: 1%;
`;

const Cloud = {
  fontSize: "10vh",
  width: "100%",
};
