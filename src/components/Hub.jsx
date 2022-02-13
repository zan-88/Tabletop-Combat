import React from "react";
import Button from "react-bootstrap/Button";
import styled from "styled-components";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import LocalLibraryOutlinedIcon from "@mui/icons-material/LocalLibraryOutlined";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap-css-only/css/bootstrap.min.css";
import "mdbreact/dist/css/mdb.css";
import { MDBIcon } from "mdbreact";

export default function Hub({ setValue }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        width: "100%",
      }}
    >
      <RoleButton id="DMBtn" onClick={() => setValue(1)}>
        <RoleText>Dungeon Master</RoleText>
        <MDBIcon icon="dragon" style={RoleIcon} />
      </RoleButton>
      <RoleButton id="playerBtn">
        <RoleText>player</RoleText>
        <MDBIcon icon="dice-d20" style={RoleIcon} />
      </RoleButton>
    </div>
  );
}

const RoleButton = styled.div`
  border-radius: 5px;
  border-style: solid;
  border-color: black;
  border-width: 4px;
  background-color: #940a0a;
  display: flex;
  flex-direction: column;
  text-align: center;
  width: 50%;
  height: 50%;
  margin: 2%;

  justify-content: center;
  align-items: center;

  :hover& {
    background-color: black;
  }
`;

const RoleText = styled.div`
  font-size: 3vw;
  margin: 2%;
`;

const RoleIcon = {
  fontSize: "10vh",
};
