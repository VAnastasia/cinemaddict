import AbstractComponent from "./abstract-component";

const createFilmExtraList = (text) => {
  return `<section class="films-list--extra">
      <h2 class="films-list__title">${text}</h2>

      <div class="films-list__container"></div>
    </section>`;
};

export default class FilmExtraListComponent extends AbstractComponent {
  constructor(title) {
    super();
    this._title = title;
  }

  getTemplate() {
    return createFilmExtraList(this._title);
  }
}
