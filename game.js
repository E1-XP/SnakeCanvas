import { DIRECTIONS, ORIENTATION, setState, state } from "./state";

const KEYS = {
  LEFT: 37,
  RIGHT: 39,
  UP: 38,
  DOWN: 40,
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
