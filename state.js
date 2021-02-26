export const state = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  length: 1,
  fillStyle: "#ccc",
};

export const setState = (state = {}, updatedStatePartial) => {
  Object.assign(state, updatedStatePartial);
  console.log(state);
};
