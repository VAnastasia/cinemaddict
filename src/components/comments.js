import AbstractSmartComponent from "./abstract-smart-component";
import moment from "moment";

const createCommentsTemplate = (comments) => {
  return (
    `<section class="film-details__comments-wrap">
       <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

      <ul class="film-details__comments-list">
      ${comments.slice().sort((a, b) => moment(b.date).diff(a.date)).map((it) => {
      return (`<li class="film-details__comment">
          <span class="film-details__comment-emoji">
            <img src="./images/emoji/${it.emotion}.png" width="55" height="55" alt="emoji">
          </span>
          <div>
            <p class="film-details__comment-text">${it.comment}</p>
            <p class="film-details__comment-info">
              <span class="film-details__comment-author">${it.author}</span>
              <span class="film-details__comment-day">${moment(it.date).format(`YYYY/MM/DD HH:MM`)}</span>
              <button class="film-details__comment-delete" data-id="${it.id}">Delete</button>
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
          <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="sleeping">
          <label class="film-details__emoji-label" for="emoji-smile">
            <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
          </label>

          <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="neutral-face">
          <label class="film-details__emoji-label" for="emoji-sleeping">
            <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
          </label>

          <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-gpuke" value="grinning">
          <label class="film-details__emoji-label" for="emoji-gpuke">
            <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
          </label>

          <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="grinning">
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
  }

  getTemplate() {
    return createCommentsTemplate(this._comments);
  }

  setDeleteClickHandler(handler) {
    const buttons = this.getElement().querySelectorAll(`.film-details__comment-delete`);
    if (buttons.length > 0) {
      buttons.forEach((button) => {
        button.addEventListener(`click`, handler);
      });
    }
  }
}
