import { enableSteering } from "./game";
import { setState, state } from "./state";

const heading = document.getElementById("heading");
const formBtn = document.getElementById("form-btn");
const form = document.getElementById("form");
const userInput = document.getElementById("user-input");
const gameContainer = document.getElementById("game-container");
const canvas = document.getElementById("canvas");

const VISUALLY_HIDDEN_CSS = "visually-hidden";
const OPAQUE_CSS = "opaque";
const ON_TOP_CSS = "on-top";

export const setupListeners = () => {
  document.addEventListener("keydown", enableSteering);
  formBtn.addEventListener("click", handleFormSubmit);
};

const handleFormSubmit = (e) => {
  const userName = userInput.value;

  if (!userName) return;
  else e.preventDefault();

  form.classList.add(VISUALLY_HIDDEN_CSS);
  gameContainer.classList.remove(VISUALLY_HIDDEN_CSS);
  heading.textContent = `Let's Dudys!`;

  setState(state, { isRunning: true, user: userName });
};

export const showEndOfGameView = () => {
  heading.textContent = "Game Over!";

  gameContainer.classList.add(OPAQUE_CSS);
  heading.classList.add(ON_TOP_CSS);
};
