const FACED_UP = true;

const FACED_DOWN = false;

const STACK = false;

// function Stats(elementId, isplayer) {
//   this.turns = 0;
//   if (isplayer) {
//     this.timepass = 0;
//     this.turnstime = [];
//   }
// }


// function wDeck(elementId, isFacedUp, isStack = false) {
//   this.deck = [];
//   this.elementId = elementId;
//   this.isFacedUp = isFacedUp;
//   this.isStack = isStack;
// }


// function isPlayAble(card) {
//   let name = card.split('_');
//   let cardNum = Number(name[0]);
//   let color = name[1];
//   if (isNaN(cardNum)) {
//     return true; // card is not
//   }
// }

// Deck.prototype.render = function () {
//   let isFacedUp = this.isFacedUp;
//   let isStack = this.isStack;
//   document.getElementById(this.elementId).innerHTML = `
//     ${
//       this.deck.map(function(card, index) {
//         return `
//           <div 
//             ${isStack ? `style="margin: ${index / 3}px ${index / 3}px"` : ''} 
//             class="card ${isFacedUp ? `playable card_${card}` : 'card_back'}">
//           </div>
//         `;
//       }).join('\n')
//     }
//   `;
// }

// Deck.prototype.addCard = function (card) {
//   this.deck.push(card);
// }

// Deck.prototype.popRandom = function () {
//   return this.deck.popRandomIndex();
// }

// function addCardToPile(card) {
//   pile.addCard(card);
//   document.getElementById(pile.elementId).innerHTML = `
//    ${document.getElementById(pile.elementId).innerHTML}
//     <div class="card card_${card}" 
//       style="transform: rotate(${-60 + Math.floor(Math.random() * 120)}deg); 
//       margin: ${Math.floor(Math.random() * 40)}px ${Math.floor(Math.random() * 40)}px ${Math.floor(Math.random() * 40)}px ${Math.floor(Math.random() * 40)}px "">
//     </div>
//   `;
// }

// function resetDeck() {
//   deck = createCardsArray();
//   deck.forEach(function (card) {
//     mainDeck.addCard(card);
//   });
// }


// function getRandom(max) {
//   return Math.floor(Math.random() * max);
// }

Array.prototype.popIndex = function (index) {
  if (index < 0 || index >= this.length) {
    throw new Error();
  }
  let item = this[index];
  let write = 0;
  for (let i = 0; i < this.length; i++) {
    if (index !== i) {
      this[write++] = this[i];
    }
  }
  this.length--;
  return item;
}

Array.prototype.popRandomIndex = function () {
  let rand = Math.floor(Math.random() * this.length);
  return this.popIndex(rand);
}

function chooseCard(card, active) { //the comp well aware of the cards he has (this.cards)
  let cardArr = card.split("_");
  let number = cardArr[0];
  let color = cardArr[1];

  if (number == "2plus" && active)
    return has2plus(); // options: card name, false (take a card from the pile)
  let colorCount = getColorCount(color); // count number of cards with this color
  let numberCount = getNumberCount(number); // count number of cards with this number
  let plus = getPlusColor(color);
  let stop = getStopColor(color);
  let taki = getTakiColor(color); //check for taki in this color

  if (active && specialCard(number))
    return handleSpecial(color, number);
  if (taki && colorCount > 1)
    return taki;
  if (stop && (colorCount > 1 || otherColorStop(color)))
    return stop;
  if (plus && (colorCount > 1 || otherColorPlus(color)))
    return plus;
  if (colorCount > 0)
    return selectColorCard(color); //select the best card with my color (has two of the same number)
  if (numberCount > 0)
    return selectNumberCard(number); //select the best card with my number (has two of the same color)
  return hasChangeColor(); // true = best color for me , false = take a card from the pile
}

function handleSpecial(color, type) {
  let colorCount = getColorCount(color); // count number of cards with this color
  let numberCount = getNumberCount(type); // count number of cards with this number
  if (type == "taki") { // handle taki
    if (numberCount > 0) {
      return allCard(color);
    }
  }
  let res = hasSameCard(color, type);
  if (res)
    return res;
  let otherType = getTypeOtherColor(type);
  if (otherType && colorCount > 1)
    return otherType;
  if (numberCount > 0) {
    return selectNumberCard(color);
  }
}

const render = (innerHTML, elementId) => document.getElementById(elementId).innerHTML = innerHTML;

class Card {
  constructor(name, classes = '', styles = '', attributes = '') {
    const splitName = name.split('_');
    this.name = name;
    this.number = splitName[0];
    this.color = splitName[1];
    this.styles = styles;
    this.cardClasses = classes;
    this.cardIndex = -1;
  }

  getHtml() {
    return `
    <div 
      style="${this.styles}"
      class="${this.cardClasses}"
      ${this.cardIndex > -1 ? `onclick="handleCardClick(${this.cardIndex})"` : ''}
    </div>
    `;
  }

