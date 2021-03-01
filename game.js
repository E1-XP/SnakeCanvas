import { DIRECTIONS, ORIENTATION, setState, state } from "./state";

const KEYS = {
  LEFT: 37,
  RIGHT: 39,
  UP: 38,
  DOWN: 40,
};

export const calcRandomFoodPlace = () => {
  const x = Math.random() * (canvas.width - state.size);
  const y = Math.random() * (canvas.height - state.size);

  return { x, y };
};

export const initializeStateWithRandomFoodPos = () => {
  setState(state, { foodCoords: calcRandomFoodPlace() });
};

const updateDOMScoreboard = () => {
  const element = document.getElementById("score");
  element.innerHTML = state.score;
};

export const handleFoodCollision = () => {
  const foodObjectBorders = {
    xStart: state.foodCoords.x,
    xEnd: state.foodCoords.x + state.size,
    yStart: state.foodCoords.y,
    yEnd: state.foodCoords.y + state.size,
  };

  const collidedOnXAxis = [state.x, state.x + state.size].some(
    (coord) =>
      coord >= foodObjectBorders.xStart && coord <= foodObjectBorders.xEnd
  );

  const collidedOnYAxis = [state.y, state.y + state.size].some(
    (coord) =>
      coord >= foodObjectBorders.yStart && coord <= foodObjectBorders.yEnd
  );

  if (collidedOnXAxis && collidedOnYAxis) {
    initializeStateWithRandomFoodPos();
    setState(state, { score: state.score + 1, length: state.length + 1 });
    updateDOMScoreboard();
  }
};

export const enableSteering = (e) => {
  console.log(e.keyCode);
  switch (e.keyCode) {
    case KEYS.LEFT:
      {
        setState(state, {
          direction: DIRECTIONS.LEFT,
          orientation: ORIENTATION.HORIZONTAL,
        });
      }
      break;
    case KEYS.RIGHT:
      {
        setState(state, {
          direction: DIRECTIONS.RIGHT,
          orientation: ORIENTATION.HORIZONTAL,
        });
      }
      break;

    case KEYS.UP:
      {
        setState(state, {
          direction: DIRECTIONS.UP,
          orientation: ORIENTATION.VERTICAL,
        });
      }
      break;
    case KEYS.DOWN:
      {
        setState(state, {
          direction: DIRECTIONS.DOWN,
          orientation: ORIENTATION.VERTICAL,
        });
      }
      break;
  }
};
