import { DIRECTIONS, ORIENTATION, setState, state, jokes } from "./state";
import {
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
  const direction = state.snake[len - 1].direction;

  switch (direction) {
    case DIRECTIONS.UP: {
      const x = state.snake[len - 1].x;
      const y = state.snake[len - 1].y + state.size;

      return { x, y, direction };
    }

    case DIRECTIONS.DOWN: {
      const x = state.snake[len - 1].x;
      const y = state.snake[len - 1].y - state.size;

      return { x, y, direction };
    }

    case DIRECTIONS.LEFT: {
      const x = state.snake[len - 1].x + state.size;
      const y = state.snake[len - 1].y;

      return { x, y, direction };
    }

    case DIRECTIONS.RIGHT: {
      const x = state.snake[len - 1].x - state.size;
      const y = state.snake[len - 1].y;

      return { x, y, direction };
    }
  }
};

const handleEndOfGame = () => {
  setState(state, { isRunning: false });
  showEndOfGameView();
};

export const detectTailCollisions = () => {
  state.snake.forEach((item, idx) => {
    const collisionWithOtherElement = state.snake.some((itm, i) => {
      const collidedOnXAxis = item.x > itm.x && item.x < itm.x + state.size;
      const collidedOnYAxis = item.y > itm.y && item.y < itm.y + state.size;

      return Math.abs(idx - i) > 2 && collidedOnXAxis && collidedOnYAxis;
    });

    if (collisionWithOtherElement) handleEndOfGame();
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
    updateHeading(jokes[Math.floor(Math.random() * jokes.length)]);
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
    user: "",
  });

  resetUI();
};
