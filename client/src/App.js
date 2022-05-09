import "./App.css";
import React, { useEffect, useState, useStyles } from "react";
import Combat from "./components/Combat";
import Hub from "./components/Hub";
import styled from "styled-components";
import PlayerSetUp from "./components/PlayerSetUp";
import PlayerCombat from "./components/PlayerCombat";
import "bootstrap/dist/css/bootstrap.min.css";
import * as GameRequest from "./Functions/gameRequest";
import { io } from "socket.io-client";

function App() {
  const [value, setValue] = useState(-1);
  const [partyCode, setPartyCode] = useState("");
  const [url, setUrl] = useState("");
  const [urls, setUrls] = useState([]);

  const [party, setParty] = useState(null);

  const [playerInfo, setPlayerInfo] = useState(null);

  const [socket, setSocket] = useState(null);

  let dev = "http://localhost:5000";
  let prod = "https://ns1.hasted-backend.epizy.com";

  useEffect(() => {
    const newSocket = io(dev, {
      withCredentials: true,
      transports: ["websocket"],
    });

    setSocket(newSocket);
    newSocket.on("connect_error", (err) => {
      console.log(`connect_error due to ${err.message}`);
    });
    return () => {
      newSocket.off("connect_error", (err) => {
        console.log(`connect_error due to ${err.message}`);
      });
      newSocket.close();
      socket.close();
    };
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      <TopBar>
        <TitleText>Hasted Tables</TitleText>
      </TopBar>
      {url === "" && <div id="grid"></div>}
      {value === -1 && <Hub setValue={setValue} />}

      {value === 1 && (
        <Combat
          url={url}
          setUrl={setUrl}
          urls={urls}
          setUrls={setUrls}
          partyCode={partyCode}
          setPartyCode={setPartyCode}
          socket={socket}
        />
      )}

      {value === 2 && (
        <PlayerSetUp
          setPlayerInfo={setPlayerInfo}
          setValue={setValue}
          setParty={setParty}
        />
      )}

      {value === 3 && (
        <PlayerCombat
          playerInfo={playerInfo}
          setUrl={setUrl}
          socket={socket}
          partyCode={partyCode}
          party={party}
        />
      )}
    </div>
  );
}
export default App;

const TopBar = styled.div`
  background-color: black;
  border-style: groove;
  border-color: #940a0a;
  width: 100%;
  height: 5%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 5% 0 5%;
`;

const TitleText = styled.div`
  font-family: "Faster One", cursive;
  color: #8a8a8a;
  font-size: 3vh;
`;
