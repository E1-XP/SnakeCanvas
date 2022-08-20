import { clearCanvas, draw, updatePosition } from "./drawing";
import { DIRECTIONS, ORIENTATION, setState, state, jokes } from "./state";
import {
  getRandomJoke,
  resetUI,
  showEndOfGameView,
  syncDOMScoreboardWithState,
  updateHeading,
} from "./ui";

export const calcRandomFoodPlace = () => {
  const x = Math.random() * (canvas.width - state.size);
  const y = Math.random() * (canvas.height - state.size);

  return { x, y };
};

export const initializeStateWithRandomFoodPos = () => {
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

export const detectTailCollisions = () => {
  const collisionDetected = (a, b) => {
    const collidedOnXAxis = a.x > b.x && a.x < b.x + state.size;
    const collidedOnYAxis = a.y > b.y && a.y < b.y + state.size;

    return collidedOnXAxis && collidedOnYAxis;
  };

  const notSameCoords = (a, b) => a.idx !== b.idx;

  state.snake.forEach((item, idx) => {
    const collidedWithOtherElement = state.snake.some(
      (itm, i) => Math.abs(idx - i) > 4 && collisionDetected(item, itm)
    );

    const collidedWithBorderTail = state.snakeBorderTails.some(
      (coords) =>
        notSameCoords(item, coords) &&
        Math.abs(idx - coords.idx) > 4 &&
        collisionDetected(item, coords)
    );

    if (collidedWithOtherElement || collidedWithBorderTail) handleEndOfGame();
  });
};

export const handleFoodCollision = () => {
  const foodObjectBorders = {
    xStart: state.foodCoords.x,
    xEnd: state.foodCoords.x + state.size,
    yStart: state.foodCoords.y,
    yEnd: state.foodCoords.y + state.size,
  };

  const collidedOnXAxis = [
    state.snake[0].x,
    state.snake[0].x + state.size,
  ].some(
    (coord) =>
      coord >= foodObjectBorders.xStart && coord <= foodObjectBorders.xEnd
  );

  const collidedOnYAxis = [
    state.snake[0].y,
    state.snake[0].y + state.size,
  ].some(
    (coord) =>
      coord >= foodObjectBorders.yStart && coord <= foodObjectBorders.yEnd
  );

  if (collidedOnXAxis && collidedOnYAxis) {
    initializeStateWithRandomFoodPos();

    setState(state, {
      score: state.score + 1,
      snake: [...state.snake, getNewSegmentCoords()],
    });

    syncDOMScoreboardWithState();
    updateHeading(getRandomJoke());
  }
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
      detectTailCollisions();
      handleFoodCollision();

      afterTick();
    }

    gameLoop(ctx);
  });
};
