import AbstractComponent from "./abstract-component";

const Rating = {
  NOVICE: `Novice`,
  FUN: `Fun`,
  MOVIE_BUFF: `Movie Buff`
};

export const defineUserRating = (filmsAmount) => {
  let rating = ``;
  if (filmsAmount > 0 && filmsAmount <= 10) {
    rating = Rating.NOVICE;
  }

  if (filmsAmount > 10 && filmsAmount <= 20) {
    rating = Rating.FUN;
  }

  if (filmsAmount > 20) {
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
