import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import React, { useState, useStyles } from "react";
import Adjust from "@material-ui/icons/Adjust";
import Build from "@material-ui/icons/Build";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import Map from "./Map";
import TokensPanel from "./TokensPanel";
import { storage, db } from "../firebase";
import dragMap from "../images/DragMap.png";
import styled from "styled-components";
import useDragFile from "../hooks/use-dragfile";
import { useDropzone } from "react-dropzone";

function Combat() {
  const [value, setValue] = useState(0);

  const [image, setImage] = useState(null);
  const [url, setUrl] = useState("");

  const { map: tempImg } = useDragFile("dragArea");

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    maxFiles: 1,
    init: function () {
      this.hiddenFileInput.removeAttribute("multiple");
    },
    onDrop: (acceptedFiles) => {
      setImage(acceptedFiles[0]);
      handleUpload();
    },
  });

  const img = new Image();

  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
    console.log(newValue);
  };

  const handleChangeMap = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    const uploadTask = storage.ref(`map/${image.path}`).put(image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        console.log(error);
      },
      () => {
        storage
          .ref("map")
          .child(image.path)
          .getDownloadURL()
          .then((url) => {
            setUrl(url);
            img.src = url;
            console.log(url);
            db.collection("map")
              .doc("link")
              .set({
                map: url,
              })
              .then((docRef) => {
                console.log("Document written with ID: ", docRef.id);
              })
              .catch((error) => {
                console.error("Error adding document: ", error);
              });
          });
      }
    );
  };
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        backgroundColor: "white",
        height: "100%",
      }}
    >
      <div
        style={{
          flexBasis: "15%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#940a0a",
        }}
      >
        <Tabs
          style={{ backgroundColor: "black" }}
          variant="scrollable"
          value={value}
          onChange={handleChangeTab}
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
      </div>
      {url === "" ? (
        <MapSection>
          <MapBorder id="dragArea" {...getRootProps()}>
            <input {...getInputProps()} />
            <MapText>Choose Map Or Drag It Here</MapText>
            <CloudUploadIcon style={Cloud} />
          </MapBorder>
        </MapSection>
      ) : (
        <Map />
      )}
    </div>
  );
}

export default Combat;

const MapSection = styled.div`
  height: 100%;
  background-color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-grow: 5;
`;

const MapBorder = styled.div`
  border: 5px dashed #940a0a;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  align-self: center;
  width: 80%;
  height: 80%;
  color: #940a0a;
  opacity: 50%;
`;

const MapText = styled.div`
  font-size: 5vh;
  text-align: center;
`;

const MapBtn = styled.button`
  width: 40%;
  align-self: center;
  margin: 2%;
  padding: 3%;
  border-color: #940a0a;
  background-color: #940a0a;
  color: white;
  border-radius: 8px;
`;

const Cloud = {
  fontSize: "25vh",
  alignItems: "center",
  alignSelf: "center",
};
