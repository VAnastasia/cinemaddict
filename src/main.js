const FILM_COUNT = 5;

import { createFilmTemplate } from "./components/film";
import { createFilmPopupTemplate } from "./components/film-details";
import { createMenuTemplate } from "./components/menu";
import { createFilterTemplate } from "./components/filter";
import { createShowMoreTemplate } from "./components/show-more";
import { createProfileTemplate } from "./components/profile";
import { createFilmList } from "./components/film-list";
import { createFilmExtraList } from "./components/film-extra-list";

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = document.querySelector(`.header`);

render(siteHeaderElement, createProfileTemplate(), `beforeend`);
render(siteMainElement, createMenuTemplate(), `beforeend`);
render(siteMainElement, createFilterTemplate(), `beforeend`);
render(siteMainElement, createFilmList(), `beforeend`);

const filmListContainer = document.querySelector(`.films-list__container`);

new Array(FILM_COUNT).fill(``).forEach(() => {
  render(filmListContainer, createFilmTemplate(), `beforeend`);
});

const filmListElement = document.querySelector(`.films-list`);
const filmsElement = document.querySelector(`.films`);

render(filmListElement, createShowMoreTemplate(), `beforeend`);

render(filmsElement, createFilmExtraList(`Top rated`), `beforeend`);
render(filmsElement, createFilmExtraList(`Most commented`), `beforeend`);

const filmsExtraElements = document.querySelectorAll(
  `.films-list--extra .films-list__container`
);

filmsExtraElements.forEach(container => {
  new Array(2).fill(``).forEach(() => {
    render(container, createFilmTemplate(), `beforeend`);
  });
});

render(siteMainElement, createFilmPopupTemplate(), `beforeend`);
