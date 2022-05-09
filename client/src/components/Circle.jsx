import { useEffect, useRef, useState } from "react";
import useCircleScale from "../Hooks/useCircleScale";
import useDraggable from "../Hooks/useDraggable";
import useRotatable from "../Hooks/useRotatable";
import useScalable from "../Hooks/useScalable";
export default function Circle() {
  const [col, setCol] = useState({ r: 255, g: 0, b: 0 });
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const p2 = useRef({ x: 0, y: 0 });
  const { position: pos } = useDraggable("scale", { x: 100, y: 100 }, "cont");
  const { scalable: scale } = useCircleScale("cont", "scale", p2, translate);

  useEffect(() => {
    let container = document.getElementById("cont");
    p2.current = {
      x: pos.x + container.offsetWidth / 2,
      y: pos.y + container.offsetHeight / 2,
    };
  }, [pos]);

  return (
    <div>
      <div
        id="cont"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          backgroundColor: `rgba(${col.r}, ${col.g}, ${col.b}, 0.5)`,
          width: "100px",
          height: "100px",
          position: "absolute",
          top: `${pos.y}px`,
          left: `${pos.x}px`,
          transform: `scale(${scale})`,
          borderRadius: "100px",
        }}
      >
        <div
          id="scale"
          style={{
            width: " 90px",
            height: "90px",
            backgroundColor: "blue",
            borderRadius: "100px",
          }}
        ></div>
      </div>
      <div
        id="scale"
        style={{
          position: "absolute",
          top: `${p2.current.y}px`,
          left: `${p2.current.x}px`,
          width: " 10px",
          height: "10px",
          backgroundColor: "red",
          borderRadius: "100px",
        }}
      ></div>
    </div>
  );
}
