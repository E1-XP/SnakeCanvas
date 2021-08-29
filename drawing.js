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

const previously = (direction) => state.previousDirection === direction;

const getTailCoords = (coords, i, arr) => {
  if (previously(DIRECTIONS.UP) && i !== 0 && arr[i - 1].y < arr[i].y) {
    console.log("1");
    return move(DIRECTIONS.UP, coords);
  }

  if (previously(DIRECTIONS.DOWN) && i !== 0 && arr[i].y < arr[i - 1].y) {
    console.log("1.1");
    return move(DIRECTIONS.DOWN, coords);
  }

  if (previously(DIRECTIONS.RIGHT) && i !== 0 && arr[i - 1].x > coords.x) {
    console.log("3", state.previousDirection);

    return move(DIRECTIONS.RIGHT, coords);
  }

  if (previously(DIRECTIONS.LEFT) && i !== 0 && arr[i].x > arr[i - 1].x) {
    console.log("4", state.previousDirection);

    return move(DIRECTIONS.LEFT, coords);
  }

  return move(state.direction, coords);
};

const move = (direction, coords) => {
  const oneStep = canvas.width / state.speed;

  switch (direction) {
    case DIRECTIONS.LEFT: {
      const newXPosition = coords.x - canvas.width / state.speed;
      const x = coords.x < 0 ? canvas.width : newXPosition;

      return { ...coords, x };
    }

    case DIRECTIONS.RIGHT: {
      const newXPosition = coords.x + canvas.width / state.speed;
      const x = coords.x >= canvas.width ? 0 : newXPosition;

      return { ...coords, x };
    }

    case DIRECTIONS.UP: {
      const newYPosition = coords.y - oneStep;
      const y = coords.y < 0 ? canvas.height : newYPosition;

      return { ...coords, y };
    }

    case DIRECTIONS.DOWN: {
      const newYPosition = coords.y + oneStep;
      const y = coords.y >= canvas.height ? 0 : newYPosition;

      return { ...coords, y };
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
