import MenuComponent from "./components/menu";
// import FilterComponent from "./components/filter";
import ProfileComponent from "./components/profile";
// import FilmListComponent from "./components/film-list";
import FooterStatisticComponent from "./components/footer-statistic";
import PageController from "./controllers/page";
import MoviesModel from "./models/movies";

import {render, Position} from "./utils";
import {films} from "./data";

const movieModel = new MoviesModel();
movieModel.setFilms(films);

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = document.querySelector(`.header`);
const siteFooterElement = document.querySelector(`footer`);

render(siteHeaderElement, new ProfileComponent().getElement(), Position.BEFOREEND);
render(siteMainElement, new MenuComponent().getElement(), Position.BEFOREEND);
// render(siteMainElement, new FilterComponent().getElement(), Position.BEFOREEND);
// render(siteMainElement, new FilmListComponent().getElement(), Position.BEFOREEND);
render(siteFooterElement, new FooterStatisticComponent(films.length).getElement(), Position.BEFOREEND);

new PageController(siteMainElement, movieModel).render();
