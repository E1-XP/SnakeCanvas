export const ORIENTATION = {
  HORIZONTAL: "HORIZONTAL",
  VERTICAL: "VERTICAL",
};

export const DIRECTIONS = {
  UP: "UP",
  DOWN: "DOWN",
  LEFT: "LEFT",
  RIGHT: "RIGHT",
};

export const state = {
  snake: [
    {
      x: canvas.width / 2,
      y: canvas.height / 2,
      direction: DIRECTIONS.RIGHT,
    },
  ],
  size: 60,
  speed: 300,
  get oneStep() {
    return canvas.width / this.speed;
  },
  foodCoords: { x: 0, y: 0 },
  orientation: ORIENTATION.HORIZONTAL,
  direction: DIRECTIONS.RIGHT,
  score: 0,
  finished: false,
  fillStyle: "#ccc",
};

export const jokes = [
  "To czas na bajerę!",
  "Krzysiek, gulnij sobie!",
  "Uwaga nadciąga Zenek!",
  "Aśkaaaaaaaaa!",
  "Panie Maaarek, Panie Maaarek!",
  "Bastek, dajesz rady?",
  "Szkiełko, jak tam koty?",
  "Ja to bym podziubał, ale Princess!",
  "Padajmy wszyscy na kolana bo księżniczka idzie!",
  "Ciekawe co robi Michaś?",
  "Masz tam jakieś paczki?",
  "Horacy, wypierdalaj na serwis!",
  "Jak to co, dobre wrażenie!",
  "Nie będę pił, obiecałem Horacemu.",
  "Naaa spoookojnieeeee!",
  "A ja wybieram Princess!!",
  "Oho, idzie buuuchaaaj!",
  "Ciekawe co tam u Freda?",
  "Ciekawe czy składak pojedzie z nami",
  "Fajny rower na tym olx'ie, ale części nie ma do niego.",
  "Adam, awariaaa!!!",
  "Znowu odkurzanie... Od tego jest firma sprzątająca!",
  "Znowu ten Bernardzik dzwoni...",
  "Trinken, pausen, ficken machen!",
  "I cyk godzinki do zeszytu, będzie na Niemcy!",
];

export const setState = (state = {}, updatedStatePartial) => {
  const noChanges = Object.keys(updatedStatePartial).every(
    (key) => updatedStatePartial[key] === state[key]
  );
  if (noChanges) return;

  Object.assign(state, updatedStatePartial);
};
