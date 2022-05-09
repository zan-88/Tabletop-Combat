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

function TokensPanel({ setValue, urls, setUrls, setNewToken }) {
  const notInitial = useRef(false);

  document.body.style.overflow = "hidden";

  let bar = document.getElementById("tokenBar");

  const [images, setImages] = useState([]);

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
      handleUpload();
    } else {
      notInitial.current = true;
    }
  }, [images]);

  useDragFile("tokenArea");

  const handleSelect = (url) => {
    setValue(3);
    setNewToken(url);
  };

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

  return (
    <TokenContainer>
      <TokenDrag id="tokenDrag">
        <TokenBorder id="tokenArea" {...getRootProps()}>
          <TokenText>Choose Tokens or Drag Here</TokenText>
          <CloudUploadIcon style={Cloud} />
          <input style={{ width: "100%" }} {...getInputProps()} />
        </TokenBorder>
      </TokenDrag>
      <TokenBar id="tokenBar">
        {urls.map((url, i) => (
          <img
            key={{ i }}
            src={url}
            alt=""
            style={{ width: "45%", margin: "2%" }}
            onClick={() => handleSelect(url)}
          />
        ))}
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
  overflow-y: auto;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-content: flex-start;
  width: 100%;
  height: 80%;
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
  height: fit-content;
  width: fit-content;
  text-align: center;
  padding: 1%;
  z-index: 100;
`;

const Cloud = {
  fontSize: "400%",
};
