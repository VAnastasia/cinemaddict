export default class CommentModel {
  constructor(data) {
    this.id = data[`id`];
    this.author = data[`author`];
    this.emotion = data[`emotion`];
    this.date = data[`date`];
    this.comment = data[`comment`];
  }

  static parseComment(data) {
    return new CommentModel(data);
  }

  static parseComments(data) {
    return data.map(CommentModel.parseComment);
  }
}
