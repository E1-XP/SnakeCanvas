import { DIRECTIONS, ORIENTATION, setState, SPEED, state } from "./state";

const KEYS = {
  LEFT: "ArrowLeft",
  RIGHT: "ArrowRight",
  UP: "ArrowUp",
  DOWN: "ArrowDown",
  SPACE: "Space",
};

const steeringState = {
  touchStartX: undefined,
  touchStartY: undefined,
  touchEndX: undefined,
  touchEndY: undefined,
  keyPressQueue: [],
};

const genStateUpdateAfterDirectionChange = (direction, orientation) => {
  const dirChangedOnSameAxis =
    orientation === state.orientation && direction !== state.direction;

  if (dirChangedOnSameAxis) return {};

  return {
    direction,
    orientation,
    snake: [{ ...state.snake[0], direction }].concat(state.snake.slice(1)),
  };
};

export const fireQueuedKeyPresses = () => {
  if (!steeringState.keyPressQueue.length) return;

  const keyPressQueue = [...steeringState.keyPressQueue];
  setState(steeringState, { keyPressQueue: [] });

  keyPressQueue.forEach((code) => {
    document.dispatchEvent(new KeyboardEvent("keydown", { code }));
  });
};

export const enableSteering = (e) => {
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

  const checkRotationBetweenSegments = (direction) => {
    if (!rotatedEnoughToChangeDirection()) {
      setState(steeringState, { keyPressQueue: [KEYS[direction]] });
      return false;
    }

    return true;
  };

  switch (e.code) {
    case KEYS.SPACE: {
      // slow down/speed up
      setState(state, { speed: state.speed === SPEED ? 900 : SPEED });
      break;
    }
    case KEYS.LEFT:
      {
        if (checkRotationBetweenSegments(DIRECTIONS.LEFT)) {
          setState(
            state,
            genStateUpdateAfterDirectionChange(
              DIRECTIONS.LEFT,
              ORIENTATION.HORIZONTAL
            )
          );
        }
      }
      break;
    case KEYS.RIGHT:
      {
        if (checkRotationBetweenSegments(DIRECTIONS.RIGHT)) {
          setState(
            state,
            genStateUpdateAfterDirectionChange(
              DIRECTIONS.RIGHT,
              ORIENTATION.HORIZONTAL
            )
          );
        }
      }
      break;

    case KEYS.UP:
      {
        if (checkRotationBetweenSegments(DIRECTIONS.UP)) {
          setState(
            state,
            genStateUpdateAfterDirectionChange(
              DIRECTIONS.UP,
              ORIENTATION.VERTICAL
            )
          );
        }
      }
      break;
    case KEYS.DOWN:
      {
        if (checkRotationBetweenSegments(DIRECTIONS.DOWN)) {
          setState(
            state,
            genStateUpdateAfterDirectionChange(
              DIRECTIONS.DOWN,
              ORIENTATION.VERTICAL
            )
          );
        }
      }
      break;
  }
};

export const preventPageScroll = (e) => {
  const keys = Object.values(KEYS).concat("Space");

  if (keys.indexOf(e.code) > -1) {
    e.preventDefault();
  }
};

export const handleStartOfSwipe = (e) => {
  setState(steeringState, {
    touchStartX: e.changedTouches[0].screenX,
    touchStartY: e.changedTouches[0].screenY,
  });
};

export const handleEndOfSwipe = (e) => {
  setState(steeringState, {
    touchEndX: e.changedTouches[0].screenX,
    touchEndY: e.changedTouches[0].screenY,
  });

  const { touchStartX, touchStartY, touchEndX, touchEndY } = steeringState;

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

  setState(steeringState, {
    touchStartX: undefined,
    touchStartY: undefined,
    touchEndX: undefined,
    touchEndY: undefined,
  });
};
