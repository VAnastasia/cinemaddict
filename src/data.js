import {formatDate, formatRuntime} from "./utils";

const FILMS_AMOUNT = 25;

const TITLES_FILMS = [
  `Snow Cake`,
  `Goodnight, Mister Tom`,
  `The Aftermath`,
  `Instant Family`,
  `The Professor`,
  `Us`,
  `Otherhood`,
  `Anywhere But Here`,
  `The Devil Wears Prada`,
  `Dog Day Afternoon`,
  `Glass`,
  `The Great Race`,
  `Booksmart`,
  `John Wick`,
  `Eat Pray Love`
];

const POSTERS = [
  `made-for-each-other.png`,
  `popeye-meets-sinbad.png`,
  `sagebrush-trail.jpg`,
  `santa-claus-conquers-the-martians.jpg`,
  `the-dance-of-life.jpg`,
  `the-great-flamarion.jpg`,
  `the-man-with-the-golden-arm.jpg`
];

const DESCRIPTIONS = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  `Cras aliquet varius magna, non porta ligula feugiat eget.`,
  `Fusce tristique felis at fermentum pharetra.`,
  `Aliquam id orci ut lectus varius viverra.`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
  `Sed sed nisi sed augue convallis suscipit in sed felis.`,
  `Aliquam erat volutpat.`,
  `Nunc fermentum tortor ac porta dapibus.`,
  `In rutrum ac purus sit amet tempus.`
];

const GENRES = [`Musical`, `Western`, `Drama`, `Comedy`, `Cartoon`, `Mystery`];

const AGE_CATEGORIES = [`0+`, `6+`, `12+`, `16+`, `18+`];

const NAMES = [
  `Quentin Tarantino`,
  `Steven Spielberg`,
  `Martin Scorsese`,
  `James Cameron`,
  `Tim Burton`,
  `Sofia Coppola`,
  `Ridley Scott`,
  `J. J. Abrams`
];

const COUNTRIES = [`USA`, `United Kingdom`, `France`, `Canada`, `Spain`];

const shuffleArray = (array) => {
  let j;
  let temp;
  for (let i = array.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    temp = array[j];
    array[j] = array[i];
    array[i] = temp;
  }
  return array;
};

const getDescription = (array) =>
  shuffleArray(array)
    .slice(0, Math.ceil(Math.random() * 3))
    .join(``);

const getRandomItemArray = (array) =>
  array[Math.floor(Math.random() * array.length)];

const getRandonNumber = (min, max) =>
  Math.floor(Math.random() * (max - min)) + min;

const getFilm = () => ({
  title: getRandomItemArray(TITLES_FILMS),
  description: getDescription(DESCRIPTIONS),
  director: getRandomItemArray(NAMES),
  writers: getRandomItemArray(NAMES),
  actors: getRandomItemArray(NAMES),
  poster: getRandomItemArray(POSTERS),
  genres: getRandomItemArray(GENRES),
  rating: getRandonNumber(0, 9).toFixed(1),
  comments: getRandonNumber(0, 20),
  year: formatDate(getRandonNumber(0, Date.now())),
  age: getRandomItemArray(AGE_CATEGORIES),
  runtime: formatRuntime(getRandonNumber(20, 180)),
  country: getRandomItemArray(COUNTRIES),
  watchlist: Math.round(Math.random()),
  watched: Math.round(Math.random()),
  favorite: Math.round(Math.random())
});

const getFilmList = (count) => new Array(count).fill().map(getFilm);

export const films = getFilmList(FILMS_AMOUNT);

export const groupedFilms = films.reduce(
    ({watchlist, watched, favorite}, film) => {
      watchlist += film.watchlist;
      watched += film.watched;
      favorite += film.favorite;

      return {
        watchlist,
        watched,
        favorite
      };
    },
    {watchlist: 0, watched: 0, favorite: 0}
);

export const filmsAll = films.slice();

export const filmsRated = films
  .slice()
  .sort((a, b) => (a.rating < b.rating ? 1 : -1))
  .slice(0, 2);

export const filmsCommented = films
  .slice()
  .sort((a, b) => (a.comments < b.comments ? 1 : -1))
  .slice(0, 2);
