import FilterComponent from "../components/filter";
import {replace, render, Position} from "../utils";

export const FilterType = {
  ALL: `all`,
  WATCHLIST: `watchlist`,
  HISTORY: `history`,
  FAVORITES: `favorites`
};

export const getFilmsByFilter = (films, filterType) => {
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
    this._filterComponent = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._moviesModel.setDataChangeHandler(this._onDataChange);
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

    const oldComponent = this._filterComponent;
    this._filterComponent = new FilterComponent(filters);
    this._filterComponent.setFilterChangeHandler(this._onFilterChange);

    if (oldComponent) {
      replace(this._filterComponent, oldComponent);
    } else {
      render(container, this._filterComponent.getElement(), Position.BEFOREEND);
    }
  }

  _onDataChange() {
    this.render();
  }

  _onFilterChange(filterType) {
    this._moviesModel.setFilter(filterType);
    this._activeFilterType = filterType;
    this.render();

  }
}
