import "./style.css";

import { renderLoop, beginPositionUpdate } from "./drawing";

const main = (() => {
  const canvas = document.getElementById("canvas");
  // canvas.width = window.innerWidth;
  const ctx = canvas.getContext("2d");

  renderLoop(ctx);
  beginPositionUpdate();
})();
