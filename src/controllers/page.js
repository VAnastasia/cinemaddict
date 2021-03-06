import ShowMore from "../components/show-more";
import FilmExtraList from "../components/film-extra-list";
import NoFilms from "../components/no-films";
import Sort from "../components/sort";
import FilmList from "../components/film-list";
import {render, Position} from "../utils";
import MovieController from "./movie";
import {api} from "../api";

const SHOWING_FILMS_COUNT_ON_START = 5;
const SHOWING_FILMS_COUNT_BY_BUTTON = 5;
const HIDDEN_CLASS = `visually-hidden`;

const renderFilms = (movies, listFilms, onDataChange, onViewChange) => {
  return movies.map((movie) => {
    const movieController = new MovieController(listFilms, onDataChange, onViewChange, api);
    movieController.render(movie);

    return movieController;
  });
};

export default class PageController {
  constructor(container, moviesModel, apiParam) {
    this._container = container;
    this._moviesModel = moviesModel;
    this._api = apiParam;

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._films = [];
    this._showMoreComponent = new ShowMore();
    this._noFilmsComponent = new NoFilms();
    this._sortComponent = new Sort();
    this._filmListComponent = new FilmList();

    this._showedMovieControllers = [];
    this._showingFilmsCount = SHOWING_FILMS_COUNT_ON_START;
    this._moviesModel.setFilterChangeHandler(this._onFilterChange);
  }

  show() {
    if (this._filmListComponent && this._sortComponent) {
      this._filmListComponent.getElement().classList.remove(HIDDEN_CLASS);
      this._sortComponent.getElement().classList.remove(HIDDEN_CLASS);
    }
  }

  hide() {
    if (this._filmListComponent && this._sortComponent) {
      this._filmListComponent.getElement().classList.add(HIDDEN_CLASS);
      this._sortComponent.getElement().classList.add(HIDDEN_CLASS);
    }
  }

  render() {
    const container = this._container;
    this._films = this._moviesModel.getFilms();

    if (this._films.length === 0) {
      render(container, this._noFilmsComponent.getElement(), Position.BEFOREEND);
    } else {
      render(container, this._sortComponent.getElement(), Position.BEFOREEND);
      render(container, this._filmListComponent.getElement(), Position.BEFOREEND);

      const sortButtons = this._sortComponent.getElement().querySelectorAll(`.sort__button`);

      const activeSort = (sort) => {
        Array.from(sortButtons).filter((button) => {
          return button.dataset.sortType === sort;
        })[0].classList.add(`sort__button--active`);
      };

      this._sortComponent.setSortTypeChangeHandler((sortType) => {
        sortButtons.forEach((button) => {
          button.classList.remove(`sort__button--active`);
        });

        const filmsData = this._moviesModel.getFilms();

        switch (sortType) {
          case `date`:
            this._films = filmsData.slice().sort((a, b) => new Date(b.year) - new Date(a.year));
            activeSort(`date`);
            break;
          case `rating`:
            this._films = filmsData.slice().sort((a, b) => b.rating - a.rating);
            activeSort(`rating`);
            break;
          case `default`:
            this._films = filmsData.slice();
            activeSort(`default`);
            break;
        }

        this._removeFilms();
        this._removeExtraLists();
        this._renderFilms(this._films);
        this._renderExtraLists();
      });

      this._renderFilms(this._films);
      this._renderExtraLists();
    }
  }

  _removeFilms() {
    const filmListElement = this._filmListComponent.getElement().querySelector(`.films-list__container`);
    filmListElement.innerHTML = ``;
    this._showedMovieControllers.forEach((movieController) => movieController.destroy());
    this._showedMovieControllers = [];
  }

  _removeExtraLists() {
    const filmsExtraElements = document.querySelectorAll(
        `.films-list--extra`
    );

    filmsExtraElements.forEach((el) => {
      el.remove();
    });
  }

  _renderFilms(films) {
    const filmListContainer = document.querySelector(`.films-list__container`);

    const newFilms = renderFilms(films.slice(0, this._showingFilmsCount), filmListContainer, this._onDataChange, this._onViewChange);

    this._showedMovieControllers = this._showedMovieControllers.concat(newFilms);
    this._renderShowMoreButton();
  }

  _renderExtraLists() {
    const filmsContainer = document.querySelector(`.films`);
    this._api.getFilms().then((films) => {
      const filmsRated = films
      .slice()
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 2);

      const filmsCommented = films
        .slice()
        .sort((a, b) => b.commentsAmount - a.commentsAmount)
        .slice(0, 2);

      render(filmsContainer, new FilmExtraList(`Top rated`).getElement(), Position.BEFOREEND);
      render(filmsContainer, new FilmExtraList(`Most commented`).getElement(), Position.BEFOREEND);

      const filmsExtraElements = document.querySelectorAll(
          `.films-list--extra .films-list__container`
      );

      const rateFilms = renderFilms(filmsRated, filmsExtraElements[0], this._onDataChange, this._onViewChange);
      this._showedMovieControllers = this._showedMovieControllers.concat(rateFilms);

      const commentFilms = renderFilms(filmsCommented, filmsExtraElements[1], this._onDataChange, this._onViewChange);
      this._showedMovieControllers = this._showedMovieControllers.concat(commentFilms);
    });
  }

  _rerenderExtraLists() {
    this._removeExtraLists();
    this._renderExtraLists();
  }

  _renderShowMoreButton() {
    this._showMoreComponent.getElement().remove();
    this._showMoreComponent.removeElement();

    if (this._showingFilmsCount >= this._films.length) {
      return;
    }

    const filmsList = document.querySelector(`.films-list`);

    render(filmsList, this._showMoreComponent.getElement(), Position.BEFOREEND);
    this._showMoreComponent.setClickHandler(() => this._onShowMoreClick());
  }

  _onFilterChange() {
    this._removeFilms();
    this._removeExtraLists();

    this._films = this._moviesModel.getFilms();

    this._renderFilms(this._films);
    this._renderExtraLists();
    this._renderShowMoreButton();
  }

  _onShowMoreClick() {
    const prevFilmsCount = this._showingFilmsCount;
    this._showingFilmsCount = this._showingFilmsCount + SHOWING_FILMS_COUNT_BY_BUTTON;

    this._renderFilms(this._films.slice(prevFilmsCount, this._showingFilmsCount));

    if (this._showingFilmsCount >= this._films.length) {
      this._showMoreComponent.getElement().remove();
      this._showMoreComponent.removeElement();
    }
  }

  _onDataChange(movieController, oldData, newData, mode = `default`) {

    if (mode === `default` || mode === `popup`) {
      this._api.updateFilm(oldData.id, newData)
        .then((movieModel) => {
          const isSuccess = this._moviesModel.updateFilm(oldData.id, newData);

          if (isSuccess) {
            movieController.render(movieModel);
            this._rerenderExtraLists();
          }

          this._renderShowMoreButton();

        }).catch(() => {
          movieController.shakeRating();
        });
    } else if (mode === `deleteComment`) {
      this._api.deleteComment(newData)
      .then(() => {
        movieController.render(oldData);
        this._rerenderExtraLists();
      });
    } else {
      this._api.createComment(oldData.id, newData)
      .then(() => {
        movieController.render(oldData);
        this._rerenderExtraLists();
      })
      .catch(() => {
        movieController.shakeComments();
      });
    }
  }

  _onViewChange() {
    this._showedMovieControllers.forEach((controller) => controller.setDefaultView());
  }
}
