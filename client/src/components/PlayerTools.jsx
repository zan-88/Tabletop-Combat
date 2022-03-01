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

function PlayerTools({ url, setPlayerToken, tileSize, partyCode }) {
  const notInitial = useRef(false);

  document.body.style.overflow = "hidden";

  //token scroll modifier
  const [triggerResize, setTriggerResize] = useState(-1);
  const scrollDis = useRef(0);
  const scrollRect = useRef({ y: 0, height: 0 });

  const [images, setImages] = useState([]);
  const [panelTokens, setPanelTokens] = useState([]);
  const activeToken = useRef({});
  let isTokenActive = false;
  const [deleteKey, setDeleteKey] = useState(-1);
  const [newTokUrl, setNewTokUrl] = useState("");
  const [keyVal, setKeyVal] = useState(0);
  const [mapTok, setMapTok] = useState(null);

  useEffect(() => {
    newToken(url);
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

  //Transfer token to map
  useEffect(() => {
    if (mapTok !== null && mapTok.key !== -1) {
      let coordPos = GridHelper.MapToCoord(mapTok.pos, "grid", tileSize);
      let token = {
        x: coordPos.x,
        y: coordPos.y,
        url: mapTok.url,
        id: "char_" + mapTok.key,
        key: `${partyCode}(P)${mapTok.key}`,
        dim: tileSize,
        partyCode: partyCode,
      };
      setPlayerToken(token);
      if (mapTok.key !== -1) GameRequest.setToken(token);
      newToken(mapTok.url);
      setMapTok(null);
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

  useEffect(() => {
    notInitial.current = true;
  });

  function newToken(url) {
    let panelLoc = document.getElementById("tokenBar");

    if (panelLoc) {
      let width = panelLoc.offsetWidth;
      let tokWidth = width / 2 - 0.05 * width;
      let height = panelLoc.offsetHeight;
      let x = panelLoc.offsetLeft + 0.05 * width;
      let y = panelLoc.getBoundingClientRect().top + 0.04 * height;
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
    }
  }

  return (
    <TokenContainer>
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

export default PlayerTools;

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
