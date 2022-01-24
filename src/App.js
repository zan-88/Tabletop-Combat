import "./App.css";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import React, { useState, useStyles } from "react";
import Adjust from "@material-ui/icons/Adjust";
import Build from "@material-ui/icons/Build";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import Map from "./components/Map";
import Combat from "./components/Combat";
import useDraggable from "./hooks/use-draggable";

function App() {
  const [value, setValue] = useState(0);
  const [url, setUrl] = useState("");
  const [urls, setUrls] = useState([]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        boxSizing: "border-box",
        backgroundColor: "#940a0a",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        zIndex: "10000000",
      }}
    >
      {url === "" && <div id="grid"></div>}
      <Tabs
        style={{ backgroundColor: "black", height: "50px", zIndex: "1000" }}
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="simple tabs example"
      >
        <Tab
          style={{ minWidth: "50%" }}
          icon={<AccountCircleIcon style={{ color: "white" }} />}
        />
        <Tab
          icon={<Build style={{ color: "white" }} />}
          style={{ minWidth: "50%" }}
        />
        <Tab label="Item Three" />
      </Tabs>
      {value === 0 && (
        <Combat url={url} setUrl={setUrl} urls={urls} setUrls={setUrls} />
      )}
    </div>
  );
}

export default App;
