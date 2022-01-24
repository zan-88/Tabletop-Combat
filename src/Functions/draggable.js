export default function draggable(id) {
  let pos = { x: 0, y: 0 };
  let active = false;
  let offset = { x: 0, y: 0 };
  const drag = document.getElementById(id);
  console.log("DRAHG");
  drag.addEventListener("mousedown", start, false);
  document.addEventListener("mousemove", function (e) {
    if (active) {
      move(e);
    }
  });
  document.addEventListener("mouseup", function (e) {
    stop(e.originalEvent);
  });
  function start(e) {
    let mouse = { x: e.clientX, y: e.clientY };
    let l = drag.offsetLeft;
    let t = drag.offsetTop;
    offset = { x: mouse.x - l, y: mouse.y - t };
    return (active = true);
  }

  function move(e) {
    e.preventDefault();
    let mouse = { x: e.clientX, y: e.clientY };
    let l = drag.offsetLeft;
    let t = drag.offsetTop;
    pos = { x: mouse.x - offset.x - l, y: mouse.y - offset.y - t };
    drag.style.left = pos.x + "px";
    drag.style.top = pos.y + "px";
  }

  function stop(e) {
    return (active = false);
  }
}
