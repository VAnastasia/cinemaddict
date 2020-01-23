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

const compareDatesToday = (day) => {
  const today = (new Date()).getDate();
  const date = (new Date(day)).getDate();
  return today === date;
};

const getFilmsByDays = (films, days) => {
  return films.filter((film) => film.watchedDate <= days);
};

const FILTERS = {
  "all-time": `All time`,
  "today": `Today`,
  "week": `Week`,
  "month": `Month`,
  "year": `Year`
};

const filtredFilms = (films) => {
  return {
    "all-time": films.slice(),
    "today": films.slice().filter((film) => compareDatesToday(film.watchedDate)),
    "week": getFilmsByDays(films.slice(), 7),
    "month": getFilmsByDays(films.slice(), 30),
    "year": getFilmsByDays(films.slice(), 365)
  }
}


const createStatisticsTemplate = (watchedFilmsAmount, totalDuration, topGenre, filmWatchedAmount, activeFilter) => {
  return (
    `<section class="statistic">
       <p class="statistic__rank">
        Your rank
        <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
        <span class="statistic__rank-label">${defineUserRating(filmWatchedAmount)}</span>
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
  constructor(films) {
    super();

    this._films = films;
    this._filmsWatched = this._films.filter((film) => film.watched);
    this._genres = new Set([]);
    this._genresWatched = {};
    this._activeFilter = `all-time`;
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

  // getGenres() {
  //   this._filmsWatched.forEach((film) => {
  //     film.genres.forEach((genre) => {
  //       this._genres.add(genre);
  //     });
  //   });
  // }

  // getWatchedGenres() {
  //   // this.getGenres();
  //   this._filmsWatched.forEach((film) => {
  //     film.genres.forEach((genre) => {
  //       this._genres.add(genre);
  //     });
  //   });

  //   const genres = Array.from(this._genres);
  //   genres.map((genre) => {
  //     this._genresWatched[genre] = 0;
  //   });
  // }

  getWatchedGenresAmount() {
    // this.getWatchedGenres();

    this._filmsWatched.forEach((film) => {
      film.genres.forEach((genre) => {
        this._genres.add(genre);
      });
    });

    const genres = Array.from(this._genres);
    genres.forEach((genre) => {
      this._genresWatched[genre] = 0;
    });

    this._filmsWatched.forEach((film) => {
      film.genres.forEach((genre) => {
        this._genresWatched[genre] = this._genresWatched[genre] + 1;
      });

    });

    const genresStatistics = Object.keys(this._genresWatched)
      .map((genre) => {
        return {
          name: genre,
          amount: this._genresWatched[genre]
        };
      });

    return genresStatistics.sort((a, b) => b.amount - a.amount);
  }

  getTopGenre() {
    const genres = this.getWatchedGenresAmount();
    return genres[0].name;
  }

  getTemplate() {
    return createStatisticsTemplate(this.getWatchedFilms(), this.getTotalDuration(), this.getTopGenre(), this.getWatchedFilms(), this._activeFilter);
  }

  setOnFilterClickHandler() {
    this.getElement().querySelector(`.statistic__filters`)
      .addEventListener(`click`, (evt) => {
        if (evt.target.tagName === `INPUT`) {
          if (this._currentFilter !== evt.target.value) {
            this._currentFilter = evt.target.value;
            this.rerender();
            this.renderChart();
          }
        }
      });
  }

  update(newFilmsData) {
    this._films = newFilmsData;
    this.rerender();
    this.renderChart();
  }

  renderChart() {
    if (this._chart) {
      this._chart.destroy();
      this._chart = null;
    }

    const watchedFilms = filtredFilms(this._filmsWatched)[this._activeFilter];
    this._chart = this._createChart(watchedFilms);
  }
}
