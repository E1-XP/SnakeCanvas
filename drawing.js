import { state, setState, ORIENTATION, DIRECTIONS } from "./state";

export const draw = (ctx) => {
  ctx.fillstyle = state.fillStyle;
  ctx.fillRect(state.x, state.y, 20, 20);
};

export const clearCanvas = (ctx) => {
  ctx.fillStyle = "#ffffff";
  ctx.clearRect(0, 0, canvas.width, canvas.height);
};

export const updatePosition = () => {
  switch (state.orientation) {
    case ORIENTATION.HORIZONTAL:
      {
        switch (state.direction) {
          case DIRECTIONS.LEFT:
            {
              const newXPosition = state.x - canvas.width / state.speed;
              const x = state.x < 0 ? canvas.width : newXPosition;

              setState(state, { x });
            }
            break;
          case DIRECTIONS.RIGHT:
            {
              const newXPosition = state.x + canvas.width / state.speed;
              const x = state.x >= canvas.width ? 0 : newXPosition;

              setState(state, { x });
            }
            break;
        }
      }
      break;

    case ORIENTATION.VERTICAL:
      {
        switch (state.direction) {
          case DIRECTIONS.UP:
            {
              const newYPosition = state.y - canvas.width / state.speed;
              const y = state.y < 0 ? canvas.height : newYPosition;

              setState(state, { y });
            }
            break;
          case DIRECTIONS.DOWN:
            {
              const newYPosition = state.y + canvas.width / state.speed;
              const y = state.y >= canvas.height ? 0 : newYPosition;

              setState(state, { y });
            }
            break;
        }
      }
      break;
  }
};

export const renderLoop = (ctx) => {
  requestAnimationFrame(() => {
    clearCanvas(ctx);
    draw(ctx);
    updatePosition();

    renderLoop(ctx);
  });
};
