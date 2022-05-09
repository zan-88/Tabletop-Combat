import React, { useEffect, useRef, useState } from "react";
import Token from "./Token";
import { ImageList } from "@material-ui/core";
import { storage, db } from "../firebase";
import useDragFile from "../hooks/use-dragfile";
import draggable from "../Functions/draggable";
import { useDropzone } from "react-dropzone";
import styled from "styled-components";
import * as GridHelper from "../Functions/GridMapConv";
import * as GameRequest from "../Functions/gameRequest";

export default function TokenFocus({
  url,
  setMapTokens,
  tileSize,
  partyCode,
  socket,
}) {
  const notInitial = useRef(false);
  const [panelTokens, setPanelTokens] = useState([]);
  const activeToken = useRef({});
  let isTokenActive = false;
  const [deleteKey, setDeleteKey] = useState(-1);
  const [keyVal, setKeyVal] = useState(0);
  const [mapTok, setMapTok] = useState({
    url: "",
    pos: { x: 0, y: 0 },
    key: -1,
  });
  const scale = useRef(1);
  const [cToken, setCToken] = useState(null);

  function TransferToken(mapTok) {
    let coordPos = GridHelper.MapToCoord(mapTok.pos, "grid", tileSize);
    let token = {
      x: coordPos.x,
      y: coordPos.y,
      url: mapTok.url,
      id: `${partyCode}(DM)${mapTok.key}`,
      key: `${partyCode}(DM)${mapTok.key}`,
      dim: tileSize,
      partyCode: partyCode,
    };
    setMapTokens((prev) => [...prev, token]);
    if (token.key !== `${partyCode}(DM)-1`) GameRequest.setToken(token);
    //newToken(mapTok.url);
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
    if (url !== "") {
      newToken(url);
    }
  }, [url]);

  function newToken() {
    let val = url;
    let panelLoc = document.getElementById("tokenBar");

    if (panelLoc) {
    }
  }

  return (
    <Focus id="focus">
      <TokenCont>Test</TokenCont>
    </Focus>
  );
}

const Focus = styled.div`
  width: 100%;
  height: inherit;
`;

const TokenCont = styled.div`
  width: 100%;
  height: 20%;
`;
