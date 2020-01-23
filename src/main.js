// import FilterComponent from "./components/filter";
import FilterController, {FilterType} from "./controllers/filter";
import FilterComponent from "./components/filter";
import ProfileComponent from "./components/profile";
// import FilmListComponent from "./components/film-list";
import FooterStatisticComponent from "./components/footer-statistic";
import PageController from "./controllers/page";
import MoviesModel from "./models/movies";
import API from "./api";
import StatisticsComponent from './components/statistics.js';

import {render, Position} from "./utils";

const statisticsComponent = new StatisticsComponent();

const AUTHORIZATION = `Basic dXNlckBwYXNzd29yZAo=`;
const END_POINT = `https://htmlacademy-es-10.appspot.com/cinemaddict`;

const api = new API(END_POINT, AUTHORIZATION);

const movieModel = new MoviesModel();

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = document.querySelector(`.header`);
const siteFooterElement = document.querySelector(`footer`);

render(siteHeaderElement, new ProfileComponent().getElement(), Position.BEFOREEND);
// render(siteMainElement, new FilterComponent().getElement(), Position.BEFOREEND);
// render(siteMainElement, new FilterComponent().getElement(), Position.BEFOREEND);
// render(siteMainElement, new FilmListComponent().getElement(), Position.BEFOREEND);

const pageController = new PageController(siteMainElement, movieModel, api);
// const filterComponent = new FilterComponent().getElement();

const showStatisticsHandler = (page, statistics) => {
  return (evt) => {

    if (evt.target.className.includes(`main-navigation__item--additional`)) {
      page.hide();
      statistics.show();
    } else {
      page.show();
      statistics.hide();
    }
  };
};

api.getFilms()
  .then((filmsAll) => {
    movieModel.setFilms(filmsAll);

    const filterController = new FilterController(siteMainElement, movieModel, showStatisticsHandler(pageController, statisticsComponent));

    filterController.render();

    render(siteFooterElement, new FooterStatisticComponent(filmsAll.length).getElement(), Position.BEFOREEND);

    const commentsPromices = filmsAll
    .map((film) => api.getComment(film.id).then((comments) => movieModel.setCommentsFilm(comments, film.id)));
    Promise.all(commentsPromices).then(() => {
      pageController.render();
      render(siteMainElement, statisticsComponent.getElement(), Position.BEFOREEND);
      statisticsComponent.hide();

    });
  });

