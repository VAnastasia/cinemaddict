import {films} from "../data";
import {createElement} from "../utils";

const Rating = {
  NOVICE: `Novice`,
  FUN: `Fun`,
  MOVIE_BUFF: `Movie Buff`
};

const defineUserRating = (filmsAmount) => {
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

const createProfileTemplate = () => {
  return `<section class="header__profile profile">
    <p class="profile__rating">${defineUserRating(
      films.filter((film) => film.watched).length
  )}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;
};

export default class ProfileComponent {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createProfileTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
