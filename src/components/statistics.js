import AbstractSmartComponent from "./abstract-smart-component";
import {defineUserRating} from "./profile";

import Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

import moment from "moment";

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

const FILTERS = {
  "all-time": `All time`,
  "today": `Today`,
  "week": `Week`,
  "month": `Month`,
  "year": `Year`
};

const filtredFilms = (films) => {
  console.log({
    "all-time": films.slice(),
    "today": films.slice().filter((film) => compareDatesToday(film.watchedDate)),
    "week": getFilmsByDays(films.slice(), 7),
    "month": getFilmsByDays(films.slice(), 30),
    "year": getFilmsByDays(films.slice(), 365)
  });

  return {
    "all-time": films.slice(),
    "today": films.slice().filter((film) => compareDatesToday(film.watchedDate)),
    "week": getFilmsByDays(films.slice(), 7),
    "month": getFilmsByDays(films.slice(), 30),
    "year": getFilmsByDays(films.slice(), 365)
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
        <canvas class="statistic__chart" width="1000" height="400"></canvas>
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
    // this._genres = new Set([]);
    // this._genresWatched = {};
    this._activeFilter = `all-time`;
    this._chart = null;
    this._renderCharts();
  }

  recoveryListeners() {

  }

  getWatchedFilms() {
    const watchedFilms = filtredFilms(this._filmsWatched)[this._activeFilter];

    return watchedFilms.length;
  }

  getTotalDuration() {
    const watchedFilms = filtredFilms(this._filmsWatched)[this._activeFilter];

    const totalTime = watchedFilms
      .map((film) => film.runtime)
      .reduce((total, runtime) => total + runtime);
    return `${Math.floor(totalTime / 60)}<span class="statistic__item-description">h</span> ${totalTime % 60}<span class="statistic__item-description">m</span>`;
  }

  getWatchedGenresAmount(filmsData) {
    let genresSet = new Set([]);
    const genresWatched = {};

    filmsData.forEach((film) => {
      film.genres.forEach((genre) => {
        genresSet.add(genre);
      });
    });

    const genres = Array.from(genresSet);
    genres.forEach((genre) => {
      genresWatched[genre] = 0;
    });

    filmsData.forEach((film) => {
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

  getTopGenre() {
    const watchedFilms = filtredFilms(this._filmsWatched)[this._activeFilter];

    const genres = this.getWatchedGenresAmount(watchedFilms);
    return genres[0].name;
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
        console.log(`change`);

        if (evt.target.tagName === `INPUT`) {
          if (this._activeFilter !== evt.target.value) {
            this._activeFilter = evt.target.value;
            this.rerender();
            this._renderCharts();
          }
        }
      });
  }

  setActiveFilter(activeFilter) {
    this._activeFilter = activeFilter;
    this.rerender();
  }

  show() {
    super.show();
    this.update(this._moviesModel.getFilmsAll());
  }

  rerender() {
    super.rerender();

    // this.setActiveFilter(this._activeFilter);

    this._renderCharts();
  }

  update(newFilmsData) {
    this._films = newFilmsData;
    this.rerender();
    this._renderCharts();
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

              // color: `#ffffff`,
              // font: {
              //   size: 16
              // },
              formatter: (value, context) =>
                `${context.chart.data.labels[context.dataIndex]}             ${value}`
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
              // barThickness: 20,
              display: false,
              // barPercentage: 0.5,
              // categoryPercentage: 1
            }
          ]
        }
      }
    });
    return this._chart;
  }
}
