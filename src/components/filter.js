import AbstractComponent from "./abstract-component";

const createFilterMarkup = (filter, isChecked) => {
  const {name, count} = filter;

  if (name === `all`) {
    return `<a href="#all" data-filter="${name}" class="main-navigation__item ${isChecked ? `main-navigation__item--active` : ``}">All movies</a>`;
  }

  if (name === `stats`) {
    return `<a href="#stats" data-filter="${name}" class="main-navigation__item ${isChecked ? `main-navigation__item--active` : ``} main-navigation__item--additional">Stats</a>`;
  }

  return `<a href="#${name}" data-filter="${name}" class="main-navigation__item ${isChecked ? `main-navigation__item--active` : ``}">${name[0].toUpperCase()}${name.slice(1)} <span class="main-navigation__item-count">${count}</span></a>`;
};

const createFilterTemplate = (filters) => {
  const filtersMarkup = filters.map((filter) => createFilterMarkup(filter, filter.checked)).join(`\n`);

  return `<nav class="main-navigation">
    ${filtersMarkup}
  </nav>`;
};

export default class FilterComponent extends AbstractComponent {
  constructor(filters) {
    super();
    this._filters = filters;
  }

  getTemplate() {
    return createFilterTemplate(this._filters);
  }

  setFilterChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();
      const filterName = evt.target.dataset.filter;
      handler(filterName);
    });
  }

  setActiveItem(menuItem) {
    this.clearActiveItem();
    const item = this.getElement().querySelector(`#${menuItem}`);

    if (item) {
      item.classList.add(`main-navigation__item--active`);
    }
  }

  setShowStatisticHandler(handler) {
    this.getElement().addEventListener(`click`, handler);
  }

  clearActiveItem() {
    const menuItems = this.getElement().querySelectorAll(`main-navigation__item`);
    menuItems.forEach((menuItem) => {
      menuItem.classList.remove(`main-navigation__item--active`);
    });
  }

}
