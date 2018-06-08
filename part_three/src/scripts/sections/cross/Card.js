class Card {
  constructor(card, orig = '') {
    this.name = card;
    const [number, color] = card.split('_');
    this.number = number;
    this.color = color;
    this.card = orig === '' ? JSON.stringify(card) : JSON.stringify(orig);
    this.card = JSON.parse(this.card);
  }
}

export default Card;
