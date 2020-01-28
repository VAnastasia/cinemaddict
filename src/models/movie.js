export default class MovieModel {
  constructor(data) {
    this.id = data[`id`];
    this.title = data[`film_info`][`title`];
    this.alterTitle = data[`film_info`][`alternative_title`];
    this.description = data[`film_info`][`description`];
    this.rating = data[`film_info`][`total_rating`];
    this.poster = data[`film_info`][`poster`];
    this.age = data[`film_info`][`age_rating`];
    this.director = data[`film_info`][`director`];
    this.writers = data[`film_info`][`writers`];
    this.actors = data[`film_info`][`actors`];
    this.year = data[`film_info`][`release`][`date`];
    this.country = data[`film_info`][`release`][`release_country`];
    this.runtime = data[`film_info`][`runtime`];
    this.genres = data[`film_info`][`genre`];
    this.personalRating = data[`user_details`][`personal_rating`];
    this.watchlist = data[`user_details`][`watchlist`];
    this.watched = data[`user_details`][`already_watched`];
    this.watchedDate = data[`user_details`][`watching_date`];
    this.favorite = data[`user_details`][`favorite`];
    this.comments = [];
    this.commentsId = data[`comments`];
    this.commentsAmount = data[`comments`].length;
  }

  toRAW() {
    return {
      'id': this.id,
      'comments': this.comments,
      'film_info': {
        'title': this.title,
        'alternative_title': this.alterTitle,
        'total_rating': this.rating,
        'poster': this.poster,
        'age_rating': this.age,
        'director': this.director,
        'writers': this.writers,
        'actors': this.actors,
        'release': {
          'date': this.year,
          'release_country': this.country
        },
        'runtime': this.runtime,
        'genre': this.genres,
        'description': this.description,
      },
      'user_details': {
        'watchlist': this.watchlist,
        'personal_rating': this.personalRating,
        'already_watched': this.watched,
        'watching_date': new Date(this.watchedDate).toISOString(),
        'favorite': this.favorite
      }
    };
  }

  static parseFilm(data) {
    return new MovieModel(data);
  }

  static parseFilms(data) {
    return data.map(MovieModel.parseFilm);
  }

  static clone(data) {
    return new MovieModel(data.toRAW());
  }
}
