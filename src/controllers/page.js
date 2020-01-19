const SHOWING_FILMS_COUNT_ON_START = 5;
const SHOWING_FILMS_COUNT_BY_BUTTON = 5;

import ShowMoreComponent from "../components/show-more";
import FilmExtraListComponent from "../components/film-extra-list";
import NoFilmsComponent from "../components/no-films";
import SortComponent from "../components/sort";
import FilmListComponent from "../components/film-list";
import {render, Position} from "../utils";
// import {filmsRated, filmsCommented} from "../data";
import MovieController from "./movie";

const renderFilms = (movies, listFilms, onDataChange, onViewChange) => {
  return movies.map((movie) => {
    const movieController = new MovieController(listFilms, onDataChange, onViewChange);
    movieController.render(movie);

    return movieController;
  });
};

export default class PageController {
  constructor(container, moviesModel) {
    this._container = container;
    this._moviesModel = moviesModel;

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._films = [];
    this._showMoreComponent = new ShowMoreComponent();
    this._noFilmsComponent = new NoFilmsComponent();
    this._sortComponent = new SortComponent();
    this._filmListComponent = new FilmListComponent();

    this._showedMovieControllers = [];
    this._showingFilmsCount = SHOWING_FILMS_COUNT_ON_START;
    this._moviesModel.setFilterChangeHandler(this._onFilterChange);
  }

  _onDataChange(movieController, oldData, newData) {
    const index = this._films.findIndex((it) => it === oldData);

    if (index === -1) {
      return;
    }

    this._films = [].concat(this._films.slice(0, index), newData, this._films.slice(index + 1));

    movieController.render(this._films[index]);
  }

  _onViewChange() {
    this._showedMovieControllers.forEach((it) => it.setDefaultView());
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

  _renderFilms(filmsArray) {
    const filmListContainer = document.querySelector(`.films-list__container`);

    const newFilms = renderFilms(filmsArray.slice(0, this._showingFilmsCount), filmListContainer, this._onDataChange, this._onViewChange);

    this._showedMovieControllers = this._showedMovieControllers.concat(newFilms);
    this._renderShowMoreButton();
  }

  _renderExtraLists() {
    const filmsContainer = document.querySelector(`.films`);
    const filmsRated = this._films
      .slice()
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 2);

    const filmsCommented = this._films
      .slice()
      .sort((a, b) => b.commentsAmount - a.commentsAmount)
      .slice(0, 2);

    render(filmsContainer, new FilmExtraListComponent(`Top rated`).getElement(), Position.BEFOREEND);
    render(filmsContainer, new FilmExtraListComponent(`Most commented`).getElement(), Position.BEFOREEND);

    const filmsExtraElements = document.querySelectorAll(
        `.films-list--extra .films-list__container`
    );

    const rateFilms = renderFilms(filmsRated, filmsExtraElements[0], this._onDataChange, this._onViewChange);
    this._showedMovieControllers = this._showedMovieControllers.concat(rateFilms);

    const commentFilms = renderFilms(filmsCommented, filmsExtraElements[1], this._onDataChange, this._onViewChange);
    this._showedMovieControllers = this._showedMovieControllers.concat(commentFilms);
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

        let filmsData = this._moviesModel.getFilms();

        switch (sortType) {
          case `date`:
            filmsData = this._films.slice().sort((a, b) => new Date(b.year) - new Date(a.year));
            activeSort(`date`);
            break;
          case `rating`:
            filmsData = this._films.slice().sort((a, b) => b.rating - a.rating);
            activeSort(`rating`);
            break;
          case `default`:
            filmsData = this._films.slice();
            activeSort(`default`);
            break;
        }

        this._removeFilms();
        this._removeExtraLists();
        this._renderFilms(filmsData);
        this._renderExtraLists();
      });

      this._renderFilms(this._films);
      this._renderExtraLists();
    }
  }
}
