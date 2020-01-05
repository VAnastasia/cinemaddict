import FilmComponent from "../components/film";
import FilmPopupComponent from "../components/film-details";
import {render, Position} from "../utils";

export default class MovieController {
  constructor(container) {
    this._container = container;
  }

  render(film) {
    const filmComponent = new FilmComponent(film);
    const filmPopupComponent = new FilmPopupComponent(film);
    const siteMainElement = document.querySelector(`.main`);

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

    render(this._container, filmComponent.getElement(), Position.BEFOREEND);
  }
}
