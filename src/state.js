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
  canvasDimensions: { width: 1280, height: 720 },
  get oneStep() {
    return canvas.width / this.speed;
  },
  foodCoords: { x: 0, y: 0 },
  orientation: ORIENTATION.HORIZONTAL,
  direction: DIRECTIONS.RIGHT,
  score: 0,
  isRunning: false,
  fillStyle: "#ccc",
  user: "",
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
  "Ciekawe czy składak pojedzie z nami?",
  "Fajny rower na tym olx'ie, ale części nie ma do niego.",
  "Adam, awariaaa!!!",
  "Znowu odkurzanie... Od tego jest firma sprzątająca!",
  "Znowu ten Bernardzik dzwoni...",
  "Trinken, pausen, ficken machen!",
  "I cyk godzinki do zeszytu, będzie na Niemcy!",
  "Ta bomba to niech spadnie na solną.",
  "Jest i nasza megagwiazda...",
  "Dziadek, jak tam piesek?",
  "Horacy to nawet muchę przepierdoli!",
  "Mintaj to ma sprany beret od mamre.",
  "Tylko Marek może jeździć rowerem.",
  "Ale dziadostwo tu tego nazwozil.",
  "Ta bomba to by mogła jebnac ale na solna.",
  "500 zł za odcinek to nie jest mało pieniędzy.",
  "Ukraińcy wszystko mają za darmo.",
  "Krzysiek jak pójdziesz na mamre to nie będę się do ciebie odzywał.",
  "Bonanze ściągnąłem 600 odcinków. Tam gra Michael Landon.",
  "Dziewczyna to powinna mieć taką sylwetkę jak Natalia.",
  "Zaś fotowoltanika do mnie dzwoni.",
  "Krzysiu ja wiem że ona ci sie marzy.",
  "To wytrzaskaj ją na reklamie!",
  "Na mamre zrobiło mi się ciemno przed oczami, a potem tańczyłem razem z nimi.",
  "Jak nie ma Zenka to ja tu rządzę.",
  "Krysia, chodź na bajerę!",
  "Horacy brał 200zl za paliwo a jeszcze musiałem iść na solną.",
  "A ja dzisiaj będę rower czyścił, ze 2 godziny mi zejdzie ale będzie porządnie.",
  "A blacha zaś wisi na telefonie...",
  "Jontek to jest taki polny zapierdalacz.",
  "A mi to się marzy taka kolekcja starych motorowerów...",
  "O, to spiewa Piotr Fronczewski, pamiętasz Jontek, Bruce Lee karate Mistrz, oj to były czasy.",
  "Ja to żem kręciił bączki tym wózkiem, dziewczyny piszczały, na centymetry...",
];

export const setState = (state = {}, updatedStatePartial) => {
  const noChanges = Object.keys(updatedStatePartial).every(
    (key) => updatedStatePartial[key] === state[key]
  );
  if (noChanges) return;

  Object.assign(state, updatedStatePartial);
};
