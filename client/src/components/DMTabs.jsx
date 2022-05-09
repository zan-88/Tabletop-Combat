import React, { useState } from "react";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Adjust from "@mui/icons-material/Adjust";
import Build from "@mui/icons-material/Build";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SquareFootIcon from "@mui/icons-material/SquareFoot";
import GridTool from "./GridTool";
import TokensPanel from "./TokensPanel";
import Tools from "./Tools";
import TokenFocus from "./TokenFocus";

export default function DMTabs({
  setGrid,
  setTileSize,
  gridVal,
  partyCode,
  setPartyCode,
  isMap,
  urls,
  setUrls,
  setMapTokens,
  tileSize,
  socket,
}) {
  const [value, setValue] = useState(0);

  const [newToken, setNewToken] = useState("");

  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <div
      id="selection"
      style={{
        flexBasis: "15%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#940a0a",
        zIndex: "1000",
        width: "inherit",
        height: "inherit",
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
          icon={<Build style={{ color: "white" }} />}
        />
        <Tab
          icon={<AccountCircleIcon style={{ color: "white" }} />}
          style={{ minWidth: "33%", zIndex: "1000" }}
        />
        <Tab
          icon={<SquareFootIcon style={{ color: "white", fontSize: "4vh" }} />}
          style={{ minWidth: "33%", zIndex: "1000" }}
        />
      </Tabs>
      <div style={{ display: value === 0 ? "inline" : "none" }}>
        <GridTool
          setGrid={setGrid}
          setTile={setTileSize}
          gridVal={gridVal}
          partyCode={partyCode}
          setPartyCode={setPartyCode}
          isMap={isMap}
        />
      </div>
      <div style={{ height: "100%", display: value === 1 ? "inline" : "none" }}>
        <TokensPanel
          setValue={setValue}
          urls={urls}
          setUrls={setUrls}
          setMapTokens={setMapTokens}
          tileSize={tileSize}
          partyCode={partyCode}
          socket={socket}
          setNewToken={setNewToken}
        />
      </div>
      <div style={{ display: value === 2 ? "inline" : "none" }}>
        <Tools />
      </div>
      <div
        style={{
          display: value === 3 ? "inline" : "none",
          width: "inherit",
          height: "inherit",
        }}
      >
        <TokenFocus
          token={newToken}
          setMapTokens={setMapTokens}
          tileSize={tileSize}
          partyCode={partyCode}
          socket={socket}
        />
      </div>
      <div style={{ display: value === 5 ? "inline" : "none" }}>
        <TokenFocus />
      </div>
    </div>
  );
}
