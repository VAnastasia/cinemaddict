// import FilterComponent from "./components/filter";
import FilterController from "./controllers/filter";
import ProfileComponent from "./components/profile";
// import FilmListComponent from "./components/film-list";
import FooterStatisticComponent from "./components/footer-statistic";
import PageController from "./controllers/page";
import {moviesModel} from "./models/movies";
import {api} from "./api";
import StatisticsComponent from './components/statistics.js';

import {render, Position} from "./utils";

//
// const AUTHORIZATION = `Basic dXNlckBwYXNzd29yZAo=`;
// const END_POINT = `https://htmlacademy-es-10.appspot.com/cinemaddict`;
//
// const api = new API(END_POINT, AUTHORIZATION);

// const movieModel = new MoviesModel();

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = document.querySelector(`.header`);
const siteFooterElement = document.querySelector(`footer`);

// render(siteMainElement, new FilterComponent().getElement(), Position.BEFOREEND);
// render(siteMainElement, new FilterComponent().getElement(), Position.BEFOREEND);
// render(siteMainElement, new FilmListComponent().getElement(), Position.BEFOREEND);

const pageController = new PageController(siteMainElement, moviesModel, api);
// const filterComponent = new FilterComponent().getElement();

const showStatisticsHandler = (page, statistics) => {
  return (evt) => {

    if (evt.target.className.includes(`main-navigation__item--additional`)) {
      page.hide();
      statistics.show();
      // console.log(statistics);
    } else {
      page.show();
      statistics.hide();
    }
  };
};

api.getFilms()
  .then((filmsAll) => {
    moviesModel.setFilms(filmsAll);

    render(siteHeaderElement, new ProfileComponent(filmsAll).getElement(), Position.BEFOREEND);

    const statisticsComponent = new StatisticsComponent(moviesModel);

    const filterController = new FilterController(siteMainElement, moviesModel, showStatisticsHandler(pageController, statisticsComponent));

    filterController.render();

    render(siteFooterElement, new FooterStatisticComponent(filmsAll.length).getElement(), Position.BEFOREEND);

    pageController.render();
    render(siteMainElement, statisticsComponent.getElement(), Position.BEFOREEND);
    statisticsComponent.hide();

    // const commentsPromices = filmsAll
    // .map((film) => api.getComment(film.id).then((comments) => movieModel.setCommentsFilm(comments, film.id)));
    // Promise.all(commentsPromices).then(() => {
    //
    //
    // });
  });
