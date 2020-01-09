const SHOWING_FILMS_COUNT_ON_START = 5;
const SHOWING_FILMS_COUNT_BY_BUTTON = 5;

import ShowMoreComponent from "../components/show-more";
import FilmExtraListComponent from "../components/film-extra-list";
import NoFilmsComponent from "../components/no-films";
import FilterComponent from "../components/filter";
import FilmListComponent from "../components/film-list";
import {render, Position} from "../utils";
import {films, filmsRated, filmsCommented} from "../data";
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

    this._films = films.slice();
    this._showMoreComponent = new ShowMoreComponent();
    this._noFilmsComponent = new NoFilmsComponent();
    this._filterComponent = new FilterComponent();
    this._filmListComponent = new FilmListComponent();

    this._showedMovieControllers = [];
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

  render() {
    const container = this._container;
    const filmsData = this._moviesModel.getFilms();
    let showingFilmsCount = SHOWING_FILMS_COUNT_ON_START;

    if (filmsData.length === 0) {
      render(container, this._noFilmsComponent.getElement(), Position.BEFOREEND);
    } else {
      render(container, this._filterComponent.getElement(), Position.BEFOREEND);
      render(container, this._filmListComponent.getElement(), Position.BEFOREEND);

      const filmsList = document.querySelector(`.films-list`);
      const filmListContainer = document.querySelector(`.films-list__container`);

      const filterButtons = this._filterComponent.getElement().querySelectorAll(`.sort__button`);

      const activeFilter = (filter) => {
        Array.from(filterButtons).filter((button) => {
          return button.dataset.sortType === filter;
        })[0].classList.add(`sort__button--active`);
      };

      this._filterComponent.setSortTypeChangeHandler((sortType) => {
        filterButtons.forEach((button) => {
          button.classList.remove(`sort__button--active`);
        });

        switch (sortType) {
          case `date`:
            filmsData = this._films.slice().sort((a, b) => new Date(a.year) - new Date(b.year));
            activeFilter(`date`);
            break;
          case `rating`:
            filmsData = this._films.slice().sort((a, b) => b.rating - a.rating);
            activeFilter(`rating`);
            break;
          case `default`:
            filmsData = this._films.slice();
            activeFilter(`default`);
            break;
        }

        filmListContainer.innerHTML = null;
        const newFilms = renderFilms(filmsData.slice(0, showingFilmsCount), filmListContainer, this._onDataChange, this._onViewChange);
        this._showedMovieControllers = this._showedMovieControllers.concat(newFilms);
      });

      const newFilms = renderFilms(filmsData.slice(0, showingFilmsCount), filmListContainer, this._onDataChange, this._onViewChange);
      this._showedMovieControllers = this._showedMovieControllers.concat(newFilms);

      if (filmsData.length > SHOWING_FILMS_COUNT_ON_START) {
        render(filmsList, this._showMoreComponent.getElement(), Position.BEFOREEND);
      }

      const filmsContainer = document.querySelector(`.films`);

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

    this._showMoreComponent.setClickHandler(() => {
      const prevTasksCount = showingFilmsCount;
      showingFilmsCount = showingFilmsCount + SHOWING_FILMS_COUNT_BY_BUTTON;
      const filmListContainer = document.querySelector(`.films-list__container`);

      const newFilms = renderFilms(filmsData.slice(prevTasksCount, showingFilmsCount), filmListContainer, this._onDataChange, this._onViewChange);
      this._showedMovieControllers = this._showedMovieControllers.concat(newFilms);


      if (showingFilmsCount >= filmsData.length) {
        this._showMoreComponent.getElement().remove();
      }
    });
  }
}
