import { state, setState, ORIENTATION, DIRECTIONS } from "./state";

const beerImg = new Image();
let isLoaded = false;
beerImg.onload = function () {
  isLoaded = true;
};

beerImg.src = "./assets/beer.gif";

const whatIsThis = new Image();
let isThisLoaded = false;
whatIsThis.onload = function () {
  isThisLoaded = true;
};
whatIsThis.src = "./assets/what.gif";

const drawSnake = (ctx) => {
  let i = 0;

  while (i < state.snake.length) {
    drawSegment(
      ctx,
      state.snake[i].x,
      state.snake[i].y,
      state.size,
      state.size
    );

    handleDrawingOnCanvasEdges(ctx, state.snake[i]);
    handleSideEdges(ctx, state.snake[i]);

    i++;
  }

  // fillSpaceBetweenElementsOnDirectionChange(ctx);
};

const drawSegment = (
  ctx,
  x,
  y,
  sizeX,
  sizeY,
  options = { fill: state.fillStyle }
) => {
  ctx.drawImage(whatIsThis, x, y, sizeX, sizeY);

  // ctx.lineWidth = 3;
  // ctx.strokeStyle = options.fill;
  // ctx.fillStyle = options.fill;

  // ctx.beginPath();
  // ctx.arc(x, y, state.size / 2, 0, 2 * Math.PI, false);
  // ctx.fill();
};

const handleSideEdges = (ctx, coords) => {
  if (coords.y >= canvas.height - state.size) {
    const updatedCoords = {
      ...coords,
      y: coords.y - canvas.height,
    };

    drawSegment(ctx, updatedCoords.x, updatedCoords.y, state.size, state.size, {
      // fill: "orangered",
    });

    handleDrawingOnCanvasEdges(ctx, updatedCoords);
  }

  if (coords.y <= state.size) {
    const updatedCoords = {
      ...coords,
      y: coords.y + canvas.height,
    };

    drawSegment(ctx, updatedCoords.x, updatedCoords.y, state.size, state.size, {
      // fill: "orangered",
    });

    handleDrawingOnCanvasEdges(ctx, updatedCoords);
  }

  if (coords.x >= canvas.width - state.size) {
    const updatedCoords = {
      ...coords,
      x: coords.x - canvas.width,
    };

    drawSegment(ctx, updatedCoords.x, updatedCoords.y, state.size, state.size, {
      // fill: "orangered",
    });

    handleDrawingOnCanvasEdges(ctx, updatedCoords);
  }

  if (coords.x <= state.size) {
    const updatedCoords = {
      ...coords,
      x: coords.x + canvas.width,
    };

    drawSegment(ctx, updatedCoords.x, updatedCoords.y, state.size, state.size, {
      // fill: "orangered",
    });

    handleDrawingOnCanvasEdges(ctx, updatedCoords);
  }
};

const handleDrawingOnCanvasEdges = (ctx, coords) => {
  switch (coords.direction) {
    case DIRECTIONS.LEFT:
      {
        if (coords.x >= canvas.width - state.size) {
          drawSegment(
            ctx,
            coords.x - canvas.width,
            coords.y,
            state.size,
            state.size
            // { fill: "black" }
          );
        }
      }
      break;
    case DIRECTIONS.RIGHT:
      {
        if (coords.x <= 0) {
          drawSegment(
            ctx,
            coords.x + canvas.width,
            coords.y,
            state.size,
            state.size
            // { fill: "black" }
          );
        }
      }
      break;
    case DIRECTIONS.UP:
      {
        if (coords.y >= canvas.height - state.size) {
          drawSegment(
            ctx,
            coords.x,
            coords.y - canvas.height,
            state.size,
            state.size
            // { fill: "black" }
          );
        }
      }
      break;
    case DIRECTIONS.DOWN:
      {
        if (coords.y <= 0) {
          drawSegment(
            ctx,
            coords.x,
            coords.y + canvas.height,
            state.size,
            state.size
            // { fill: "black" }
          );
        }
      }
      break;
  }
};

