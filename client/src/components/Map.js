import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import useDraggable from "../hooks/use-draggable";
import grid from "../images/grid.png";
import Token from "./Token";
import * as GameRequest from "../Functions/gameRequest";
import * as GridHelper from "../Functions/GridMapConv";

export default function Map({
  imageUrl,
  val,
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
  const notInitial = useRef(false);
  const [loc, setLoc] = useState({ x: 0, y: 0 });
  const mapTokRef = useRef(mapTokens);

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
      setMapTokens((prev) => [...prev, token]);
      console.log("fuck");
    };

    const changeToken = (sockTok) => {
      let newArr = mapTokRef.current;
      console.log(mapTokRef.current);
      let token = {
        x: sockTok.x,
        y: sockTok.y,
        url: sockTok.url,
        id: "char_" + sockTok.key,
        key: sockTok.key,
        dim: tileSize,
        partyCode: partyCode,
      };

      if (playerToken) {
        setPlayerToken(token);
      } else {
        newArr = newArr.filter((tok) => {
          console.log(tok.x + " | " + sockTok.x);
          console.log(tok.key !== sockTok.key);
          return tok.key !== sockTok.key;
        });
        newArr.push(token);
        setMapTokens([]);
        setMapTokens(newArr);
      }
      console.log("moved token");
    };

    const removeToken = (remKey) => {
      let newArr = mapTokRef.current;

      if (playerToken) {
        if (playerToken.key === remKey) setPlayerToken(null);
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

  //Delete Token effect
  useEffect(() => {
    if (notInitial.current) {
      let newArr = mapTokens;
      newArr = newArr.filter(function (tok) {
        return tok.key !== deleteKey;
      });
      setMapTokens([...newArr]);
      console.log(deleteKey);
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
      </div>
      {mapTokens.length > 0 &&
        mapTokens.map((token) => (
          <Token
            key={token.key}
            tileSize={tileSize}
            token={token}
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
