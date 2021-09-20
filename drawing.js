import { state, setState, ORIENTATION, DIRECTIONS } from "./state";
import { handleFoodCollision } from "./game";

const drawSnake = (ctx) => {
  let i = 0;
  // console.log(state.snake);

  while (i < state.snake.length) {
    // ctx.fillStyle = "#000";
    // const border = 2;

    // ctx.fillRect(
    //   state.snake[i].x - border,
    //   state.snake[i].y - border,
    //   state.size + border,
    //   state.size + border
    // );

    ctx.fillStyle = state.fillStyle;
    // if (!i) ctx.fillStyle = `#eb4034`;
    // if (i && i === state.snake.length - 1) ctx.fillStyle = "#03A9F4";

    ctx.fillRect(state.snake[i].x, state.snake[i].y, state.size, state.size);

    i++;
  }
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

  if (previously(UP, i) && arr[i - 1].y <= arr[i].y) {
    return move(UP, coords);
  }

  if (previously(DOWN, i) && arr[i].y <= arr[i - 1].y) {
    return move(DOWN, coords);
  }

  if (previously(RIGHT, i) && arr[i - 1].x >= coords.x) {
    return move(RIGHT, coords);
  }

  if (previously(LEFT, i) && arr[i].x >= arr[i - 1].x) {
    return move(LEFT, coords);
  }

  const getDirectionToFollow = () =>
    i === 0
      ? state.direction
      : snakeDirections[snakeDirections.findIndex((item) => item.idx === i) - 1]
          .direction;

  return move(getDirectionToFollow(), coords);
};

const move = (direction, coords) => {
  const oneStep = canvas.width / state.speed;

  switch (direction) {
    case DIRECTIONS.LEFT: {
      const newXPosition = coords.x - canvas.width / state.speed;
      const x = coords.x < 0 ? canvas.width : newXPosition;

      return { ...coords, x, direction };
    }

    case DIRECTIONS.RIGHT: {
      const newXPosition = coords.x + canvas.width / state.speed;
      const x = coords.x >= canvas.width ? 0 : newXPosition;

      return { ...coords, x, direction };
    }

    case DIRECTIONS.UP: {
      const newYPosition = coords.y - oneStep;
      const y = coords.y < 0 ? canvas.height : newYPosition;

      return { ...coords, y, direction };
    }

    case DIRECTIONS.DOWN: {
      const newYPosition = coords.y + oneStep;
      const y = coords.y >= canvas.height ? 0 : newYPosition;

      return { ...coords, y, direction };
    }

    default:
      break;
  }
};

export const gameLoop = (ctx) => {
  requestAnimationFrame(() => {
    clearCanvas(ctx);
    draw(ctx);
    updatePosition();
    handleFoodCollision();

    gameLoop(ctx);
  });
};
