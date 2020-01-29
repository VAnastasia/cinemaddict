export default class CommentModel {
  constructor(comment) {
    this.id = comment[`id`];
    this.author = comment[`author`];
    this.emotion = comment[`emotion`];
    this.date = comment[`date`];
    this.comment = comment[`comment`];
  }

  static parseComment(comment) {
    return new CommentModel(comment);
  }

  static parseComments(comment) {
    return comment.map(CommentModel.parseComment);
  }
}
