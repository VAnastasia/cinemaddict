const SHOWING_FILMS_COUNT_ON_START = 5;
const SHOWING_FILMS_COUNT_BY_BUTTON = 5;

import FilmComponent from "../components/film";
import FilmPopupComponent from "../components/film-details";
import ShowMoreComponent from "../components/show-more";
import FilmExtraListComponent from "../components/film-extra-list";
import NoFilmsComponent from "../components/no-films";
import FilterComponent from "../components/filter";
import FilmListComponent from "../components/film-list";
import {render, Position} from "../utils";
import {films, filmsRated, filmsCommented} from "../data";

const siteMainElement = document.querySelector(`.main`);

const renderFilm = (film, container) => {
  const filmComponent = new FilmComponent(film);
  const filmPopupComponent = new FilmPopupComponent(film);

  const showPopup = () => {
    render(siteMainElement, filmPopupComponent.getElement(), Position.BEFOREEND);
  };

  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      siteMainElement.removeChild(filmPopupComponent.getElement());
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  filmComponent.setTitleClickHandler(() => {
    showPopup();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  filmComponent.setPosterClickHandler(() => {
    showPopup();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  filmComponent.setCommentsClickHandler(() => {
    showPopup();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  filmPopupComponent.setCloseClickHandler(() => {
    siteMainElement.removeChild(filmPopupComponent.getElement());
  });

  render(container, filmComponent.getElement(), Position.BEFOREEND);
};

export default class PageController {
  constructor(container) {
    this._container = container;

    this._films = films.slice();
    this._showMoreComponent = new ShowMoreComponent();
    this._noFilmsComponent = new NoFilmsComponent();
    this._filterComponent = new FilterComponent();
    this._filmListComponent = new FilmListComponent();
  }

  render(filmsData) {
    const container = this._container;
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
      }

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
        filmsData.slice(0, showingFilmsCount).forEach((film) => {
          renderFilm(film, filmListContainer);
        });
      });

      filmsData.slice(0, showingFilmsCount).forEach((film) => {
        renderFilm(film, filmListContainer);
      });

      if (filmsData.length > SHOWING_FILMS_COUNT_ON_START) {
        render(filmsList, this._showMoreComponent.getElement(), Position.BEFOREEND);
      }

      const filmsContainer = document.querySelector(`.films`);

      render(filmsContainer, new FilmExtraListComponent(`Top rated`).getElement(), Position.BEFOREEND);
      render(filmsContainer, new FilmExtraListComponent(`Most commented`).getElement(), Position.BEFOREEND);

      const filmsExtraElements = document.querySelectorAll(
          `.films-list--extra .films-list__container`
      );

      filmsRated.forEach((film) => {
        renderFilm(film, filmsExtraElements[0]);
      });

      filmsCommented.forEach((film) => {
        renderFilm(film, filmsExtraElements[1]);
      });
    }

    this._showMoreComponent.setClickHandler(() => {

      const prevTasksCount = showingFilmsCount;
      showingFilmsCount = showingFilmsCount + SHOWING_FILMS_COUNT_BY_BUTTON;
      const filmListContainer = document.querySelector(`.films-list__container`);

      filmsData.slice(prevTasksCount, showingFilmsCount)
        .forEach((film) => {
          renderFilm(film, filmListContainer);
        });

      if (showingFilmsCount >= filmsData.length) {
        this._showMoreComponent.getElement().remove();
      }
    });
  }
}
