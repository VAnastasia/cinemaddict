import AbstractSmartComponent from "./abstract-smart-component";
import {defineUserRating} from "./profile";

import Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

import moment from "moment";

const DAYS_WEEK = 7;
const DAYS_MONTH = 30;
const DAYS_YEAR = 365;
const MINUTES_HOUR = 60;

const FILTERS = {
  "all-time": `All time`,
  "today": `Today`,
  "week": `Week`,
  "month": `Month`,
  "year": `Year`
};

const compareDates = (compareDate) => {
  const today = moment(Date.now());
  const date = moment(compareDate);
  return today.diff(date, `days`, true);
};

const compareDatesToday = (day) => {
  const today = (new Date()).getDate();
  const date = (new Date(day)).getDate();
  return today === date;
};

const getFilmsByDays = (films, days) => {
  return films.filter((film) => compareDates(film.watchedDate) <= days);
};

const filtredFilms = (films) => {
  return {
    "all-time": films.slice(),
    "today": films.slice().filter((film) => compareDatesToday(film.watchedDate)),
    "week": getFilmsByDays(films.slice(), DAYS_WEEK),
    "month": getFilmsByDays(films.slice(), DAYS_MONTH),
    "year": getFilmsByDays(films.slice(), DAYS_YEAR)
  };
};

const createStatisticsTemplate = (watchedFilmsAmount, totalDuration, topGenre, activeFilter) => {
  return (
    `<section class="statistic">
       <p class="statistic__rank">
        Your rank
        <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
        <span class="statistic__rank-label">${defineUserRating(watchedFilmsAmount)}</span>
      </p>

      <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
        <p class="statistic__filters-description">Show stats:</p>

        ${Object.keys(FILTERS).map((filter) => {
      return `<input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-${filter}" value="${filter}" ${filter === activeFilter ? `checked` : ``}>
          <label for="statistic-${filter}" class="statistic__filters-label">${FILTERS[filter]}</label>`;
    }).join(`\n`)}
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
  constructor(moviesModel) {
    super();
    this._moviesModel = moviesModel;
    this._films = this._moviesModel.getFilmsAll();
    this._filmsWatched = this._films.filter((film) => film.watched);

    this._activeFilter = `all-time`;
    this._chart = null;
    this._renderCharts();
    this.setOnFilterClickHandler();
  }

  recoveryListeners() {
    this.setOnFilterClickHandler();
  }

  rerender() {
    super.rerender();
    this.setActiveFilter(this._activeFilter);
    this._renderCharts();
  }

  update(newFilmsData) {
    this._films = newFilmsData;
    // this.rerender();
  }

  getWatchedFilms() {
    const watchedFilms = filtredFilms(this._filmsWatched)[this._activeFilter];

    return watchedFilms.length;
  }

  getTotalDuration() {
    const watchedFilms = filtredFilms(this._filmsWatched)[this._activeFilter];

    if (watchedFilms.length > 0) {
      const totalTime = watchedFilms.reduce((total, film) => total + film.runtime, 0);
      return `${Math.floor(totalTime / MINUTES_HOUR)}<span class="statistic__item-description">h</span> ${totalTime % MINUTES_HOUR}<span class="statistic__item-description">m</span>`;
    }

    return `0<span class="statistic__item-description">h</span> 0<span class="statistic__item-description">m</span>`;
  }

  getWatchedGenresAmount(films) {

    if (films.length > 0) {
      const genresSet = new Set([]);
      const genresWatched = {};

      films.forEach((film) => {
        film.genres.forEach((genre) => {
          genresSet.add(genre);
        });
      });

      const genres = Array.from(genresSet);
      genres.forEach((genre) => {
        genresWatched[genre] = 0;
      });

      films.forEach((film) => {
        film.genres.forEach((genre) => {
          genresWatched[genre] = genresWatched[genre] + 1;
        });

      });

      const genresStatistics = Object.keys(genresWatched)
        .map((genre) => {
          return {
            name: genre,
            amount: genresWatched[genre]
          };
        });

      return genresStatistics.sort((a, b) => b.amount - a.amount);
    }

    return [];

  }

  getTopGenre() {
    const watchedFilms = filtredFilms(this._filmsWatched)[this._activeFilter];

    if (watchedFilms.length > 0) {
      const genres = this.getWatchedGenresAmount(watchedFilms);
      return genres[0].name;
    }
    return `-`;
  }

  getTemplate() {
    const watchedFilmsAmount = this.getWatchedFilms();
    const totalDuration = this.getTotalDuration();
    const topGenre = this.getTopGenre();
    return createStatisticsTemplate(watchedFilmsAmount, totalDuration, topGenre, this._activeFilter);
  }

  setOnFilterClickHandler() {
    this.getElement().querySelector(`.statistic__filters`)
      .addEventListener(`click`, (evt) => {
        if (evt.target.tagName === `INPUT`) {
          if (this._activeFilter !== evt.target.value) {
            this._activeFilter = evt.target.value;
            this.rerender();
          }
        }
      });
  }

  setActiveFilter(activeFilter) {
    this._activeFilter = activeFilter;
  }

  show() {
    super.show();
    this.update(this._films);
    this.rerender();
  }

  _renderCharts() {
    if (this._chart) {
      this._chart.destroy();
      this._chart = null;
    }

    const watchedFilms = filtredFilms(this._filmsWatched)[this._activeFilter];
    if (watchedFilms.length > 0) {
      this._chart = this._createChart(watchedFilms);
    }
  }

  _createChart(films) {
    const genres = this.getWatchedGenresAmount(films);

    const canvas = this.getElement().querySelector(`.statistic__chart`);
    const ctx = canvas.getContext(`2d`);

    this._chart = new Chart(ctx, {
      type: `horizontalBar`,
      data: {
        plagins: [ChartDataLabels],
        labels: genres.map((genre) => genre.name),
        datasets: [
          {
            data: genres.map((genre) => genre.amount),
            backgroundColor: `#ffe800`,
            strokeColor: `#ffe800`,
            borderWidth: 1,
            datalabels: {
              anchor: `start`,
              align: `start`,
              offset: 50,
              barThickness: 20,
              categoryPercentage: 1,
              formatter: (value, context) =>
                `${context.chart.data.labels[context.dataIndex]}          ${value}`
            }
          }
        ]
      },
      options: {
        responsiveAnimationDuration: 400,
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
          datalabels: {
            font: {
              size: 16
            },
            color: `#ffffff`
          }
        },
        legend: {
          display: false
        },
        tooltips: {
          enabled: false
        },
        layout: {
          padding: {
            left: 200
          }
        },
        scales: {
          xAxes: [
            {
              display: false,
              ticks: {
                stepSize: 1,
                beginAtZero: true
              }
            }
          ],
          yAxes: [
            {
              display: false,
            }
          ]
        }
      }
    });
    return this._chart;
  }
}
