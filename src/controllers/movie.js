import FilmComponent from "../components/film";
import FilmPopupComponent from "../components/film-details";
import {render, Position} from "../utils";

export default class MovieController {
  constructor(container, onDataChange) {
    this._container = container;
    this._onDataChange = onDataChange;

    this._filmComponent = null;
    this._filmEditComponent = null;
    this._siteMainElement = document.querySelector(`.main`);
    this._onEscKeyDown = this._onEscKeyDown.bind();
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      this._siteMainElement.removeChild(this._filmPopupComponent.getElement());
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }

  _showPopup() {
    render(this._siteMainElement, this._filmPopupComponent.getElement(), Position.BEFOREEND);
  }

  render(film) {
    this._filmComponent = new FilmComponent(film);
    this._filmPopupComponent = new FilmPopupComponent(film);

    this._filmComponent.setTitleClickHandler(() => {
      this._showPopup();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._filmComponent.setPosterClickHandler(() => {
      this._showPopup();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._filmComponent.setCommentsClickHandler(() => {
      this._showPopup();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._filmPopupComponent.setCloseClickHandler(() => {
      this._siteMainElement.removeChild(this._filmPopupComponent.getElement());
    });

    this._filmComponent.setWatchlistClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(this, film, Object.assign({}, film, {
        watchlist: !film.watchlist
      }));
    });

    this._filmComponent.setWatchedClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(this, film, Object.assign({}, film, {
        watched: !film.watched
      }));
    });

    this._filmComponent.setFavoriteClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(this, film, Object.assign({}, film, {
        favorite: !film.favorite
      }));
    });

    this._filmPopupComponent.setWatchlistClickHandler(() => {
      this._onDataChange(this, film, Object.assign({}, film, {
        watchlist: !film.watchlist
      }));
    });

    this._filmPopupComponent.setWatchedClickHandler(() => {
      this._onDataChange(this, film, Object.assign({}, film, {
        watched: !film.watched
      }));
    });

    this._filmPopupComponent.setFavoriteClickHandler(() => {
      this._onDataChange(this, film, Object.assign({}, film, {
        favorite: !film.favorite
      }));
    });

    render(this._container, this._filmComponent.getElement(), Position.BEFOREEND);
  }
}