  setClasses(classes) {
    this.cardClasses = classes;
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

  getHtml() {
    console.log('called');
    return `
      <div class="cards">
        ${
          this.deck.map(card => card.getHtml(FACED_UP)).join('\n')
        }
      </div>
    `;
  }

  setDeck(cards) {
    cards.forEach(card => this.addCard(card));
  }

  shuffle() {
    const times = 5 + Math.floor(Math.random() * 10);
    for (let i = 0; i < times; ++i) {
      const cardsToRemove = Math.floor(Math.random() * this.deck.length);
      let up = Math.floor(Math.random() * 2);
      const portions = [
        this.deck.slice(0, cardsToRemove / 2),
        this.deck.slice(cardsToRemove / 2 + 1, cardsToRemove / 2 + 1 + cardsToRemove),
        this.deck.slice(cardsToRemove / 2 + 1 + cardsToRemove + 1)
      ];
      if (up) {
        this.deck = [].concat(portions[0]).concat(portions[2]).concat(portions[1]);
      } else {
        this.deck = [].concat(portions[1]).concat(portions[0]).concat(portions[2]);
      }
    }
  }

  addCard(card) {
    let style = this.isStack ? CSSUtils.getMainDeckStyle : '';
    if (this.elementId == "pile")
      style = CSSUtils.getPileStyles;
    let classes = style ? '' : CSSUtils.getPlayerClasses(this.isFacedUp, card);
    this.deck.push(new Card(card, classes, style));
  }

  removeCard(index) {
    return this.deck.filter((item, i) => i !== index);
  }

  popRandomCard() {
    return this.deck.popRandomIndex();
  }

  popCard() {
    return this.deck.pop().name;
  }

  getCard(index) {
    return this.deck[index];
  }

  getPlayableIndexes() {
    let indexes;
    this.deck.forEach((cardElem, index) => {
      if (isPlayableCard(card, cardElem))
        indexes.push(index);
    });
    return indexes;
  }

  isPlayableCard(card, cardElem) {
    return (card.color === cardElem.color || card.number === cardElem.number || cardElem.color === "colorful");
  }

}

document.handleCardClick = index => player.playCard(index)


const CSSUtils = {
  getMainDeckStyle: (index) => `margin: ${index / 3}px ${index / 3}px`,
  getPileStyles: () => `transform: rotate(${-60 + Math.floor(Math.random() * 120)}deg); margin: ${Math.floor(Math.random() * 40)}px ${Math.floor(Math.random() * 40)}px ${Math.floor(Math.random() * 40)}px ${Math.floor(Math.random() * 40)}px`,
  getPlayerClasses: (isFacedUp, card) => `card ${isFacedUp ? `playable card_${card}` : 'card_back'}`

}

class Player {
  constructor(deck) {
    this.playableIndexes = [];
    this.deck = new Deck(deck, false);
  }

  getPlayableDeck(card) {
    this.playableIndexes = this.deck.getPlayableIndexes(card);
  }

  playCard(index) {
    if (this.playableIndexes.includes(index)) {
      const card = this.deck.getCard(index);
      this.deck.removeCard(index);
      this.playableIndexes = this.playableIndexes.filter((item, i) => i !== index);
      return card;
    } else
      return false;
  }

  addCard(card) {
    this.deck.addCard(card);
    console.log(this.deck);
  }

  getHtml() {
    return this.deck.getHtml();
  }
}

class Game {

  start() {
    this.createDataMembers();
    this.mainDeck.setDeck(this.createCardsArray());
    this.distributeCards();
    this.renderAll();
  }

  renderAll() {
    render(this.mainDeck.getHtml(), 'deck');
    render(this.pile.getHtml(), 'pile');
    render(this.player.getHtml(), 'player');
    render(this.bot.getHtml(), 'bot');
  }

  createDataMembers() {
    this.mainDeck = new Deck('deck', FACED_DOWN, STACK);
    this.pile = new Deck('pile', FACED_UP);
    this.player = new Player();
    this.bot = new Player();
  }

  createCardsArray() {
    let cards = ['1', '2plus', '3', '4', '5', '6', '7', '8', '9', 'taki', 'stop', 'plus'];
    let colors = ['red', 'blue', 'green', 'yellow'];
    let arr = [];
    let card;
    cards.forEach(function (number) {
      colors.forEach(function (color) {
        card = String(number) + '_' + color;
        arr.push(card);
        arr.push(card);
      })
    });
    colors.forEach(function (color) {
      arr.push('change_colorful');
    })
    arr.push('taki_colorful');
    arr.push('taki_colorful');
    return arr;
  }

  distributeCards() {
    this.mainDeck.shuffle();
    for (let i = 0; i < 8; ++i) {
      this.player.addCard(this.mainDeck.popCard());
      this.bot.addCard(this.mainDeck.popCard());
    }
    this.pile.addCard(this.mainDeck.popCard());
  }
}


window.onload = function () {
  const game = new Game();
  game.start();
}