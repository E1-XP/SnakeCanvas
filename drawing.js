import { state, setState, ORIENTATION, DIRECTIONS } from "./state";
import { handleFoodCollision, detectTailCollisions } from "./game";

const drawSnake = (ctx) => {
  let i = 0;

  while (i < state.snake.length) {
    ctx.fillStyle = state.fillStyle;
    ctx.fillRect(state.snake[i].x, state.snake[i].y, state.size, state.size);

    i++;
  }

  handleDrawingOnCanvasEdges(ctx);
};

const handleDrawingOnCanvasEdges = (ctx) => {
  state.snake.forEach((coords) => {
    switch (coords.direction) {
      case DIRECTIONS.RIGHT:
        {
          if (coords.x < state.size)
            ctx.fillRect(
              coords.x + canvas.width + state.oneStep,
              coords.y,
              state.size,
              state.size
            );
        }
        break;
      case DIRECTIONS.LEFT:
        {
          if (coords.x > canvas.width - state.size)
            ctx.fillRect(
              coords.x - canvas.width - state.oneStep,
              coords.y,
              state.size,
              state.size
            );
        }
        break;
      case DIRECTIONS.UP:
        {
          if (coords.y > canvas.height - state.size)
            ctx.fillRect(
              coords.x,
              coords.y - canvas.height - state.oneStep,
              state.size,
              state.size
            );
        }
        break;
      case DIRECTIONS.DOWN:
        {
          if (coords.y < state.size)
            ctx.fillRect(
              coords.x,
              coords.y + canvas.height + state.oneStep,
              state.size,
              state.size
            );
        }
        break;
    }
  });
};

const drawFood = (ctx) => {
  const { x, y } = state.foodCoords;

  ctx.fillStyle = "#000";
  ctx.fillRect(x, y, state.size, state.size);
};

export const draw = (ctx) => {
  drawFood(ctx);
  drawSnake(ctx);
};

export const clearCanvas = (ctx) => {
  ctx.fillStyle = "#ffffff";
  ctx.clearRect(0, 0, canvas.width, canvas.height);
};

export const updatePosition = () => {
  const updatedSnakeBody = state.snake.map(getTailCoords);
  setState(state, { snake: updatedSnakeBody });
};

const getSnakeDirections = () =>
  state.snake.reduce((acc, { direction }, i) => {
    if (!acc.length || acc[acc.length - 1].direction !== direction) {
      acc.push({ direction, idx: i });
    }

    return acc;
  }, []);

const previously = (direction, idx) => {
  const snakeDirections = getSnakeDirections();

  const item = snakeDirections
    .slice()
    .reverse()
    .find((item) => item.idx <= idx);

  return idx !== 0 && item.direction === direction;
};

const getTailCoords = (coords, i, arr) => {
  const { UP, DOWN, LEFT, RIGHT } = DIRECTIONS;

  const snakeDirections = getSnakeDirections();
  const prevElemCoords = arr[i - 1];

  if (previously(UP, i) && prevElemCoords.y < coords.y) {
    return move(UP, coords, prevElemCoords);
  }

  if (previously(DOWN, i) && coords.y < prevElemCoords.y) {
    return move(DOWN, coords, prevElemCoords);
  }

  if (previously(RIGHT, i) && prevElemCoords.x > coords.x) {
    return move(RIGHT, coords, prevElemCoords);
  }

  if (previously(LEFT, i) && coords.x > prevElemCoords.x) {
    return move(LEFT, coords, prevElemCoords);
  }

  const getDirectionToFollow = () => {
    if (i === 0 || snakeDirections.length === 1) return state.direction;

    const foundIdx = snakeDirections.findIndex((item) => item.idx === i) - 1;
    const positiveIdx = Math.max(0, foundIdx);
    const x = snakeDirections[positiveIdx]?.direction;

    // console.log(
    //   x,
    //   i,
    //   state.snake[i]?.direction,
    //   foundIdx,
    //   snakeDirections,
    //   state.snake.map((itm) => itm.direction).join("-")
    // );

    return x;
  };

  return move(getDirectionToFollow(), coords, prevElemCoords);
};

const move = (direction, coords, prevElemCoords) => {
  const sameDirection =
    prevElemCoords && prevElemCoords.direction === direction;

  switch (direction) {
    case DIRECTIONS.LEFT: {
      const updatedCoords = { ...coords, direction };

      updatedCoords.x = coords.x - state.oneStep;

      if (sameDirection) {
        updatedCoords.x = prevElemCoords.x + state.size - state.oneStep;
        updatedCoords.y = prevElemCoords.y;
      }
      if (coords.x < 0) updatedCoords.x = canvas.width;

      return updatedCoords;
    }

    case DIRECTIONS.RIGHT: {
      const updatedCoords = { ...coords, direction };

      updatedCoords.x = coords.x + state.oneStep;

      if (sameDirection) {
        updatedCoords.x = prevElemCoords.x - state.size + state.oneStep;
        updatedCoords.y = prevElemCoords.y;
      }
      if (coords.x >= canvas.width) updatedCoords.x = 0;

      return updatedCoords;
    }

    case DIRECTIONS.UP: {
      const updatedCoords = { ...coords, direction };

      updatedCoords.y = coords.y - state.oneStep;

      if (sameDirection) {
        updatedCoords.y = prevElemCoords.y + state.size - state.oneStep;
        updatedCoords.x = prevElemCoords.x;
      }
      if (coords.y < 0) updatedCoords.y = canvas.height;

      return updatedCoords;
    }

    case DIRECTIONS.DOWN: {
      const updatedCoords = { ...coords, direction };

      updatedCoords.y = coords.y + state.oneStep;

      if (sameDirection) {
        updatedCoords.y = prevElemCoords.y - state.size + state.oneStep;
        updatedCoords.x = prevElemCoords.x;
      }
      if (coords.y >= canvas.height) updatedCoords.y = 0;

      return updatedCoords;
    }

    default:
      break;
  }
};

export const gameLoop = (ctx) => {
  requestAnimationFrame(() => {
    updatePosition();
    clearCanvas(ctx);
    draw(ctx);
    detectTailCollisions();
    handleFoodCollision();

    if (!state.finished) gameLoop(ctx);
  });
};
