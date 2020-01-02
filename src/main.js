const SHOWING_FILMS_COUNT_ON_START = 5;
const SHOWING_FILMS_COUNT_BY_BUTTON = 5;

import FilmComponent from "./components/film";
import FilmPopupComponent from "./components/film-details";
import MenuComponent from "./components/menu";
import FilterComponent from "./components/filter";
import ShowMoreComponent from "./components/show-more";
import ProfileComponent from "./components/profile";
import FilmListComponent from "./components/film-list";
import FilmExtraListComponent from "./components/film-extra-list";
import NoFilmsComponent from "./components/no-films";
import FooterStatisticComponent from "./components/footer-statistic";

import {films, filmsAll, filmsRated, filmsCommented} from "./data";
import {render, Position} from "./utils";

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

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = document.querySelector(`.header`);
const siteFooterElement = document.querySelector(`footer`);

render(siteHeaderElement, new ProfileComponent().getElement(), Position.BEFOREEND);
render(siteMainElement, new MenuComponent().getElement(), Position.BEFOREEND);
render(siteMainElement, new FilterComponent().getElement(), Position.BEFOREEND);
render(siteMainElement, new FilmListComponent().getElement(), Position.BEFOREEND);

const filmsContainer = document.querySelector(`.films`);
const filmsList = document.querySelector(`.films-list`);
const filmListContainer = document.querySelector(`.films-list__container`);
const showMoreComponent = new ShowMoreComponent();

if (films.length === 0) {
  render(siteMainElement, new NoFilmsComponent().getElement(), Position.BEFOREEND);
} else {
  filmsAll.slice(0, SHOWING_FILMS_COUNT_ON_START).forEach((film) => {
    renderFilm(film, filmListContainer);
  });

  if (films.length > SHOWING_FILMS_COUNT_ON_START) {
    render(filmsList, showMoreComponent.getElement(), Position.BEFOREEND);
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

render(siteFooterElement, new FooterStatisticComponent(films.length).getElement(), Position.BEFOREEND);

let showingTasksCount = SHOWING_FILMS_COUNT_ON_START;
showMoreComponent.setClickHandler(() => {
  const prevTasksCount = showingTasksCount;
  showingTasksCount = showingTasksCount + SHOWING_FILMS_COUNT_BY_BUTTON;

  filmsAll.slice(prevTasksCount, showingTasksCount)
    .forEach((film) => {
      renderFilm(film, filmListContainer);
    });

  if (showingTasksCount >= films.length) {
    showMoreComponent.getElement().remove();
  }
});
