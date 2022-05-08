import {
  getFirestore,
  getDocs,
  collection,
  query,
  addDoc,
  orderBy,
  limit,
} from "firebase/firestore";
import debounce from "lodash.debounce";

import { app } from "./db";

import { enableSteering, restartGame } from "./game";
import { setState, state } from "./state";

const heading = document.getElementById("heading");
const formBtn = document.getElementById("form-btn");
const form = document.getElementById("form");
const userInput = document.getElementById("user-input");
const gameContainer = document.getElementById("game-container");
const canvas = document.getElementById("canvas");
const resultsContainer = document.getElementById("results");
const resultsList = resultsContainer.querySelector(".results__list");
const scoreBoard = document.getElementById("score");
const spinner = document.getElementById("spinner");
const restartBtn = document.getElementById("restart-button");
const headerImages = document.getElementsByClassName("header__image");

const CANVAS_WIDTH = 1280;
const CANVAS_WIDTH_MOBILE = 900;
const CANVAS_HEIGHT = 720;
const CANVAS_HEIGHT_MOBILE = 1100;

const VISUALLY_HIDDEN_CSS = "visually-hidden";
const HIDDEN_CSS = "hidden";
const OPAQUE_CSS = "opaque";
const ON_TOP_CSS = "on-top";
const ON_TOP_FULL_SCREEN_CSS = "on-top-full-screen";

export const setupListeners = () => {
  window.addEventListener("resize", debounce(setCanvasDimensions, 50));

  window.addEventListener("keydown", preventPageScroll);
  document.addEventListener("keydown", enableSteering);
  formBtn.addEventListener("click", handleFormSubmit);
  restartBtn.addEventListener("click", restartGame);
};

const handleFormSubmit = (e) => {
  const userName = userInput.value;

  if (!userName) return;
  else e.preventDefault();

  form.classList.add(VISUALLY_HIDDEN_CSS);
  gameContainer.classList.remove(VISUALLY_HIDDEN_CSS);
  [...headerImages].forEach((item) =>
    item.classList.remove(VISUALLY_HIDDEN_CSS)
  );

  updateHeading(`Let's Dudys!`);
  setState(state, { isRunning: true, user: userName });
};

export const showEndOfGameView = async () => {
  updateHeading(`Game Over! Your score: ${state.score}`);

  resultsContainer.classList.add(OPAQUE_CSS);
  heading.classList.add(ON_TOP_CSS);
  resultsContainer.classList.remove(HIDDEN_CSS);
  resultsContainer.classList.add(ON_TOP_FULL_SCREEN_CSS);

  try {
    const db = getFirestore(app);
    const scoresRef = collection(db, "scores");

    await addDoc(collection(db, "scores"), {
      name: state.user,
      score: state.score,
    });

    const response = await getDocs(
      query(scoresRef, orderBy("score", "desc"), limit(8))
    );

    const data = response.docs
      .map((v) => ({
        name: v.get("name"),
        score: v.get("score"),
      }))
      .sort((a, b) => b.score - a.score);

    spinner.classList.add(VISUALLY_HIDDEN_CSS);
    restartBtn.classList.remove(VISUALLY_HIDDEN_CSS);

    data.map((v, i) => {
      const item = document.createElement("li");

      item.classList.add("results__item");
      item.innerHTML = `${i + 1}. ${v.name} - ${v.score}`;
      resultsList.appendChild(item);
    });
  } catch (err) {
    console.error(err);
  }
};

export const updateHeading = (string) => {
  heading.innerHTML = string;
};

export const syncDOMScoreboardWithState = () => {
  scoreBoard.innerHTML = `${state.score}`;
};

export const resetUI = () => {
  updateHeading(`Let's Dudys`);
  syncDOMScoreboardWithState();

  spinner.classList.remove(VISUALLY_HIDDEN_CSS);

  resultsContainer.classList.add(HIDDEN_CSS);
  resultsContainer.classList.remove(ON_TOP_FULL_SCREEN_CSS, OPAQUE_CSS);

  restartBtn.classList.add(VISUALLY_HIDDEN_CSS);
  resultsList.innerHTML = "";
};

const preventPageScroll = (e) => {
  const keys = ["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];

  if (keys.indexOf(e.code) > -1) {
    e.preventDefault();
  }
};

export const setCanvasDimensions = (e) => {
  const isMobile = window.innerWidth < 500;

  if (!isMobile && state.canvasDimensions.width !== CANVAS_WIDTH) {
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    setState(state, {
      canvasDimensions: { width: CANVAS_WIDTH, height: CANVAS_HEIGHT },
    });
  } else if (isMobile && state.canvasDimensions.width !== CANVAS_WIDTH_MOBILE) {
    canvas.width = CANVAS_WIDTH_MOBILE;
    canvas.height = CANVAS_HEIGHT_MOBILE;

    setState(state, {
      canvasDimensions: {
        width: CANVAS_WIDTH_MOBILE,
        height: CANVAS_HEIGHT_MOBILE,
      },
    });
  }
};
