import { ImageList } from "@material-ui/core";
import React, { useState, useEffect, useRef } from "react";
//import useDraggable from "./hooks/use-draggable";
import { storage, db } from "../firebase";
import useDragFile from "../hooks/use-dragfile";
import { useDropzone } from "react-dropzone";
import styled from "styled-components";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import useDraggable from "../hooks/use-draggable";
import draggable from "../Functions/draggable";

function TokensPanel({ urls, setUrls, tokenHandle }) {
  const [activeToken, setActiveToken] = useState("");
  const [editState, setEditState] = useState(0);
  const notInitial = useRef(false);

  document.body.style.overflow = "hidden";

  let selec = document.getElementById("selection");
  let selecW = selec.offsetWidth / 2.5;

  const [images, setImages] = useState([]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    maxFiles: 20,

    onDrop: (acceptedFiles) => {
      setImages(acceptedFiles);
      if (acceptedFiles.length > 1) {
        let bar = document.getElementById("tokenBar");
        bar.style.justifyContent = "center";
      }
    },
  });

  useEffect(() => {
    if (notInitial.current) {
      tokenHandle(urls[urls.length - 1]);
    } else {
      notInitial.current = true;
    }
  }, [urls]);

  useEffect(() => {
    if (notInitial.current) {
      handleUpload();
    } else {
      notInitial.current = true;
    }
  }, [images]);

  useDragFile("tokenArea");
  const img = new Image();

  const handleChange = (e) => {
    let events = [];
    for (let i = 0; i < e.target.files.length; i++) {
      const newImg = e.target.files[i];
      setImages((prevState) => [...prevState, newImg]);
    }
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

              /*
              db.collection("map")
                .doc("link")
                .add({
                  map: url,
                })
                .then((docRef) => {
                  console.log("Document written with ID: ", docRef.id);
                })
                .catch((error) => {
                  console.error("Error adding document: ", error);
                });*/
            });
        }
      );
    });
  };

  return (
    <TokenContainer>
      <TokenDrag>
        <TokenBorder id="tokenArea" {...getRootProps()}>
          <TokenText>Choose Tokens or Drag Here</TokenText>
          <input style={{ width: "100%" }} {...getInputProps()} />
          <CloudUploadIcon style={Cloud} />
        </TokenBorder>
      </TokenDrag>
      <TokenBar id="tokenBar">
        {urls.map((image, i) => (
          <img
            key={i}
            id={`token_${i}`}
            src={image}
            alt="token"
            style={{ margin: "3%", width: selecW, height: selecW }}
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

const TokenDrag = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  margin: 4%;
  height: 20%;
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
  z-index: 1000000;
`;

const TokenText = styled.div`
  font-size: 2vh;
  text-align: center;
`;

const Cloud = {
  fontSize: "10vh",
  width: "100%",
};
