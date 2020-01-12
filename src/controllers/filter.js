import MenuComponent from "../components/menu";
import {replace, render, Position} from "../utils";

const FilterType = {
  ALL: `all`,
  WATCHLIST: `watchlist`,
  HISTORY: `history`,
  FAVORITES: `favorites`
};

const getFilmsByFilter = (films, filterType) => {
  switch (filterType) {
    case FilterType.ALL:
      return films.slice();
    case FilterType.WATCHLIST:
      return films.filter((film) => film.watchlist);
    case FilterType.HISTORY:
      return films.filter((film) => film.watched);
    case FilterType.FAVORITES:
      return films.filter((film) => film.favorite);
  }

  return films;
};

export default class FilterController {
  constructor(container, moviesModel) {
    this._container = container;
    this._moviesModel = moviesModel;

    this._activeFilterType = FilterType.ALL;
    this._menuComponent = null;

    this._onFilterChange = this._onFilterChange.bind(this);
  }

  render() {
    const container = this._container;
    const allFilms = this._moviesModel.getFilmsAll();
    const filters = Object.values(FilterType).map((filterType) => {
      return {
        name: filterType,
        count: getFilmsByFilter(allFilms, filterType).length,
        checked: filterType === this._activeFilterType
      };
    });

    const oldComponent = this._menuComponent;
    this._menuComponent = new MenuComponent();

    if (oldComponent) {
      replace(this._menuComponent, oldComponent);
    } else {
      render(container, this._menuComponent, Position.BEFOREEND);
    }
  }
}
