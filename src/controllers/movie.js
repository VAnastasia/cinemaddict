import FilmComponent from "../components/film";
import FilmPopupComponent from "../components/film-details";
import CommentsComponent from "../components/comments";
import {render, unrender, replace, remove, Position} from "../utils";
import MovieModel from "../models/movie";
import {moviesModel} from "../models/movies";

// import {api} from "../api";

const Mode = {
  DEFAULT: `default`,
  POPUP: `popup`
};

export default class MovieController {
  constructor(container, onDataChange, onViewChange, api) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._api = api;

    this._mode = Mode.DEFAULT;

    this._filmComponent = null;
    this._filmPopupComponent = null;
    this._siteMainElement = document.querySelector(`.main`);
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._commentsComponent = null;
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      this._mode = Mode.DEFAULT;
      this._siteMainElement.removeChild(this._filmPopupComponent.getElement());
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }

  _showPopup() {
    this._onViewChange();
    this._mode = Mode.POPUP;
    render(this._siteMainElement, this._filmPopupComponent.getElement(), Position.BEFOREEND);
  }

  _renderComments(film) {
    this._api.getComment(film.id)
    // .then((comments) => moviesModel.setCommentsFilm(comments, film.id));
    .then((comments) => {
      if (this._commentsComponent) {
        this._commentsComponent.getElement().remove();
      }

      this._commentsComponent = new CommentsComponent(comments);
      render(this._filmPopupComponent.getElement().querySelector(`.form-details__bottom-container`), this._commentsComponent.getElement(), Position.BEFOREEND);
    });
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
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
    // this._renderComments(film);

    const oldFilmComponent = this._filmComponent;
    const oldFilmPopupComponent = this._filmPopupComponent;
    this._mode = mode;

    this._filmComponent = new FilmComponent(film);
    this._filmPopupComponent = new FilmPopupComponent(film);

    this._filmComponent.setTitleClickHandler(() => {
      this._showPopup();
      this._renderComments(film);
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._filmComponent.setPosterClickHandler(() => {
      this._showPopup();
      this._renderComments(film);
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._filmComponent.setCommentsClickHandler(() => {
      this._showPopup();
      this._renderComments(film);
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
      this._renderComments(film);
    });

    this._filmPopupComponent.setWatchedClickHandler(() => {
      const newFilm = MovieModel.clone(film);
      newFilm.watched = !newFilm.watched;

      if (!newFilm.watched) {
        newFilm.personalRating = 0;
      }
      newFilm.watchedDate = newFilm.watchedDate ? new Date().toISOString() : null;

      this._onDataChange(this, film, newFilm);
      this._renderComments(film);
    });

    this._filmPopupComponent.setFavoriteClickHandler(() => {
      const newFilm = MovieModel.clone(film);
      newFilm.favorite = !newFilm.favorite;
      this._onDataChange(this, film, newFilm);
      this._renderComments(film);
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
          // remove(oldFilmComponent);
          // remove(oldFilmPopupComponent);
          replace(this._filmComponent, oldFilmComponent);
          replace(this._filmPopupComponent, oldFilmPopupComponent);
          // this._renderComments(film);
        }

        document.addEventListener(`keydown`, this._onEscKeyDown);
        render(this._container, this._taskFilmPopupComponent.getElement(), Position.BEFOREEND);
    }
  }
}
