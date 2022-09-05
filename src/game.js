import { clearCanvas, draw, updatePosition } from "./drawing";
import { DIRECTIONS, ORIENTATION, setState, state, jokes } from "./state";
import {
  getRandomJoke,
  playPauseUI,
  resetUI,
  showEndOfGameView,
  syncDOMScoreboardWithState,
  updateHeading,
} from "./ui";
import { toFixed2 } from "./helpers";

export const calcRandomFoodPlace = () => {
  const x = toFixed2(Math.random() * (canvas.width - state.size));
  const y = toFixed2(Math.random() * (canvas.height - state.size));

  return { x, y };
};

export const setRandomFoodPosition = () => {
  setState(state, { foodCoords: calcRandomFoodPlace() });
};

const getNewSegmentCoords = () => {
  const len = state.snake.length;
  const idx = len;
  const direction = state.snake[len - 1].direction;

  switch (direction) {
    case DIRECTIONS.UP: {
      const x = state.snake[len - 1].x;
      const y = state.snake[len - 1].y + state.size;

      return { x, y, direction, idx };
    }

    case DIRECTIONS.DOWN: {
      const x = state.snake[len - 1].x;
      const y = state.snake[len - 1].y - state.size;

      return { x, y, direction, idx };
    }

    case DIRECTIONS.LEFT: {
      const x = state.snake[len - 1].x + state.size;
      const y = state.snake[len - 1].y;

      return { x, y, direction, idx };
    }

    case DIRECTIONS.RIGHT: {
      const x = state.snake[len - 1].x - state.size;
      const y = state.snake[len - 1].y;

      return { x, y, direction, idx };
    }
  }
};

const handleEndOfGame = () => {
  setState(state, { isRunning: false });
  showEndOfGameView();
};

const collisionDetected = (a, b) => {
  const collidedOnXAxis = [a.x, a.x + state.size].some(
    (coord) => coord >= b.x && coord <= b.x + state.size
  );
  const collidedOnYAxis = [a.y, a.y + state.size].some(
    (coord) => coord >= b.y && coord <= b.y + state.size
  );

  return collidedOnXAxis && collidedOnYAxis;
};

export const detectTailCollisions = () => {
  const notSameCoords = (a, b) => a.idx !== b.idx;

  const firstElem = state.snake[0];

  const collidedWithOtherElement = state.snake.some(
    (itm, i) => Math.abs(i) > 4 && collisionDetected(firstElem, itm)
  );

  const collidedWithBorderTail = state.snakeBorderTails.some(
    (coords) =>
      notSameCoords(firstElem, coords) &&
      Math.abs(coords.idx) > 4 &&
      collisionDetected(firstElem, coords)
  );

  if (collidedWithBorderTail || (collidedWithOtherElement && state.isRunning)) {
    handleEndOfGame();
  }
};

export const detectFoodCollision = () => {
  const collidedWithOtherElement = collisionDetected(
    state.snake[0],
    state.foodCoords
  );

  const collidedWithBorderTail = state.snakeBorderTails
    .filter(({ idx }) => !idx)
    .some((coords) => collisionDetected(coords, state.foodCoords));

  if (collidedWithOtherElement || collidedWithBorderTail) {
    handleAfterFoodCollision();
  }
};

const handleAfterFoodCollision = () => {
  setRandomFoodPosition();

  setState(state, {
    score: state.score + 1,
    snake: [...state.snake, getNewSegmentCoords()],
  });

  syncDOMScoreboardWithState();
  updateHeading(getRandomJoke());
};

export const playPauseGame = () => {
  if (state.isRunning) {
    setState(state, { isRunning: false });
  } else {
    setState(state, { isRunning: true });
  }

  playPauseUI();
};

export const restartGame = () => {
  setState(state, {
    score: 0,
    isRunning: true,
    snake: [
      {
        x: canvas.width / 2,
        y: canvas.height / 2,
        direction: DIRECTIONS.RIGHT,
      },
    ],
    foodCoords: calcRandomFoodPlace(),
    orientation: ORIENTATION.HORIZONTAL,
    direction: DIRECTIONS.RIGHT,
  });

  resetUI();
};

const afterTickListeners = [];

export const addAfterTickListener = (cb) => afterTickListeners.push(cb);

export const afterTick = () => {
  afterTickListeners.forEach((cb) => cb());
};

export const gameLoop = (ctx) => {
  requestAnimationFrame(() => {
    if (state.isRunning) {
      updatePosition();
      clearCanvas(ctx);
      draw(ctx);
      detectFoodCollision();
      detectTailCollisions();

      afterTick();
    }

    gameLoop(ctx);
  });
};
