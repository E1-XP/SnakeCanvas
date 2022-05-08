import "../node_modules/normalize.css/normalize.css";
import "./style.css";

import "./db";

import { gameLoop } from "./drawing";
import { initializeStateWithRandomFoodPos } from "./game";
import { setCanvasDimensions, setupListeners } from "./ui";

const main = (() => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  setCanvasDimensions();
  initializeStateWithRandomFoodPos();
  gameLoop(ctx);

  setupListeners();
})();
