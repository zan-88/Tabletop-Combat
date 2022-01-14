import React from "react";

export default function Map() {
  return (
    <div
      id="map"
      style={{
        backgroundRepeat: "no-repeat",
        boxSizing: "border-box",
        background: `url(./map/picnicmap.png) no-repeat center`,
        backgroundSize: "contain",
        backgroundPosition: "center",
        height: "100%",
        flexGrow: 5,
      }}
    ></div>
  );
}
