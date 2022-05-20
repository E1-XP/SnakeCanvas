import "../node_modules/normalize.css/normalize.css";
import "./style.css";

import "./db";

import {
  initializeStateWithRandomFoodPos,
  gameLoop,
  addAfterTickListener,
} from "./game";
import { handleResize, setupListeners } from "./ui";
import { fireQueuedKeyPresses } from "./steering";

const main = (() => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  handleResize();
  initializeStateWithRandomFoodPos();
  addAfterTickListener(fireQueuedKeyPresses);

  gameLoop(ctx);

  setupListeners();
})();
