import { useEffect, useRef, useState } from "react";
import useDraggable from "../Hooks/useDraggable";
import useRotatable from "../Hooks/useRotatable";
import useScalable from "../Hooks/useScalable";

export default function Cone() {
  const [col, setCol] = useState({ r: 255, g: 0, b: 0 });
  const translate = useRef({ x: 0, y: 0 });
  const p1 = useRef({ x: 0, y: 0 });
  const p2 = useRef({ x: 0, y: 0 });
  const { position: pos } = useDraggable("cont", { x: 100, y: 100 }, "cont");
  const { angle: ang1 } = useRotatable("rot", "cont", p2, p1);
  const { scalable: scale } = useScalable("rot", "cont", p2);

  useEffect(() => {
    let container = document.getElementById("cont");
    p1.current = {
      x: pos.x + container.offsetWidth / 2,
      y: pos.y,
    };
    p2.current = {
      x: pos.x + container.offsetWidth / 2,
      y: pos.y + container.offsetHeight,
    };
  }, [pos]);

  return (
    <div
      id="cont"
      style={{
        position: "absolute",
        top: `${pos.y}px`,
        left: `${pos.x}px`,
        width: "160px",
        height: "160px",
        transform: `rotate(${ang1}deg) scale(${scale}, ${scale})`,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "column",
          width: "0",
          height: "0",
          borderLeft: "80px solid transparent",
          borderRight: "80px solid transparent",
          borderTop: `160px solid rgba(${col.r}, ${col.g}, ${col.b}, 0.5)`,
        }}
      ></div>
      <div
        id="rot"
        style={{
          position: "inherit",
          width: " 20px",
          height: "20px",
          left: `${(70 * 100) / 160}%`,
          top: "5%",
          backgroundColor: "blue",
          borderRadius: "100px",
        }}
      ></div>
    </div>
  );
}