const fillSpaceBetweenElementsOnDirectionChange = (ctx) => {
  const snakeDirections = getSnakeDirections().slice(1);

  snakeDirections.forEach((item) => {
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

  // ctx.fillStyle = "#000";
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
  state.snake.reduce((acc, { direction }, idx) => {
    if (!acc.length || acc[acc.length - 1].direction !== direction) {
      acc.push({ direction, idx });
    }

    return acc;
  }, []);

const previously = (direction, idx) => {
  if (idx === 0) return false;

  const snakeDirections = getSnakeDirections();

  const item = snakeDirections
    .slice()
    .reverse()
    .find((item) => item.idx <= idx);

  return item.direction === direction;
};

const getTailCoords = (coords, i, arr) => {
  const { UP, DOWN, LEFT, RIGHT } = DIRECTIONS;
  const prevElemCoords = arr[i - 1];

  if (!i) return move(state.direction, coords, prevElemCoords);

  if (
    previously(UP, i) &&
    (prevElemCoords.y < coords.y ||
      prevElemCoords.y >= canvas.height - state.size) &&
    Math.abs(coords.y - prevElemCoords.y) >= state.oneStep
  ) {
    return move(UP, coords, prevElemCoords);
  }

  if (
    previously(DOWN, i) &&
    (coords.y < prevElemCoords.y || prevElemCoords.y <= state.size) &&
    Math.abs(coords.y - prevElemCoords.y) >= state.oneStep
  ) {
    return move(DOWN, coords, prevElemCoords);
  }

  if (
    previously(RIGHT, i) &&
    (prevElemCoords.x > coords.x || prevElemCoords.x <= state.size) &&
    Math.abs(coords.x - prevElemCoords.x) >= state.oneStep
  ) {
    return move(RIGHT, coords, prevElemCoords);
  }

  if (
    previously(LEFT, i) &&
    (coords.x > prevElemCoords.x ||
      prevElemCoords.x >= canvas.width - state.size) &&
    Math.abs(coords.x - prevElemCoords.x) >= state.oneStep
  ) {
    return move(LEFT, coords, prevElemCoords);
  }

  const getDirectionToFollow = () => {
    const snakeDirections = getSnakeDirections();

    if (i === 0 || snakeDirections.length === 1) return state.direction;

    const foundIdx = snakeDirections.findIndex((item) => item.idx === i) - 1;
    const positiveIdx = Math.max(0, foundIdx);
    const direction = snakeDirections[positiveIdx]?.direction;

    return direction;
  };

  return move(getDirectionToFollow(), coords, prevElemCoords);
};

const move = (direction, coords, prevElemCoords) => {
  const sameDirection =
    prevElemCoords && prevElemCoords.direction === direction;

  const toFixed2 = (n) =>
    +n
      .toString()
      .split(".")
      .map((s, i) => (i ? s.slice(0, 2) : s))
      .join(".");

  switch (direction) {
    case DIRECTIONS.LEFT: {
      const updatedCoords = { ...coords, direction };
      updatedCoords.x = toFixed2(coords.x - state.oneStep);

      const isOnEdge = (coords) => coords.x < state.oneStep;

      const onEdgeCase = (coords) => {
        if (isOnEdge(coords)) {
          coords.x = toFixed2(canvas.width - coords.x);
        }
      };

      if (sameDirection) {
        const idealCoords = { ...updatedCoords };
        idealCoords.x = toFixed2(prevElemCoords.x + state.size - state.oneStep);
        idealCoords.y = toFixed2(prevElemCoords.y);

        onEdgeCase(idealCoords);

        return idealCoords;
      }

      onEdgeCase(updatedCoords);

      return updatedCoords;
    }

    case DIRECTIONS.RIGHT: {
      const updatedCoords = { ...coords, direction };
      updatedCoords.x = toFixed2(coords.x + state.oneStep);

      const isOnEdge = (coords) => coords.x >= canvas.width;

      const onEdgeCase = (coords) => {
        if (isOnEdge(coords)) {
          coords.x = toFixed2(coords.x - canvas.width);
        }
      };

      if (sameDirection) {
        const idealCoords = { ...updatedCoords };
        idealCoords.x = toFixed2(prevElemCoords.x - state.size + state.oneStep);
        idealCoords.y = toFixed2(prevElemCoords.y);

        onEdgeCase(idealCoords);

        return idealCoords;
      }

      onEdgeCase(updatedCoords);

      return updatedCoords;
    }

    case DIRECTIONS.UP: {
      const updatedCoords = { ...coords, direction };
      updatedCoords.y = toFixed2(coords.y - state.oneStep);

      const isOnEdge = (coords) => coords.y <= 0;

      const onEdgeCase = (coords) => {
        if (isOnEdge(coords)) {
          coords.y = toFixed2(canvas.height - coords.y);
        }
      };

      if (sameDirection) {
        const idealCoords = { ...updatedCoords };
        idealCoords.y = toFixed2(prevElemCoords.y + state.size - state.oneStep);
        idealCoords.x = toFixed2(prevElemCoords.x);

        onEdgeCase(idealCoords);

        return idealCoords;
      }

      onEdgeCase(updatedCoords);

      return updatedCoords;
    }

    case DIRECTIONS.DOWN: {
      const updatedCoords = { ...coords, direction };
      updatedCoords.y = toFixed2(coords.y + state.oneStep);

      const isOnEdge = (coords) => coords.y >= canvas.height;

      const onEdgeCase = (coords) => {
        if (isOnEdge(coords)) {
          coords.y = toFixed2(coords.y - canvas.height);
        }
      };

      if (sameDirection) {
        const idealCoords = { ...updatedCoords };
        idealCoords.y = toFixed2(prevElemCoords.y - state.size + state.oneStep);
        idealCoords.x = toFixed2(prevElemCoords.x);

        onEdgeCase(idealCoords);

        return idealCoords;
      }

      onEdgeCase(updatedCoords);

      return updatedCoords;
    }
  }
};
