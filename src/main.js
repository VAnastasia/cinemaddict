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

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = document.querySelector(`.header`);
const siteFooterElement = document.querySelector(`footer`);

const pageController = new PageController(siteMainElement, moviesModel, api);

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
    moviesModel.setFilms(filmsAll);
    render(siteHeaderElement, new ProfileComponent(filmsAll).getElement(), Position.BEFOREEND);
    const statisticsComponent = new StatisticsComponent(moviesModel);
    const filterController = new FilterController(siteMainElement, moviesModel, showStatisticsHandler(pageController, statisticsComponent), statisticsComponent);
    filterController.render();
    render(siteFooterElement, new FooterStatisticComponent(filmsAll.length).getElement(), Position.BEFOREEND);
    pageController.render();
    render(siteMainElement, statisticsComponent.getElement(), Position.BEFOREEND);
    statisticsComponent.hide();
  });
