import AbstractSmartComponent from "./abstract-smart-component";
import {defineUserRating} from "./profile";

import Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import moment from "moment";

const compareDates = (compareDate) => {
  const today = moment(Date.now());
  const date = moment(compareDate);
  console.log(today.diff(date, `days`, true));
  return today.diff(date, `days`, true);
};

const getFilmsByDate = (films, days) => {
  return films.filter((film) => film.watchedDate <= days);
}

compareDates(new Date(`2020-01-22T09:41:38.799Z`));

const createStatisticsTemplate = (watchedFilmsAmount, totalDuration, topGenre, filmWatcheAmount) => {
  return (
    `<section class="statistic">
       <p class="statistic__rank">
        Your rank
        <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
        <span class="statistic__rank-label">${defineUserRating(filmWatcheAmount)}</span>
      </p>

      <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
        <p class="statistic__filters-description">Show stats:</p>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" checked>
        <label for="statistic-all-time" class="statistic__filters-label">All time</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today">
        <label for="statistic-today" class="statistic__filters-label">Today</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week">
        <label for="statistic-week" class="statistic__filters-label">Week</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month">
        <label for="statistic-month" class="statistic__filters-label">Month</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year">
        <label for="statistic-year" class="statistic__filters-label">Year</label>
      </form>

      <ul class="statistic__text-list">
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">You watched</h4>
          <p class="statistic__item-text">${watchedFilmsAmount} <span class="statistic__item-description">movies</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Total duration</h4>
          <p class="statistic__item-text">${totalDuration}</p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Top genre</h4>
          <p class="statistic__item-text">${topGenre}</p>
        </li>
      </ul>

      <div class="statistic__chart-wrap">
        <canvas class="statistic__chart" width="1000"></canvas>
      </div>

    </section>`
  );
};

export default class StatisticsComponent extends AbstractSmartComponent {
  constructor(films) {
    super();

    this._films = films;
    this._filmsWatched = this._films.filter((film) => film.watched);
    this._genres = new Set([]);
    this._genresWatched = {};
  }

  getWatchedFilms() {
    return this._filmsWatched.length;
  }

  getTotalDuration() {
    const totalTime = this._filmsWatched
      .map((film) => film.runtime)
      .reduce((total, runtime) => total + runtime);
    return `${Math.floor(totalTime / 60)}<span class="statistic__item-description">h</span> ${totalTime % 60}<span class="statistic__item-description">m</span>`;
  }

  getGenres() {
    this._filmsWatched.forEach((film) => {
      film.genres.forEach((genre) => {
        this._genres.add(genre);
      });
    });
  }

  getWatchedGenres() {
    this.getGenres();
    const genres = Array.from(this._genres);
    genres.forEach((genre) => {
      this._genresWatched[genre] = 0;

    });
  }

  getWatchedGenresAmount() {
    this.getWatchedGenres();
    this._filmsWatched.forEach((film) => {
      film.genres.forEach((genre) => {
        this._genresWatched[genre] = this._genresWatched[genre] + 1;
      });

    });
  }

  getTopGenre() {
    this.getWatchedGenresAmount();
    const max = Math.max(...Object.values(this._genresWatched));
    let topGenre = ``;

    Object.keys(this._genresWatched).forEach((genre) => {

      if (this._genresWatched[genre] === max) {
        topGenre = genre;
        return;
      }

    });
    return topGenre;

  }

  getTemplate() {
    return createStatisticsTemplate(this.getWatchedFilms(), this.getTotalDuration(), this.getTopGenre(), this.getWatchedFilms());
  }
}
