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

  const titleFilm = filmComponent.getElement().querySelector(`.film-card__title`);
  const posterFilm = filmComponent.getElement().querySelector(`.film-card__poster`);
  const commentsFilm = filmComponent.getElement().querySelector(`.film-card__comments`);

  titleFilm.addEventListener(`click`, () => {
    showPopup();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  posterFilm.addEventListener(`click`, () => {
    showPopup();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  commentsFilm.addEventListener(`click`, () => {
    showPopup();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  const closePopup = filmPopupComponent.getElement().querySelector(`.film-details__close-btn`);

  closePopup.addEventListener(`click`, () => {
    siteMainElement.removeChild(filmPopupComponent.getElement());
  });

  render(container, filmComponent.getElement(), Position.BEFOREEND);
};

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = document.querySelector(`.header`);

render(siteHeaderElement, new ProfileComponent().getElement(), Position.BEFOREEND);
render(siteMainElement, new MenuComponent().getElement(), Position.BEFOREEND);
render(siteMainElement, new FilterComponent().getElement(), Position.BEFOREEND);
render(siteMainElement, new FilmListComponent().getElement(), Position.BEFOREEND);

const filmsContainer = document.querySelector(`.films`);
const filmsList = document.querySelector(`.films-list`);
const filmListContainer = document.querySelector(`.films-list__container`);

if (films.length === 0) {
  render(siteMainElement, new NoFilmsComponent().getElement(), Position.BEFOREEND);
} else {
  filmsAll.slice(0, 5).forEach((film) => {
    renderFilm(film, filmListContainer);
  });

  if (films.length > 5) {
    render(filmsList, new ShowMoreComponent().getElement(), Position.BEFOREEND);
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

const footerStatistic = document.querySelector(`.footer__statistics p`);
footerStatistic.textContent = `${films.length} movies inside`;

const loadMoreButton = filmsList.querySelector(`.films-list__show-more`);
let showingTasksCount = SHOWING_FILMS_COUNT_ON_START;
loadMoreButton.addEventListener(`click`, () => {
  const prevTasksCount = showingTasksCount;
  showingTasksCount = showingTasksCount + SHOWING_FILMS_COUNT_BY_BUTTON;

  filmsAll.slice(prevTasksCount, showingTasksCount)
    .forEach((film) => {
      renderFilm(film, filmListContainer);
    });

  if (showingTasksCount >= films.length) {
    loadMoreButton.remove();
  }
});
