import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import useDraggable from "../hooks/use-draggable";
import grid from "../images/grid.png";
import Token from "./Token";
import * as GameRequest from "../Functions/gameRequest";
import * as GridHelper from "../Functions/GridMapConv";

export default function Map({
  imageUrl,
  dim,
  fitImage,
  isLoaded,
  gridVal,
  mapTokens,
  setMapTokens,
  tileSize,
  playerToken = null,
  socket,
  partyCode,
  isOwner = false,
  setPlayerToken = null,
}) {
  const [deleteKey, setDeleteKey] = useState("");
  const [changeKey, setChangeKey] = useState({ token: null, coord: null });
  const notInitial = useRef(false);
  const [loc, setLoc] = useState({ x: 0, y: 0 });
  const mapTokRef = useRef(mapTokens);
  const playerTokRef = useRef({ key: -1 });
  const [extToks, setExtToks] = useState(null);

  useEffect(() => {
    const placeToken = (sockTok) => {
      let token = {
        x: sockTok.position.x,
        y: sockTok.position.y,
        url: sockTok.url,
        id: "char_" + sockTok.key,
        key: sockTok.key,
        dim: tileSize,
        partyCode: partyCode,
      };
      removeToken(sockTok.key);
      setMapTokens((prev) => [...prev, token]);
    };

    const changeToken = (sockTok) => {
      let newArr = mapTokRef.current;
      let token = {
        x: sockTok.x,
        y: sockTok.y,
        url: sockTok.url,
        id: "char_" + sockTok.key,
        key: sockTok.key,
        dim: sockTok.tileSize,
        partyCode: partyCode,
      };

      if (playerTokRef.current.key === sockTok.key) {
        setPlayerToken(null);
        setPlayerToken(token);
      } else {
        newArr = newArr.filter((tok) => {
          return tok.key !== sockTok.key;
        });
        newArr.push(token);
        setMapTokens([]);
        setMapTokens(newArr);
      }
    };

    const removeToken = (remKey) => {
      let newArr = mapTokRef.current;

      if (playerTokRef.current.key === remKey) {
        setPlayerToken(null);
      } else {
        newArr = newArr.filter((tok) => {
          return tok.key !== remKey;
        });
        setMapTokens(newArr);
      }
    };

    socket.on("palce-token-map", placeToken);
    socket.on("change-token-map", changeToken);
    socket.on("remove-token-map", removeToken);

    return () => {
      socket.off("palce-token-map", placeToken);
      socket.off("change-token-map", changeToken);
      socket.off("remove-token-map", removeToken);
    };
  }, [socket]);

  //Update Map Tokens effect
  useEffect(() => {
    if (notInitial.current) {
      let newArr = mapTokens;
      newArr = newArr.filter(function (tok) {
        return tok.key !== changeKey.token.key;
      });

      let token = {
        x: changeKey.coord.x,
        y: changeKey.coord.y,
        url: changeKey.token.url,
        id: "char_" + changeKey.token.key,
        key: changeKey.token.key,
        dim: changeKey.token.tileSize,
        partyCode: partyCode,
      };
      newArr.push(token);
      setMapTokens([...newArr]);
    }
  }, [changeKey]);

  //Delete Token effect
  useEffect(() => {
    if (notInitial.current) {
      if (playerTokRef.current.key === deleteKey) {
        setPlayerToken(null);
      } else {
        let newArr = mapTokens;
        newArr = newArr.filter(function (tok) {
          return tok.key !== deleteKey;
        });
        setMapTokens([...newArr]);
      }

      GameRequest.deleteToken(deleteKey);

      socket.emit("delete-token-map", deleteKey);
    } else {
      notInitial.current = true;
    }
  }, [deleteKey]);

  useEffect(() => {
    mapTokRef.current = mapTokens;
  }, [mapTokens]);

  useEffect(() => {
    let imag = document.getElementById("ugh");

    fitImage();
    setLoc({
      x: imag.offsetLeft,
      y: imag.clientTop,
    });

    window.addEventListener("resize", fitImage);

    if (isLoaded) {
      async function fetchTokens() {
        await GameRequest.getTokens(
          {
            params: { partyCode: partyCode },
          },
          setExtToks
        );
      }

      fetchTokens();
    }
  }, [isLoaded]);

  useEffect(() => {
    playerTokRef.current = playerToken ? playerToken : { key: -1 };
  }, [playerToken]);

  useEffect(() => {
    let newArr = [];
    if (extToks) {
      extToks.forEach((ext) => {
        let coordPos = ext.location;
        console.log(coordPos);
        let token = {
          x: coordPos.x,
          y: coordPos.y,
          url: ext.imageUrl,
          id: ext.token_id,
          key: `${ext.token_key}`,
          dim: tileSize,
          partyCode: ext.partyCode,
        };
        newArr.push(token);
      });
      setMapTokens((prev) => [...prev, ...newArr]);
    }
  }, [extToks]);

  useEffect(() => {
    console.log(mapTokens);
  }, [mapTokens]);

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
      </div>
      {mapTokens.length > 0 &&
        mapTokens.map((token) => (
          <Token
            key={token.key}
            tileSize={tileSize}
            token={token}
            setChangeKey={setChangeKey}
            setDeleteKey={setDeleteKey}
            setNewTokUrl={undefined}
            setMapTok={null}
            isOwner={isOwner}
            socket={socket}
          />
        ))}{" "}
      {playerToken && (
        <Token
          key={playerToken.key}
          tileSize={tileSize}
          token={playerToken}
          setDeleteKey={setDeleteKey}
          setNewTokUrl={undefined}
          setMapTok={null}
          isOwner={true}
          socket={socket}
        />
      )}
    </>
  );
}
