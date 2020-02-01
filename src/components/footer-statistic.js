import AbstractComponent from "./abstract-component";

const createFooterStatisticTemplate = (amount) => {
  return `<section class="footer__statistics">
    <p>${amount} movies inside</p>
  </section>`;
};

export default class FooterStatistic extends AbstractComponent {
  constructor(amount) {
    super();
    this._amount = amount;
  }

  getTemplate() {
    return createFooterStatisticTemplate(this._amount);
  }
}
