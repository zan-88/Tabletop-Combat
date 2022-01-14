import { ImageList } from "@material-ui/core";
import React, { useState, useEffect } from "react";
//import useDraggable from "./hooks/use-draggable";
import { storage, db } from "../firebase";

function TokensPanel() {
  const [activeToken, setActiveToken] = useState("");
  const [editState, setEditState] = useState(0);

  //const { position: tokenPosition } = useDraggable("tokenHandle", "exitToken");
  //const { position: toolPosition } = useDraggable("toolHandle", "exitTool");
  document.body.style.overflow = "hidden";

  const [images, setImages] = useState([]);
  const [urls, setUrls] = useState([]);

  const img = new Image();

  const handleChange = (e) => {
    console.log(e);
    let events = [];
    for (let i = 0; i < e.target.files.length; i++) {
      const newImg = e.target.files[i];
      setImages((prevState) => [...prevState, newImg]);
    }
  };

  const handleUpload = () => {
    console.log(images);
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
            .child(image.name)
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

  console.log(urls);
  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        backgroundColor: "#940a0a",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          backgroundRepeat: "no-repeat",
          boxSizing: "border-box",
          backgroundSize: "contain",
          width: "100%",
          height: "18%",
        }}
      >
        <input
          onChange={handleChange}
          type="file"
          name="input"
          id="input"
          style={{
            width: "100%",
            height: "85%",
          }}
          multiple
        />
        <button onClick={handleUpload}>Upload</button>
      </div>
      {images.map}
    </div>
  );
}

export default TokensPanel;
