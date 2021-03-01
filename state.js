export const ORIENTATION = {
  HORIZONTAL: "HORIZONTAL",
  VERTICAL: "VERTICAL",
};

export const DIRECTIONS = {
  UP: "UP",
  DOWN: "DOWN",
  LEFT: "LEFT",
  RIGHT: "RIGHT",
};

export const state = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: 20,
  foodCoords: { x: 0, y: 0 },
  speed: 500,
  orientation: ORIENTATION.HORIZONTAL,
  direction: DIRECTIONS.RIGHT,
  length: 1,
  score: 0,
  fillStyle: "#ccc",
};

export const setState = (state = {}, updatedStatePartial) => {
  const noChanges = Object.keys(updatedStatePartial).every(
    (key) => updatedStatePartial[key] === state[key]
  );

  if (noChanges) return;

  Object.assign(state, updatedStatePartial);
  console.log(state);
};
