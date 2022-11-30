require("dotenv").config();

import "../node_modules/normalize.css/normalize.css";
import "./style.css";

import "./db";

import { setRandomFoodPosition, gameLoop, addAfterTickListener } from "./game";
import { handleResize, setupListeners } from "./ui";
import { fireQueuedKeyPresses } from "./steering";

const main = (() => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  handleResize();
  setRandomFoodPosition();
  addAfterTickListener(fireQueuedKeyPresses);

  gameLoop(ctx);

  setupListeners();
})();
