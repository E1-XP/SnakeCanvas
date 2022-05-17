import { DIRECTIONS, ORIENTATION, setState, state } from "./state";

const KEYS = {
  LEFT: 37,
  RIGHT: 39,
  UP: 38,
  DOWN: 40,
};

const touchEventState = {
  touchStartX: undefined,
  touchStartY: undefined,
  touchEndX: undefined,
  touchEndY: undefined,
};

const genStateUpdateAfterDirectionChange = (direction, orientation) => {
  const dirChangedOnSameAxis =
    orientation === state.orientation && direction !== state.direction;

  const rotatedEnoughToChangeDirection = () => {
    if (state.snake.length <= 1) return true;

    if (
      (state.orientation === ORIENTATION.HORIZONTAL &&
        state.snake[0].y === state.snake[1].y) ||
      (state.orientation === ORIENTATION.VERTICAL &&
        state.snake[0].x === state.snake[1].x)
    )
      return true;

    return false;
  };

  if (dirChangedOnSameAxis || !rotatedEnoughToChangeDirection()) return {};

  return {
    direction,
    orientation,
    snake: [{ ...state.snake[0], direction }].concat(state.snake.slice(1)),
  };
};

export const enableSteering = (e) => {
  switch (e.keyCode) {
    case KEYS.LEFT:
      {
        setState(
          state,
          genStateUpdateAfterDirectionChange(
            DIRECTIONS.LEFT,
            ORIENTATION.HORIZONTAL
          )
        );
      }
      break;
    case KEYS.RIGHT:
      {
        setState(
          state,
          genStateUpdateAfterDirectionChange(
            DIRECTIONS.RIGHT,
            ORIENTATION.HORIZONTAL
          )
        );
      }
      break;

    case KEYS.UP:
      {
        setState(
          state,
          genStateUpdateAfterDirectionChange(
            DIRECTIONS.UP,
            ORIENTATION.VERTICAL
          )
        );
      }
      break;
    case KEYS.DOWN:
      {
        setState(
          state,
          genStateUpdateAfterDirectionChange(
            DIRECTIONS.DOWN,
            ORIENTATION.VERTICAL
          )
        );
      }
      break;
  }
};

export const preventPageScroll = (e) => {
  const keys = ["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];

  if (keys.indexOf(e.code) > -1) {
    e.preventDefault();
  }
};

export const handleStartOfSwipe = (e) => {
  setState(touchEventState, {
    touchStartX: e.changedTouches[0].screenX,
    touchStartY: e.changedTouches[0].screenY,
  });
};

export const handleEndOfSwipe = (e) => {
  setState(touchEventState, {
    touchEndX: e.changedTouches[0].screenX,
    touchEndY: e.changedTouches[0].screenY,
  });

  const { touchStartX, touchStartY, touchEndX, touchEndY } = touchEventState;

  const xDiff = touchStartX - touchEndX;
  const yDiff = touchStartY - touchEndY;

  if (
    (Math.abs(xDiff) > Math.abs(yDiff) &&
      Math.abs(xDiff) < 0.05 * document.body.clientWidth) ||
    (Math.abs(yDiff) > Math.abs(xDiff) &&
      Math.abs(yDiff) < 0.05 * document.body.clientHeight)
  )
    return;

  if (
    touchEndX < touchStartX &&
    state.direction !== DIRECTIONS.RIGHT &&
    Math.abs(xDiff) > Math.abs(yDiff)
  ) {
    setState(
      state,
      genStateUpdateAfterDirectionChange(
        DIRECTIONS.LEFT,
        ORIENTATION.HORIZONTAL
      )
    );
  }

  if (
    touchEndX > touchStartX &&
    state.direction !== DIRECTIONS.LEFT &&
    Math.abs(xDiff) > Math.abs(yDiff)
  ) {
    setState(
      state,
      genStateUpdateAfterDirectionChange(
        DIRECTIONS.RIGHT,
        ORIENTATION.HORIZONTAL
      )
    );
  }

  if (
    touchEndY < touchStartY &&
    state.direction !== DIRECTIONS.DOWN &&
    Math.abs(xDiff) < Math.abs(yDiff)
  ) {
    setState(
      state,
      genStateUpdateAfterDirectionChange(DIRECTIONS.UP, ORIENTATION.VERTICAL)
    );
  }

  if (
    touchEndY > touchStartY &&
    state.direction !== DIRECTIONS.UP &&
    Math.abs(xDiff) < Math.abs(yDiff)
  ) {
    setState(
      state,
      genStateUpdateAfterDirectionChange(DIRECTIONS.DOWN, ORIENTATION.VERTICAL)
    );
  }

  setState(touchEventState, {
    touchStartX: undefined,
    touchStartY: undefined,
    touchEndX: undefined,
    touchEndY: undefined,
  });
};
