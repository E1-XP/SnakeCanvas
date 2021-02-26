import { state, setState } from "./state";

export const draw = (ctx) => {
  ctx.fillstyle = state.fillStyle;
  ctx.fillRect(state.x, state.y, 20, 20);
};

export const clearCanvas = (ctx) => {
  ctx.fillStyle = "#ffffff";
  ctx.clearRect(0, 0, canvas.width, canvas.height);
};

export const beginPositionUpdate = () =>
  setInterval(() => {
    const newXPosition = state.x + canvas.width / 10;
    const x = state.x >= canvas.width ? 0 : newXPosition;

    setState(state, { x });
  }, 1000);

export const renderLoop = (ctx) => {
  requestAnimationFrame(() => {
    clearCanvas(ctx);
    draw(ctx);

    renderLoop(ctx);
  });
};
