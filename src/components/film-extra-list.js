import {createElement} from "../utils";

const createFilmExtraList = (text) => {
  return `<section class="films-list--extra">
      <h2 class="films-list__title">${text}</h2>

      <div class="films-list__container"></div>
    </section>`;
};

export default class FilmExtraListComponent {
  constructor(title) {
    this._title = title;
    this._element = null;
  }

  getTemplate() {
    return createFilmExtraList(this._title);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
