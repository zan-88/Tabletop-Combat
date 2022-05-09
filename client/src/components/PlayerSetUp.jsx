import { React, useState, useEffect, useRef } from "react";
import styled from "styled-components";
import "bootstrap/dist/css/bootstrap.min.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useDropzone } from "react-dropzone";
import { storage } from "../firebase";
import useDragFile from "../hooks/use-dragfile";
import * as GameRequest from "../Functions/gameRequest";

export default function PlayerSetUp({ setPlayerInfo, setValue, setParty }) {
  const [token, setToken] = useState(null);
  const [url, setUrl] = useState("");

  const [partyCode, setPartyCode] = useState("");
  const [userName, setUserName] = useState("");

  const [isLoaded, setIsLoaded] = useState(false);
  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    maxFiles: 20,

    onDrop: (acceptedFiles) => {
      setToken(acceptedFiles[0]);
    },
  });
  useDragFile("tokenArea");

  useEffect(() => {
    if (token !== null) {
      handleUpload();
    }
  }, [token]);

  async function fetchMap() {
    await GameRequest.getMap(
      {
        params: { partyCode: partyCode },
      },
      setParty,
      setIsLoaded
    );
  }

  const handleUpload = () => {
    const uploadTask = storage.ref(`tokens/${token.name}`).put(token);
    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        console.log(error);
      },
      () => {
        storage
          .ref("tokens")
          .child(token.path)
          .getDownloadURL()
          .then((url) => {
            setUrl(url);
          });
      }
    );
  };

  function handleSubmit(e) {
    e.preventDefault();
    setPlayerInfo({
      playerUrl: url,
      partyCode: partyCode,
      playerName: userName,
    });
    fetchMap();
  }

  useEffect(() => {
    if (isLoaded) {
      setValue(3);
    }
  }, [isLoaded]);

  return (
    <PlayerSetUpContainer>
      <Form
        className="d-flex flex-column align-items-center p-5"
        onSubmit={handleSubmit}
      >
        <Form.Group className="d-flex flex-row align-items-center p-3">
          <Form.Label>Party Code:</Form.Label>
          <Form.Control
            type="text"
            placeholder="EX:CODE"
            placeholderTextColor="#aac"
            required
            onChange={(e) => setPartyCode(e.target.value.toUpperCase())}
          />
        </Form.Group>
        <Form.Group className="d-flex flex-row align-items-center p-3">
          <Form.Label>Player Name:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Zugar"
            required
            onChange={(e) => setUserName(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="d-flex flex-row align-items-center p-3">
          <PlayerTokenSection>
            <TokenDrag id="tokenDrag">
              <TokenBorder id="tokenArea" {...getRootProps()}>
                <Form.Control
                  type="file"
                  style={{ width: "100%" }}
                  {...getInputProps()}
                />
                {url === "" ? (
                  <div>
                    <TokenText>Choose Token or Drag Here</TokenText>
                    <CloudUploadIcon style={Cloud} />
                  </div>
                ) : (
                  <div
                    style={{
                      backgroundImage: `url(${url})`,
                      backgroundPosition: "center",
                      backgroundSize: "cover",
                      backgroundRepeat: "no-repeat",
                      width: "16vh",
                      height: "16vh",
                      margin: "1%",
                    }}
                  />
                )}
              </TokenBorder>
            </TokenDrag>
          </PlayerTokenSection>
        </Form.Group>
        <Button type="submit" variant="outline-dark" disabled={url === ""}>
          Enter Party
        </Button>
      </Form>
    </PlayerSetUpContainer>
  );
}

const PlayerSetUpContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-family: "Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande",
    "Lucida Sans", Arial, sans-serif;
`;

const PlayerTokenSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 100%;
  height: auto;
  border-radius: 5%;
`;

const TokenDrag = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  padding: 4%;
  height: 100%;
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
  height: 100%;
  color: white;
  opacity: 50%;
  z-index: 100;
`;

const TokenText = styled.div`
  font-size: 1.1em;
  text-align: center;
  padding: 1%;
`;

const Cloud = {
  fontSize: "10vh",
  width: "100%",
};
