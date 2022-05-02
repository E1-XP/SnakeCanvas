import { DIRECTIONS, ORIENTATION, setState, state, jokes } from "./state";
import { showEndOfGameView } from "./ui";

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
  element.innerHTML = `${state.score}`;

  document.getElementById("heading").innerHTML =
    jokes[Math.floor(Math.random() * jokes.length)];
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
    updateDOMScoreboard();
  }
};

export const enableSteering = (e) => {
  const genStateUpdate = (direction, orientation) => {
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

  switch (e.keyCode) {
    case KEYS.LEFT:
      {
        setState(
          state,
          genStateUpdate(DIRECTIONS.LEFT, ORIENTATION.HORIZONTAL)
        );
      }
      break;
    case KEYS.RIGHT:
      {
        setState(
          state,
          genStateUpdate(DIRECTIONS.RIGHT, ORIENTATION.HORIZONTAL)
        );
      }
      break;

    case KEYS.UP:
      {
        setState(state, genStateUpdate(DIRECTIONS.UP, ORIENTATION.VERTICAL));
      }
      break;
    case KEYS.DOWN:
      {
        setState(state, genStateUpdate(DIRECTIONS.DOWN, ORIENTATION.VERTICAL));
      }
      break;
  }
};
