import { ImageList } from "@material-ui/core";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { storage, db } from "../firebase";
import useDragFile from "../hooks/use-dragfile";
import draggable from "../Functions/draggable";
import { useDropzone } from "react-dropzone";
import styled from "styled-components";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Token from "./Token";
import * as GridHelper from "../Functions/GridMapConv";
import * as GameRequest from "../Functions/gameRequest";

function TokensPanel({
  urls,
  setUrls,
  setMapTokens,
  tileSize,
  partyCode,
  socket,
}) {
  const notInitial = useRef(false);

  document.body.style.overflow = "hidden";

  let bar = document.getElementById("tokenBar");

  //token scroll modifier
  const [triggerResize, setTriggerResize] = useState(-1);
  const scrollDis = useRef(0);
  const scrollRect = useRef({ y: 0, height: 0 });

  useEffect(() => {
    let panel = document.getElementById("tokenBar");

    panel.addEventListener("wheel", function (e) {
      let panelLoc = document.getElementById("tokenBar");
      let height = panelLoc.offsetHeight;

      if (
        (scrollRect.current.height - scrollDis.current >= window.innerHeight &&
          e.deltaY > 0) ||
        (scrollRect.current.y >=
          panelLoc.getBoundingClientRect().top + 0.04 * height &&
          e.deltaY < 0)
      ) {
        setTriggerResize(scrollDis.current + e.deltaY * 0.1);
        scrollDis.current += e.deltaY * 0.1;
        scrollRect.current.y += e.deltaY * 0.1;
      }
    });
  }, []);

  const [images, setImages] = useState([]);
  const [panelTokens, setPanelTokens] = useState([]);
  const activeToken = useRef({});
  let isTokenActive = false;
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

  function TransferToken(mapTok) {
    let coordPos = GridHelper.MapToCoord(mapTok.pos, "grid", tileSize);
    let token = {
      x: coordPos.x,
      y: coordPos.y,
      url: mapTok.url,
      id: "char_" + mapTok.key,
      key: `${partyCode}(DM)${mapTok.key}`,
      dim: tileSize,
      partyCode: partyCode,
    };
    setMapTokens((prev) => [...prev, token]);
    if (token.key !== `${partyCode}(DM)-1`) GameRequest.setToken(token);
    newToken(mapTok.url);
  }

  //Transfer token to map
  useEffect(() => {
    if (notInitial.current && mapTok.key !== -1) {
      TransferToken(mapTok);
      let coord = GridHelper.MapToCoord(mapTok.pos, "grid", tileSize);
      socket.emit("add-token-map", {
        key: `${partyCode}(DM)${mapTok.key}`,
        position: coord,
        url: mapTok.url,
      });
    }
  }, [mapTok]);

  //Delete Token effect
  useEffect(() => {
    if (notInitial.current) {
      let newArr = panelTokens;
      newArr = newArr.filter(function (tok) {
        return tok.key !== deleteKey;
      });
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
    newArr.splice(key, 1);
    setPanelTokens([...newArr]);
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
        partyCode: partyCode,
      });

      setPanelTokens([...newArr]);
      if (y + tokWidth + triggerResize > scrollRect.current.height)
        scrollRect.current.height = y + tokWidth + scrollDis.current;

      if (urls.length === 1) scrollRect.current.y = y;
    }
  }

  return (
    <TokenContainer>
      <TokenDrag id="tokenDrag">
        <TokenBorder id="tokenArea" {...getRootProps()}>
          <TokenText>Choose Tokens or Drag Here</TokenText>
          <input style={{ width: "100%" }} {...getInputProps()} />
          <CloudUploadIcon style={Cloud} />
        </TokenBorder>
      </TokenDrag>
      <TokenBar id="tokenBar">
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
                triggerResize={triggerResize}
                scrollDis={scrollDis}
                isOwner={true}
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
  padding: 4%;
  height: 20%;
  background-color: #940a0a;
  z-index: 100;
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
  z-index: 100;
`;

const Cloud = {
  fontSize: "10vh",
  width: "100%",
  zIndex: "10",
};
