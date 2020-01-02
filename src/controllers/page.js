const SHOWING_FILMS_COUNT_ON_START = 5;
const SHOWING_FILMS_COUNT_BY_BUTTON = 5;

import FilmComponent from "../components/film";
import FilmPopupComponent from "../components/film-details";
import ShowMoreComponent from "../components/show-more";
import FilmExtraListComponent from "../components/film-extra-list";
import NoFilmsComponent from "../components/no-films";
import {render, Position} from "../utils";
import {filmsRated, filmsCommented} from "../data";

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

    this._showMoreComponent = new ShowMoreComponent();
    this._noFilmsComponent = new NoFilmsComponent();
  }

  render(filmsData) {
    const container = this._container;

    const filmsContainer = document.querySelector(`.films`);
    const filmsList = document.querySelector(`.films-list`);

    if (filmsData.length === 0) {
      render(siteMainElement, this._noFilmsComponent.getElement(), Position.BEFOREEND);
    } else {
      filmsData.slice(0, SHOWING_FILMS_COUNT_ON_START).forEach((film) => {
        renderFilm(film, container);
      });

      if (filmsData.length > SHOWING_FILMS_COUNT_ON_START) {
        render(filmsList, this._showMoreComponent.getElement(), Position.BEFOREEND);
      }

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

    let showingTasksCount = SHOWING_FILMS_COUNT_ON_START;
    this._showMoreComponent.setClickHandler(() => {
      const prevTasksCount = showingTasksCount;
      showingTasksCount = showingTasksCount + SHOWING_FILMS_COUNT_BY_BUTTON;

      filmsData.slice(prevTasksCount, showingTasksCount)
        .forEach((film) => {
          renderFilm(film, container);
        });

      if (showingTasksCount >= filmsData.length) {
        this._showMoreComponent.getElement().remove();
      }
    });
  }
}
