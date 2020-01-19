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

    // {
    //   id: data[`id`],
    //   author: data[`author`],
    //   emotion: data[`emotion`],
    //   date: data[`date`]
    // };
  }

  static parseComments(data) {
    return data.map(CommentModel.parseComment);
  }
}
