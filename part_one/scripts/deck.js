class Card {
  constructor(name, classes = "", styles = "", attributes = "", origName = "") {
    const splitName = name.split("_");
    this.name = name;
    this.number = splitName[0];
    this.color = splitName[1];
    this.styles = styles;
    this.cardClasses = classes;
    this.cardIndex = -1;
    this.original = origName === "" ? name : origName;
  }

  getName() {
    // useless?
    return this.name;
  }

  getHtml(index) {
    return `
    <div
      id="card_number_${index}"
      style="${this.styles}"
      class="${this.cardClasses} ${
      (this.cardIndex > -1 || this.cardIndex === -2) && this.number !== 'change' ? "playable" : ""
    }"
      ${
        this.cardIndex > -1 && this.number !== 'change'
          ? `onclick="handleCardClick(${this.cardIndex})"`
          : ""
      }
      ${this.cardIndex === -2 ? `onclick="takeCard(${this.cardIndex})"` : ""}>
      ${this.number === 'change' ? this.getChangeColorTooltipHtml(this.cardIndex) : ''}
    </div>
    `;
  }

  getChangeColorTooltipHtml(index) {
    return `
      <div class="color_tooltip">
        <div onClick="selectColor('red', ${index})" class="color_tooltip_red"></div>
        <div onClick="selectColor('yellow', ${index})" class="color_tooltip_yellow"></div>
        <div onClick="selectColor('blue', ${index})" class="color_tooltip_blue"></div>
        <div onClick="selectColor('green', ${index})" class="color_tooltip_green"></div>
      </div>
    `;
  }

  setClickable(index) {
    this.cardIndex = index;
  }

  removeClickable() {
    this.cardIndex = -1;
  }
}

class Deck {
  constructor(elementId, isFacedUp, isStack = false) {
    this.deck = [];
    this.elementId = elementId;
    this.isFacedUp = isFacedUp;
    this.isStack = isStack;
  }

  getDeck() {
    return this.deck;
  }

  getDeckHtml() {
    return `
        <div class="cards">
          ${this.deck.map((card, i) => card.getHtml(i)).join("\n")}
        </div>
      `;
  }

  setDeck(cards) {
    cards.forEach((card, index) => this.addCard(card, index));
  }

  shuffle() {
    // demonstrate human shuffle
    const times = 5 + Math.floor(Math.random() * 15);
    for (let i = 0; i < times; ++i) {
      const cardsToRemove = Math.floor(Math.random() * this.deck.length / 2);
      let up = Math.floor(Math.random() * 2);
      const portions = [
        this.deck.slice(0, cardsToRemove / 2 + 1),
        this.deck.slice(
          cardsToRemove / 2 + 1,
          cardsToRemove / 2 + 1 + cardsToRemove
        ),
        this.deck.slice(cardsToRemove / 2 + cardsToRemove + 1)
      ];
      if (up) {
        this.deck = []
          .concat(portions[1])
          .concat(portions[0])
          .concat(portions[2]);
      } else {
        this.deck = []
          .concat(portions[0])
          .concat(portions[2])
          .concat(portions[1]);
      }
    }
  }

  addCard(card, index, origName) {
    let style = this.isStack ? CSSUtils.getMainDeckStyle(index) : "";
    if (this.elementId === "pile") style = CSSUtils.getPileStyles();
    let classes = CSSUtils.getPlayerClasses(this.isFacedUp, card);
    style = style ? style : CSSUtils.getPlayerStyle(this.isFacedUp, index);
    this.deck.push(new Card(card, classes, style, "", origName));
  }

  removeCard(index) {
    return this.deck.filter((item, i) => i !== index);
  }

  popRandomCard() {
    return this.deck.popRandomIndex().getName();
  }

  pushCardToStart(card) {
    return this.deck.unshift(card);
  }

  popCard() {
    return this.deck.pop().getName();
  }

  isLastOne() {
    return this.deck.length === 1;
  }

  getCard(index) {
    return this.deck[index];
  }

  getPlayableIndexes(card, active, taki) {
    let indexes = [];
    this.deck.forEach((cardElem, index) => {
      if (this.isPlayableCard(card, cardElem, active, taki))
        indexes.push(index);
    });
    return indexes;
  }

  isPlayableCard(card, cardElem, active, taki) {
    //need to check on taki
    if (active && taki) {
      return card.color === cardElem.color;
    }
    if (active && card.number === "2plus") return cardElem.number === "2plus";
    return (
      card.color === cardElem.color ||
      card.number === cardElem.number ||
      cardElem.color === "colorful"
    );
  }

  setLastCardClickable() {
    if (this.deck.length !== 0) this.deck[this.deck.length - 1].cardIndex = -2;
  }

  setLastCardUnClickable() {
    if (this.deck.length !== 0) this.deck[this.deck.length - 1].cardIndex = -1;
  }
}

const CSSUtils = {
  getMainDeckStyle: index => `margin: ${index / 3}px ${index / 3}px `,
  getPileStyles: () =>
    `transform: rotate(${-60 +
      Math.floor(Math.random() * 120)}deg); margin: ${Math.floor(
      Math.random() * 40
    )}px ${Math.floor(Math.random() * 40)}px ${Math.floor(
      Math.random() * 40
    )}px ${Math.floor(Math.random() * 40)}px`,
  getPlayerClasses: (isFacedUp, card) =>
    `card ${isFacedUp ? `card_${card}` : "card_back"} `,
  getPlayerStyle: (isFacedUp, index) => ``
};
