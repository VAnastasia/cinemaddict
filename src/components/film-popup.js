import AbstractSmartComponent from "./abstract-smart-component";
import {formatRuntime} from "../utils";
import moment from "moment";
import debounce from 'lodash/debounce';

const DEBOUNCE_TIMEOUT = 500;

const createRatingMarkup = (rating) => {
  const rates = [];
  let i = 1;
  while (i < 10) {
    rates.push(i);
    i++;
  }
  return rates.map((index) => {
    return `<input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="${index}" id="rating-${index}" ${rating === index ? `checked` : ``}>
    <label class="film-details__user-rating-label" for="rating-${index}">${index}</label>`;
  }).join(``);
};

const createFilmPopupTemplate = ({
  title,
  alterTitle,
  description,
  rating,
  year,
  poster,
  runtime,
  genres,
  age,
  director,
  actors,
  writers,
  country,
  personalRating,
  watchlist,
  watched,
  favorite
}) => {
  return `<section class="film-details">
  <form class="film-details__inner" action="" method="get">
    <div class="form-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="./${poster}" alt="">

          <p class="film-details__age">${age}+</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${title}</h3>
              <p class="film-details__title-original">${alterTitle}</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${rating.toFixed(1)}</p>
              ${watched ?
    `<p class="film-details__user-rating">Your rate ${personalRating}</p>` : ``}

            </div>
          </div>

          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${director}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${writers}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${actors}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${moment(year).format(`DD MMMM YYYY`)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${formatRuntime(runtime)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${country}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">${genres.length > 1 ? `Genres` : `Genre`}</td>
              <td class="film-details__cell">
                <span class="film-details__genre">${genres}</span>
              </td>
            </tr>
          </table>

          <p class="film-details__film-description">
            ${description}
          </p>
        </div>
      </div>

      <section class="film-details__controls">
        <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${
  watchlist ? `checked` : ``
}>
        <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

        <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${
  watched ? `checked` : ``
}>
        <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

        <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${
  favorite ? `checked` : ``
}>
        <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
      </section>
    </div>

    ${watched ?
    `<div class="form-details__middle-container">
        <section class="film-details__user-rating-wrap">
          <div class="film-details__user-rating-controls">
            <button class="film-details__watched-reset" type="button">Undo</button>
          </div>

          <div class="film-details__user-score">
            <div class="film-details__user-rating-poster">
              <img src="./${poster}" alt="${poster}" class="film-details__user-rating-img">
            </div>

            <section class="film-details__user-rating-inner">
              <h3 class="film-details__user-rating-title">${title}</h3>

              <p class="film-details__user-rating-feelings">How you feel it?</p>

              <div class="film-details__user-rating-score">
              ${createRatingMarkup(personalRating)}
              </div>
            </section>
          </div>
        </section>
      </div>`
    : ``}

    <div class="form-details__bottom-container">

    </div>
  </form>
</section>`;
};

export default class FilmPopup extends AbstractSmartComponent {
  constructor(film) {
    super();
    this._film = film;
  }

  recoveryListeners() {}

  rerender() {
    super.rerender();
  }

  getTemplate() {
    return createFilmPopupTemplate(this._film);
  }

  setCloseClickHandler(handler) {
    this.getElement().querySelector(`.film-details__close-btn`)
     .addEventListener(`click`, handler);
  }

  setWatchlistClickHandler(handler) {
    this.getElement().querySelector(`input[name="watchlist"]`)
    .addEventListener(`change`, debounce(handler, DEBOUNCE_TIMEOUT));
  }

  setWatchedClickHandler(handler) {
    this.getElement().querySelector(`input[name="watched"]`)
    .addEventListener(`change`, debounce(handler, DEBOUNCE_TIMEOUT));
  }

  setFavoriteClickHandler(handler) {
    this.getElement().querySelector(`input[name="favorite"]`)
    .addEventListener(`change`, debounce(handler, DEBOUNCE_TIMEOUT));
  }

  setUndoButtomClickHandler(handler) {
    if (this.getElement().querySelector(`.film-details__watched-reset`)) {
      this.getElement().querySelector(`.film-details__watched-reset`)
        .addEventListener(`click`, handler);
    }
  }

  setPersonalRating(handler) {
    if (this.getElement().querySelector(`.film-details__user-rating-score`)) {
      this.getElement().querySelector(`.film-details__user-rating-score`)
        .addEventListener(`change`, (handler));
    }
  }
}
