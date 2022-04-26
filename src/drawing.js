import { state, setState, ORIENTATION, DIRECTIONS } from "./state";
import { handleFoodCollision, detectTailCollisions } from "./game";

const beerImg = new Image();
let isLoaded = false;
beerImg.onload = function () {
  isLoaded = true;
};

beerImg.src = "./../public/assets/beer.gif";

const whatIsThis = new Image();
let isThisLoaded = false;
whatIsThis.onload = function () {
  isThisLoaded = true;
};
whatIsThis.src = "./../public/assets/what.gif";

const drawSnake = (ctx) => {
  let i = 0;

  while (i < state.snake.length) {
    // ctx.fillStyle = state.fillStyle;
    // ctx.fillRect(state.snake[i].x, state.snake[i].y, state.size, state.size);

    if (isThisLoaded) {
      ctx.drawImage(
        whatIsThis,
        state.snake[i].x - 15,
        state.snake[i].y - 15,
        state.size,
        state.size
      );

      handleDrawingOnCanvasEdges(ctx, state.snake[i]);
    }
    i++;
  }

  // fillSpaceBetweenElementsOnDirectionChange(ctx);
};

const handleDrawingOnCanvasEdges = (ctx, coords) => {
  switch (coords.direction) {
    case DIRECTIONS.LEFT:
      {
        if (coords.x > canvas.width - state.size)
          ctx.drawImage(
            whatIsThis,
            coords.x - canvas.width,
            coords.y,
            state.size,
            state.size
          );
      }
      break;
    case DIRECTIONS.RIGHT:
      {
        if (coords.x < state.size)
          ctx.drawImage(
            whatIsThis,
            coords.x + canvas.width - state.oneStep,
            coords.y - state.oneStep * 4,
            state.size,
            state.size
          );
      }
      break;
    case DIRECTIONS.UP:
      {
        if (coords.y > canvas.height - state.size)
          ctx.drawImage(
            whatIsThis,
            coords.x - state.oneStep * 4,
            coords.y - canvas.height - state.oneStep,
            state.size,
            state.size
          );
      }
      break;
    case DIRECTIONS.DOWN:
      {
        if (coords.y < state.size)
          ctx.drawImage(
            whatIsThis,
            coords.x,
            coords.y + canvas.height + state.oneStep,
            state.size,
            state.size
          );
      }
      break;
  }
};

const fillSpaceBetweenElementsOnDirectionChange = (ctx) => {
  const snakeDirections = getSnakeDirections().slice(1);

  snakeDirections.map((item) => {
    const coords = state.snake[item.idx - 1];
    const currCoords = state.snake[item.idx];

    switch (coords.direction) {
      case DIRECTIONS.UP:
        ctx.fillRect(coords.x, currCoords.y, state.size, state.size);
        break;
      case DIRECTIONS.DOWN:
        ctx.fillRect(coords.x, currCoords.y, state.size, state.size);
        break;
      case DIRECTIONS.LEFT:
        ctx.fillRect(currCoords.x, coords.y, state.size, state.size);
        break;
      case DIRECTIONS.RIGHT:
        ctx.fillRect(currCoords.x, coords.y, state.size, state.size);
        break;
    }
  });
};

const drawFood = (ctx) => {
  const { x, y } = state.foodCoords;

  ctx.fillStyle = "#000";
  // ctx.fillRect(x, y, state.size, state.size);

  if (isLoaded) {
    ctx.drawImage(
      beerImg,
      x - beerImg.width / 7 / 2 + 20,
      y - beerImg.height / 7 / 2 + 10,
      beerImg.width / 7,
      beerImg.height / 7
    );
  }
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
    const direction = snakeDirections[positiveIdx]?.direction;

    return direction;
  };

  return move(getDirectionToFollow(), coords, prevElemCoords);
};

const removeUnneccessarySpaceBetweenElements = (idealCoords, presentCoords) => {
  ["x", "y"].forEach((propKey) => {
    const tooLowDiff = () =>
      Math.abs(idealCoords[propKey] - presentCoords[propKey]) < state.oneStep;
    const tooBigDiff = () =>
      Math.abs(idealCoords[propKey] - presentCoords[propKey]) > state.size;

    if (presentCoords[propKey] !== idealCoords[propKey]) {
      presentCoords[propKey] =
        presentCoords[propKey] > idealCoords[propKey]
          ? presentCoords[propKey] - state.oneStep
          : presentCoords[propKey] + state.oneStep;

      if (tooLowDiff() || tooBigDiff())
        presentCoords[propKey] = idealCoords[propKey];
    }
  });
};

const move = (direction, coords, prevElemCoords) => {
  const sameDirection =
    prevElemCoords && prevElemCoords.direction === direction;

  switch (direction) {
    case DIRECTIONS.LEFT: {
      const updatedCoords = { ...coords, direction };

      updatedCoords.x = coords.x - state.oneStep;

      if (sameDirection) {
        const idealCoords = {};
        idealCoords.x = prevElemCoords.x + state.size - state.oneStep;
        idealCoords.y = prevElemCoords.y;

        removeUnneccessarySpaceBetweenElements(idealCoords, updatedCoords);
      }
      if (updatedCoords.x < 0) updatedCoords.x = canvas.width;

      return updatedCoords;
    }

    case DIRECTIONS.RIGHT: {
      const updatedCoords = { ...coords, direction };

      updatedCoords.x = coords.x + state.oneStep;

      if (sameDirection) {
        const idealCoords = {};
        idealCoords.x = prevElemCoords.x - state.size + state.oneStep;
        idealCoords.y = prevElemCoords.y;

        removeUnneccessarySpaceBetweenElements(idealCoords, updatedCoords);
      }
      if (updatedCoords.x >= canvas.width) updatedCoords.x = 0;

      return updatedCoords;
    }

    case DIRECTIONS.UP: {
      const updatedCoords = { ...coords, direction };

      updatedCoords.y = coords.y - state.oneStep;

      if (sameDirection) {
        const idealCoords = {};
        idealCoords.y = prevElemCoords.y + state.size - state.oneStep;
        idealCoords.x = prevElemCoords.x;

        removeUnneccessarySpaceBetweenElements(idealCoords, updatedCoords);
      }
      if (updatedCoords.y < 0) updatedCoords.y = canvas.height;

      return updatedCoords;
    }

    case DIRECTIONS.DOWN: {
      const updatedCoords = { ...coords, direction };

      updatedCoords.y = coords.y + state.oneStep;

      if (sameDirection) {
        const idealCoords = {};
        idealCoords.y = prevElemCoords.y - state.size + state.oneStep;
        idealCoords.x = prevElemCoords.x;

        removeUnneccessarySpaceBetweenElements(idealCoords, updatedCoords);
      }
      if (updatedCoords.y >= canvas.height) updatedCoords.y = 0;

      return updatedCoords;
    }
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
