import AbstractComponent from "./abstract-component";

const createShowMoreTemplate = () => {
  return `<button class="films-list__show-more">Show more</button>`;
};

export default class ShowMoreComponent extends AbstractComponent {
  getTemplate() {
    return createShowMoreTemplate();
  }
}
