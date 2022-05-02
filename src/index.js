import "./style.css";

import { gameLoop } from "./drawing";
import {  initializeStateWithRandomFoodPos } from "./game";
import { setupListeners} from './ui';

const main = (() => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  initializeStateWithRandomFoodPos();
  gameLoop(ctx);

  setupListeners();
})();
