export function coordToMap(pos, grid, tileDim) {
  let bounds = document.getElementById(grid);
  if (bounds === null) return "yeet";
  let bx = bounds.getBoundingClientRect().left;
  let by = bounds.getBoundingClientRect().top;

  let newPos = {
    x: bx + tileDim * pos.x,
    y: by + tileDim * pos.y,
  };

  return newPos;
}

export function MapToCoord(pos, grid, tileDim) {
  let bounds = document.getElementById(grid);

  if (bounds === null) return "yeet";
  let bx = bounds.getBoundingClientRect().left;
  let by = bounds.getBoundingClientRect().top;
  let tempX = pos.x - bx;
  let tempY = pos.y - by;
  let newPos = {
    x: Math.floor(tempX / tileDim),
    y: Math.floor(tempY / tileDim),
  };

  return newPos;
}
