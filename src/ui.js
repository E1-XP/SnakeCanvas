import {
  getFirestore,
  getDocs,
  collection,
  query,
  addDoc,
  orderBy,
  limit,
} from "firebase/firestore";
import { app } from "./db";

import { enableSteering } from "./game";
import { setState, state } from "./state";

const heading = document.getElementById("heading");
const formBtn = document.getElementById("form-btn");
const form = document.getElementById("form");
const userInput = document.getElementById("user-input");
const gameContainer = document.getElementById("game-container");
const canvas = document.getElementById("canvas");
const resultsContainer = document.getElementById("results");
const resultsList = resultsContainer.querySelector(".results__list");

const VISUALLY_HIDDEN_CSS = "visually-hidden";
const OPAQUE_CSS = "opaque";
const ON_TOP_CSS = "on-top";
const ON_TOP_CENTERED_CSS = "on-top-centered";

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

export const showEndOfGameView = async () => {
  heading.textContent = `Game Over! Your score: ${state.score}`;

  gameContainer.classList.add(OPAQUE_CSS);
  heading.classList.add(ON_TOP_CSS);
  resultsContainer.classList.remove(VISUALLY_HIDDEN_CSS);
  resultsContainer.classList.add(ON_TOP_CENTERED_CSS);

  try {
    const db = getFirestore(app);
    const scoresRef = collection(db, "scores");

    await addDoc(collection(db, "scores"), {
      name: state.user,
      score: state.score,
    });

    const response = await getDocs(
      query(scoresRef, orderBy("score", "desc"), limit(10))
    );

    const data = response.docs
      .map((v) => ({
        name: v.get("name"),
        score: v.get("score"),
      }))
      .sort((a, b) => b.score - a.score);

    data.map((v, i) => {
      const item = document.createElement("li");

      item.classList.add("list__item");
      item.innerHTML = `${i + 1} ${v.name} - ${v.score}`;
      resultsList.appendChild(item);
    });
  } catch (err) {
    console.error(err);
  }
};
