import "./style.css";

import { renderLoop, loopPositionUpdate } from "./drawing";
import { DIRECTIONS, ORIENTATION, setState, state } from "./state";

const enableSteering = (e) => {
  console.log(e.keyCode);
  switch (e.keyCode) {
    case 37:
      {
        setState(state, {
          direction: DIRECTIONS.LEFT,
          orientation: ORIENTATION.HORIZONTAL,
        });
      }
      break;
    case 39:
      {
        setState(state, {
          direction: DIRECTIONS.RIGHT,
          orientation: ORIENTATION.HORIZONTAL,
        });
      }
      break;

    case 38:
      {
        setState(state, {
          direction: DIRECTIONS.UP,
          orientation: ORIENTATION.VERTICAL,
        });
      }
      break;
    case 40:
      {
        setState(state, {
          direction: DIRECTIONS.DOWN,
          orientation: ORIENTATION.VERTICAL,
        });
      }
      break;
  }
};

const main = (() => {
  const canvas = document.getElementById("canvas");
  // canvas.width = window.innerWidth;
  const ctx = canvas.getContext("2d");

  renderLoop(ctx);
  loopPositionUpdate();

  document.addEventListener("keydown", enableSteering);
})();
