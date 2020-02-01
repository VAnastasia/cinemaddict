import FilterController from "./controllers/filter";
import Profile from "./components/profile";
import FooterStatistic from "./components/footer-statistic";
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
    render(siteHeaderElement, new Profile(filmsAll).getElement(), Position.BEFOREEND);
    const statisticsComponent = new StatisticsComponent(moviesModel);
    siteMainElement.innerHTML = ``;

    const filterController = new FilterController(siteMainElement, moviesModel, showStatisticsHandler(pageController, statisticsComponent), statisticsComponent);
    filterController.render();
    render(siteFooterElement, new FooterStatistic(filmsAll.length).getElement(), Position.BEFOREEND);
    pageController.render();
    render(siteMainElement, statisticsComponent.getElement(), Position.BEFOREEND);
    statisticsComponent.hide();
  });
