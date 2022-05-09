import { useEffect, useRef, useState } from "react";
import useDraggable from "../Hooks/useDraggable";
import useRotatable from "../Hooks/useRotatable";
import useScalable from "../Hooks/useScalable";
export default function Rectangle() {
  const [col, setCol] = useState({ r: 255, g: 0, b: 0 });
  const translate = useRef({ x: 0, y: 0 });
  const p1 = useRef({ x: 0, y: 0 });
  const p2 = useRef({ x: 0, y: 0 });
  const { position: pos } = useDraggable("cont", { x: 100, y: 100 }, "cont");
  const { angle: ang1 } = useRotatable("rot", "cont", p2, p1);
  const { scalable: scale } = useScalable("rot", "cont", p2, translate);

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
    <div>
      <div
        id="cont"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "column",
          backgroundColor: `rgba(${col.r}, ${col.g}, ${col.b}, 0.5)`,
          width: "40px",
          height: "500px",
          position: "absolute",
          top: `${pos.y}px`,
          left: `${pos.x}px`,
          transform: `rotate(${ang1}deg) scale(1, ${scale})`,
        }}
      >
        <div
          id="rot"
          style={{
            width: " 20px",
            height: "20px",
            backgroundColor: "blue",
            borderRadius: "100px",
            transformOrigin: "center top",
            transform: `scale(1, ${1 / scale})`,
          }}
        ></div>
      </div>
    </div>
  );
}
