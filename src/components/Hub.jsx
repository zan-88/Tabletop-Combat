import React from "react";
import Button from "react-bootstrap/Button";
import styled from "styled-components";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import LocalLibraryOutlinedIcon from "@mui/icons-material/LocalLibraryOutlined";

export default function Hub() {
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
      <RoleButton id="DMBtn">
        <RoleIcon>
          <LocalLibraryOutlinedIcon />
          <div>Dungeon Master</div>
        </RoleIcon>
      </RoleButton>
      <RoleButton id="playerBtn">player</RoleButton>
    </div>
  );
}

const RoleButton = styled.div`
  border-radius: 5px;
  border-color: #940a0a;
  border-width: 5px;
  background-color: green;
  display: flex;
  text-align: center;
  width: 30%;
  height: 0%;
  padding-bottom: 30%;
  margin: 2%;
  align-items: center;
  justify-content: center;

  :hover& {
    background-color: black;
  }
`;

const RoleIcon = styled.div``;
