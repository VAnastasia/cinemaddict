import AbstractSmartComponent from "./abstract-smart-component";
import moment from "moment";
import he from "he";

const createCommentsTemplate = (comments) => {
  return (
    `<section class="film-details__comments-wrap">
       <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

      <ul class="film-details__comments-list">
      ${comments.slice().sort((a, b) => moment(b.date).diff(a.date)).map(({emotion, comment, author, date, id}) => {
      return (`<li class="film-details__comment">
          <span class="film-details__comment-emoji">
            <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji">
          </span>
          <div>
            <p class="film-details__comment-text">${he.encode(comment)}</p>
            <p class="film-details__comment-info">
              <span class="film-details__comment-author">${author}</span>
              <span class="film-details__comment-day">${moment(date).fromNow()}</span>
              <button class="film-details__comment-delete" data-id="${id}">Delete</button>
            </p>
          </div>
        </li>`);
    }).join(``)}
      </ul>

      <div class="film-details__new-comment">
        <div for="add-emoji" class="film-details__add-emoji-label"></div>

        <label class="film-details__comment-label">
          <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
        </label>

        <div class="film-details__emoji-list">
          <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
          <label class="film-details__emoji-label" for="emoji-smile">
            <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
          </label>

          <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
          <label class="film-details__emoji-label" for="emoji-sleeping">
            <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
          </label>

          <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-gpuke" value="puke">
          <label class="film-details__emoji-label" for="emoji-gpuke">
            <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
          </label>

          <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
          <label class="film-details__emoji-label" for="emoji-angry">
            <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
          </label>
        </div>
      </div>
    </section>`
  );
};


export default class CommentsComponent extends AbstractSmartComponent {
  constructor(comments) {
    super();
    this._comments = comments;
    this.setDeleteClickHandler();
    this.setSendCommentHandler();
  }

  getTemplate() {
    return createCommentsTemplate(this._comments, this._isDeleting);
  }

  setSendCommentHandler(handler) {
    const newComment = this.getElement().querySelector(`.film-details__new-comment`);
    if (newComment) {
      newComment.addEventListener(`keydown`, handler);
    }
  }

  setDeleteClickHandler(handler) {
    const buttons = this.getElement().querySelectorAll(`.film-details__comment-delete`);
    if (buttons.length > 0) {
      buttons.forEach((button) => {
        button.addEventListener(`click`, handler);
      });
    }
  }

  setData(id) {
    const buttonDelete = this.getElement().querySelector(`[data-id="${id}"]`);
    buttonDelete.textContent = `Deleting...`;
  }
}
