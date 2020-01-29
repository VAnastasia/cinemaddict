export default class MovieModel {
  constructor(movie) {
    this.id = movie[`id`];
    this.title = movie[`film_info`][`title`];
    this.alterTitle = movie[`film_info`][`alternative_title`];
    this.description = movie[`film_info`][`description`];
    this.rating = movie[`film_info`][`total_rating`];
    this.poster = movie[`film_info`][`poster`];
    this.age = movie[`film_info`][`age_rating`];
    this.director = movie[`film_info`][`director`];
    this.writers = movie[`film_info`][`writers`];
    this.actors = movie[`film_info`][`actors`];
    this.year = movie[`film_info`][`release`][`date`];
    this.country = movie[`film_info`][`release`][`release_country`];
    this.runtime = movie[`film_info`][`runtime`];
    this.genres = movie[`film_info`][`genre`];
    this.personalRating = movie[`user_details`][`personal_rating`];
    this.watchlist = movie[`user_details`][`watchlist`];
    this.watched = movie[`user_details`][`already_watched`];
    this.watchedDate = movie[`user_details`][`watching_date`];
    this.favorite = movie[`user_details`][`favorite`];
    this.comments = [];
    this.commentsId = movie[`comments`];
    this.commentsAmount = movie[`comments`].length;
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

  static parseFilm(movie) {
    return new MovieModel(movie);
  }

  static parseFilms(movie) {
    return movie.map(MovieModel.parseFilm);
  }

  static clone(movie) {
    return new MovieModel(movie.toRAW());
  }
}
