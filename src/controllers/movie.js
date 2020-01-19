import FilmComponent from "../components/film";
import FilmPopupComponent from "../components/film-details";
import {render, unrender, replace, remove, Position} from "../utils";
import MovieModel from "../models/movie";

const Mode = {
  DEFAULT: `default`,
  POPUP: `popup`
};

export default class MovieController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._mode = Mode.DEFAULT;

    this._filmComponent = null;
    this._filmPopupComponent = null;
    this._siteMainElement = document.querySelector(`.main`);
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      this._siteMainElement.removeChild(this._filmPopupComponent.getElement());
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }

  _showPopup() {
    this._onViewChange();
    this._mode = Mode.POPUP;
    render(this._siteMainElement, this._filmPopupComponent.getElement(), Position.BEFOREEND);
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      // console.log(this._filmPopupComponent.getElement());
      unrender(this._filmPopupComponent.getElement());
      this._mode = Mode.DEFAULT;
    }
  }

  destroy() {
    remove(this._filmPopupComponent);
    remove(this._filmComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  render(film, mode = Mode.DEFAULT) {
    const oldFilmComponent = this._filmComponent;
    const oldFilmPopupComponent = this._filmPopupComponent;
    this._mode = mode;

    // console.log(film);

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
      unrender(this._filmPopupComponent.getElement());
    });

    this._filmComponent.setWatchlistClickHandler((evt) => {
      evt.preventDefault();
      const newFilm = MovieModel.clone(film);
      newFilm.watchlist = !newFilm.watchlist;
      this._onDataChange(this, film, newFilm);
    });

    this._filmComponent.setWatchedClickHandler((evt) => {
      evt.preventDefault();
      const newFilm = MovieModel.clone(film);
      newFilm.watched = !newFilm.watched;

      if (!newFilm.watched) {
        newFilm.personalRating = 0;
      }
      newFilm.watchedDate = newFilm.watchedDate ? new Date().toISOString() : null;

      this._onDataChange(this, film, newFilm);
    });

    this._filmComponent.setFavoriteClickHandler((evt) => {
      evt.preventDefault();
      const newFilm = MovieModel.clone(film);
      newFilm.favorite = !newFilm.favorite;
      this._onDataChange(this, film, newFilm);

    });

    this._filmPopupComponent.setWatchlistClickHandler(() => {
      const newFilm = MovieModel.clone(film);
      newFilm.watchlist = !newFilm.watchlist;
      this._onDataChange(this, film, newFilm);
    });

    this._filmPopupComponent.setWatchedClickHandler(() => {
      const newFilm = MovieModel.clone(film);
      newFilm.watched = !newFilm.watched;

      if (!newFilm.watched) {
        newFilm.personalRating = 0;
      }
      newFilm.watchedDate = newFilm.watchedDate ? new Date().toISOString() : null;

      this._onDataChange(this, film, newFilm);
    });

    this._filmPopupComponent.setFavoriteClickHandler(() => {
      const newFilm = MovieModel.clone(film);
      newFilm.favorite = !newFilm.favorite;
      this._onDataChange(this, film, newFilm);
    });

    switch (mode) {
      case Mode.DEFAULT:
        if (oldFilmPopupComponent && oldFilmComponent) {
          replace(this._filmComponent, oldFilmComponent);
          replace(this._filmPopupComponent, oldFilmPopupComponent);
        } else {
          render(this._container, this._filmComponent.getElement(), Position.BEFOREEND);

        }
        break;
      case Mode.POPUP:
        if (oldFilmPopupComponent && oldFilmComponent) {
          remove(oldFilmComponent);
          remove(oldFilmPopupComponent);
        }
        document.addEventListener(`keydown`, this._onEscKeyDown);
        render(this._container, this._taskFilmPopupComponent.getElement(), Position.BEFOREEND);
    }
  }
}
