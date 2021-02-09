import "./style.css";

const canvas = document.getElementById("canvas");
// canvas.width = window.innerWidth;

const ctx = canvas.getContext("2d");

const state = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  length: 1,
  fillStyle: "#ccc",
};

const setState = (state = {}, updatedStatePartial) => {
  Object.assign(state, updatedStatePartial);
};

const draw = () => {
  ctx.fillstyle = state.fillStyle;
  ctx.fillRect(state.x, state.y, 20, 20);
  console.log(state);
};

setInterval(() => {
  const newXPosition = state.x + 2;
  const x = state.x >= canvas.width ? 0 : newXPosition;

  setState(state, { x });
}, 1000);

const animate = () => {
  requestAnimationFrame(() => {
    clearCanvas();
    draw();

    animate();
  });
};

const clearCanvas = () => {
  ctx.fillStyle = "#ffffff";
  ctx.clearRect(0, 0, canvas.width, canvas.height);
};

const main = (() => {
  animate();
})();
