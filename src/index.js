import "./style.css";

import { gameLoop } from "./drawing";
import { enableSteering, initializeStateWithRandomFoodPos } from "./game";

const main = (() => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  initializeStateWithRandomFoodPos();
  gameLoop(ctx);

  document.addEventListener("keydown", enableSteering);
})();
