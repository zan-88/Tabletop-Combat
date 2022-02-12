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

  let newPos = {
    x: Math.floor((pos.x - bx) / tileDim),
    y: Math.floor((pos.y - by) / tileDim),
  };

  return newPos;
}
