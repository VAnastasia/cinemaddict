import AbstractComponent from "./abstract-component";

const MIDDLE_AMOUNT_FILMS = 10;
const HIGH_AMOUNT_FILMS = 20;

const Rating = {
  NOVICE: `Novice`,
  FUN: `Fun`,
  MOVIE_BUFF: `Movie Buff`
};

export const defineUserRating = (filmsAmount) => {
  let rating = ``;
  if (filmsAmount > 0 && filmsAmount <= MIDDLE_AMOUNT_FILMS) {
    rating = Rating.NOVICE;
  }

  if (filmsAmount > 10 && filmsAmount <= HIGH_AMOUNT_FILMS) {
    rating = Rating.FUN;
  }

  if (filmsAmount > HIGH_AMOUNT_FILMS) {
    rating = Rating.MOVIE_BUFF;
  }
  return rating;
};

const createProfileTemplate = (films) => {
  const filmsWatchedAmount = films.filter((film) => film.watched).length;
  return `<section class="header__profile profile">
    <p class="profile__rating">${defineUserRating(filmsWatchedAmount)}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;
};

export default class ProfileComponent extends AbstractComponent {
  constructor(films) {
    super();
    this._films = films;
  }

  getTemplate() {
    return createProfileTemplate(this._films);
  }
}
