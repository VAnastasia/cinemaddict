// import FilterComponent from "./components/filter";
import FilterController from "./controllers/filter";
// import FilterComponent from "./components/filter";
import ProfileComponent from "./components/profile";
// import FilmListComponent from "./components/film-list";
import FooterStatisticComponent from "./components/footer-statistic";
import PageController from "./controllers/page";
import MoviesModel from "./models/movies";
import API from "./api";

import {render, Position} from "./utils";

const AUTHORIZATION = `Basic dXNlckBwYXNzd29yZAo=`;
const END_POINT = `https://htmlacademy-es-10.appspot.com/cinemaddict`;

const api = new API(END_POINT, AUTHORIZATION);

const movieModel = new MoviesModel();

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = document.querySelector(`.header`);
const siteFooterElement = document.querySelector(`footer`);

render(siteHeaderElement, new ProfileComponent().getElement(), Position.BEFOREEND);
const filterController = new FilterController(siteMainElement, movieModel);
// render(siteMainElement, new FilterComponent().getElement(), Position.BEFOREEND);
// render(siteMainElement, new FilterComponent().getElement(), Position.BEFOREEND);
// render(siteMainElement, new FilmListComponent().getElement(), Position.BEFOREEND);

const pageController = new PageController(siteMainElement, movieModel);

api.getFilms()
  .then((filmsAll) => {
    movieModel.setFilms(filmsAll);
    filterController.render();

    render(siteFooterElement, new FooterStatisticComponent(filmsAll.length).getElement(), Position.BEFOREEND);

    const commentsPromices = filmsAll
    .map((film) => api.getComment(film.id).then((comments) => movieModel.setCommentsFilm(comments, film.id)));
    Promise.all(commentsPromices).then(() => {
      pageController.render();
    });
  });
