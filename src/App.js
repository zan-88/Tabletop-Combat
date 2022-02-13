import "./App.css";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import React, { useState, useStyles } from "react";
import Adjust from "@material-ui/icons/Adjust";
import Build from "@material-ui/icons/Build";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import Map from "./components/Map";
import Combat from "./components/Combat";
import Hub from "./components/Hub";
import useDraggable from "./hooks/use-draggable";
import styled from "styled-components";

function App() {
  const [value, setValue] = useState(-1);
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
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {url === "" && <div id="grid"></div>}
      {value === -1 && <Hub setValue={setValue} />}

      {value === 1 && (
        <Combat url={url} setUrl={setUrl} urls={urls} setUrls={setUrls} />
      )}

      {/*  */}
    </div>
  );
}
export default App;
