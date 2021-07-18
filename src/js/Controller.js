import Sortable from './Sortable';

export default class Controller {
  constructor(elem) {
    if (typeof elem === 'string') {
      // eslint-disable-next-line no-param-reassign
      elem = document.querySelector(elem);
    }
    this.element = elem;
    this.sortable = new Sortable();
    this.lists = this.element.querySelectorAll('.list-wrapper');
    this.cards = this.element.querySelectorAll('.list-cards-card');

    this.addItem = this.addItem.bind(this);
    this.showForm = this.showForm.bind(this);
    this.cancel = this.cancel.bind(this);
    this.removeCard = this.removeCard.bind(this);
    this.clickControll = this.clickControll.bind(this);
    this.showCansel = this.showCansel.bind(this);
    this.hiddenCansel = this.hiddenCansel.bind(this);
    this.getTasksObj = this.getTasksObj.bind(this);

    this.fromLocalStorage = this.fromLocalStorage.bind(this);
    this.toLocalStorage = this.toLocalStorage.bind(this);

    this.onStartDrag = this.sortable.onStartDrag.bind(this);
    this.onFinishDrag = this.sortable.onFinishDrag.bind(this);
    this.onStopDrag = this.sortable.onStopDrag.bind(this);
    this.onDrag = this.sortable.onDrag.bind(this);
    this.returnToInitialPlace = this.sortable.returnToInitialPlace.bind(this);
  }

  bindToDOM() {
    document.addEventListener('DOMContentLoaded', this.fromLocalStorage);
    window.addEventListener('beforeunload', this.toLocalStorage);

    this.renderingItem();

    this.lists.forEach((el) => el.addEventListener('click', this.clickControll));
    this.lists.forEach((el) => el.addEventListener('mouseover', this.showCansel));
    this.element.addEventListener('mousedown', this.onStartDrag);
  }

  clickControll(event) {
    const { target } = event;

    if (target.closest('.card-composer')) {
      this.showForm(event);
      return;
    }
    if (target.classList.contains('list-cards-card-remove')) {
      this.removeCard(event);
    }
  }

  showCansel(event) {
    const card = event.target.closest('.list-cards-card');
    if (!card) return;
    const cardCansel = card.querySelector('.list-cards-card-remove');
    cardCansel.classList.remove('hidden');
    card.addEventListener('mouseout', this.hiddenCansel);
  }

  hiddenCansel(event) {
    const card = event.target;
    const cardCansel = card.querySelector('.list-cards-card-remove');
    if (!cardCansel) return;
    cardCansel.classList.add('hidden');
    card.removeEventListener('mouseout', this.hiddenCansel);
  }

  showForm(event) {
    const wrapper = event.target.closest('.list-wrapper');
    const form = wrapper.querySelector('.card-composer-form');
    const cardComposer = wrapper.querySelector('.card-composer');

    cardComposer.classList.add('hidden');
    form.classList.remove('hidden');

    const cancel = form.querySelector('.card-composer-form-cancel');
    const addCardButton = form.querySelector('.card-composer-form-button');

    addCardButton.addEventListener('click', this.addItem);
    cancel.addEventListener('click', this.cancel);
  }

  cancel(event) {
    const wrapper = event.target.closest('.list-wrapper');
    const form = wrapper.querySelector('.card-composer-form');
    const cardComposer = wrapper.querySelector('.card-composer');
    const addCardButton = form.querySelector('.card-composer-form-button');
    cardComposer.classList.remove('hidden');
    form.classList.add('hidden');
    addCardButton.removeEventListener('click', this.addItem);
  }

  getHTML(text) {
    this.text = text;
    return `
       <li class="list-cards-card">${this.text}
         <span class="list-cards-card-remove hidden"></span></li>
     `;
  }

  addItem(event) {
    event.preventDefault();
    const wrapper = event.target.closest('.list-wrapper');
    const textArea = wrapper.querySelector('.card-composer-form-textarea');

    if (textArea.value === '') {
      this.cancel(event);
      return;
    }
    const newCard = this.getHTML(textArea.value);
    const listCards = wrapper.querySelector('.list-cards');
    listCards.innerHTML += newCard;
    textArea.value = '';
    this.cancel(event);
    this.getTasksObj();
  }

  removeCard(event) {
    this.card = event.target.parentElement;
    this.card.remove();
  }

  renderingItem() {
    const lists = this.element.querySelectorAll('.list-cards');
    lists.forEach((element) => {
      const wrapper = element.closest('.list-wrapper');
      const name = wrapper.querySelector('.list-header').innerText;
      const tasks = this.cards[name];
      if (!tasks) return;
      tasks.forEach((text) => {
        const card = this.getHTML(text);
        // eslint-disable-next-line no-param-reassign
        element.innerHTML += card;
      });
    });
  }

  fromLocalStorage() {
    if (localStorage.cards) {
      this.cards = JSON.parse(localStorage.getItem('cards'));
      this.renderingItem();
    }
  }

  getTasksObj() {
    const cardsList = {};
    const lists = this.element.querySelectorAll('.list-cards');

    lists.forEach((element) => {
      const cards = [...element.querySelectorAll('.list-cards-card')];
      const wrapper = element.closest('.list-wrapper');
      const name = wrapper.querySelector('.list-header').innerText;
      const list = [];

      cards.forEach((el) => {
        list.push(el.innerText);
      });
      cardsList[name] = list;
    });
    return cardsList;
  }

  toLocalStorage() {
    const tasks = this.getTasksObj();
    localStorage.setItem('cards', JSON.stringify(tasks));
  }
}
