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
  snake: [
    {
      x: canvas.width / 2,
      y: canvas.height / 2,
      direction: DIRECTIONS.RIGHT,
    },
  ],
  size: 20,
  speed: 500,
  get oneStep() {
    return canvas.width / this.speed;
  },
  foodCoords: { x: 0, y: 0 },
  orientation: ORIENTATION.HORIZONTAL,
  direction: DIRECTIONS.RIGHT,
  score: 0,
  finished: false,
  fillStyle: "#ccc",
};

export const setState = (state = {}, updatedStatePartial) => {
  const noChanges = Object.keys(updatedStatePartial).every(
    (key) => updatedStatePartial[key] === state[key]
  );

  if (noChanges) return;

  Object.assign(state, updatedStatePartial);
};
