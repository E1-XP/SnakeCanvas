import "./style.css";

import { renderLoop } from "./drawing";
import { enableSteering } from "./game";

const main = (() => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  renderLoop(ctx);

  document.addEventListener("keydown", enableSteering);
})();
