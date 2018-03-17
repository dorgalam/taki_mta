let mainDeck = new Deck('deck', false, true);
let pile = new Deck('pile', true);
let player = new Deck('player-one', true);
let bot = new Deck('bot', false);
let p1stats = new Stats('p1-stats', true);
let botstats = new Stats('bot-stats', false);

const FACED_UP = true;

const FACED_DOWN = false;

window.onload = function () {
  resetDeck();
  distributeCards();
  bot.render();
  player.render();
  mainDeck.render();
  setInterval(() => {
    addCardToPile(mainDeck.popCard());
    mainDeck.render();
  }, 500);
}

function Stats(elementId, isplayer) {
  this.turns = 0;
  if (isplayer) {
    this.timepass = 0;
    this.turnstime = [];
  }
}

function distributeCards() {
  for (let i = 0; i < 8; ++i) {
    player.addCard(mainDeck.popCard());
    bot.addCard(mainDeck.popCard());
  }
}

function Deck(elementId, isFacedUp, isStack = false) {
  this.deck = [];
  this.elementId = elementId;
  this.isFacedUp = isFacedUp;
  this.isStack = isStack;
}


function isPlayAble(card) {
  let name = card.split('_');
  let cardNum = Number(name[0]);
  let color = name[1];
  if (isNaN(cardNum)) {
    return true; // card is not
  }
}

Deck.prototype.render = function () {
  let isFacedUp = this.isFacedUp;
  let isStack = this.isStack;
  document.getElementById(this.elementId).innerHTML = `
    ${
      this.deck.map(function(card, index) {
        return `
          <div 
            ${isStack ? `style="margin: ${index / 3}px ${index / 3}px"` : ''} 
            class="card ${isFacedUp ? `playable card_${card}` : 'card_back'}">
          </div>
        `;
      }).join('\n')
    }
  `;
}

Deck.prototype.addCard = function (card) {
  this.deck.push(card);
}

Deck.prototype.popCard = function () {
  return this.deck.popRandomIndex();
}

function addCardToPile(card) {
  pile.addCard(card);
  document.getElementById(pile.elementId).innerHTML = `
   ${document.getElementById(pile.elementId).innerHTML}
    <div class="card card_${card}" 
      style="transform: rotate(${-60 + Math.floor(Math.random() * 120)}deg); 
      margin: ${Math.floor(Math.random() * 40)}px ${Math.floor(Math.random() * 40)}px ${Math.floor(Math.random() * 40)}px ${Math.floor(Math.random() * 40)}px "">
    </div>
  `;
}

function resetDeck() {
  deck = createCardsArray();
  deck.forEach(function (card) {
    mainDeck.addCard(card);
  });
}

function createCardsArray() {
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

function getRandom(max) {
  return Math.floor(Math.random() * max);
}

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

Array.prototype.map = function (callback) {
  let arr = [];
  for (let i = 0; i < this.length; i++) {
    arr.push(callback(this[i], i));
  }
  return arr;
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

new Card(name, CSSUtils.getFacedUpStyles())


class Card {
  constructor(name,classes = '', styles = '', attributes ='') {
    const splitName = name.split('_');
    this.name = name;
    this.color = splitName[0];
    this.number = splitName[1];
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

  setClickable(index){
    this.cardIndex = index;
  }

  removeClickable(){
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
    return `
      <div>
        ${
          this.cards.map(card => card.getHtml(FACED_UP)).join('\n')
        }
      </div>
    `;
  }

  addCard(card) {
    let style = this.isStack ? CSSUtils.getMainDeckStyle : '';
    if(this.elementId == "pile")
      style = CSSUtils.getPileStyles;
    let classes = style ? '' : CSSUtils.getPlayerClasses(this.isFacedUp,card);
    this.deck.push(new Card(card,classes,style));
  }

  removeCard(index){
    this.deck.splice(index,1);
  }

  popCard(){//only on the main deck
    if(this.elementId == "mainDeck")
      this.deck.popRandomIndex();
  }

  getCard(index){
    return this.deck[index];
  }

  getPlayableIndexes(){
    let indexes;
    this.deck.forEach((cardElem, index) => {
    if(isPlayableCard(card,cardElem))
      indexes.push(index);
    });
    return indexes;
  }

  isPlayableCard(card,cardElem){
    return (card.color === cardElem.color || card.number === cardElem.number || cardElem.color === "colorful");
  }

}

document.handleCardClick = index => player.playCard(index)


[1, 2, 3].map(item => {
  return item * s;
})


const CSSUtils = {
  getMainDeckStyle: (index) => `margin: ${index / 3}px ${index / 3}px`,
  getPileStyles: () => `transform: rotate(${-60 + Math.floor(Math.random() * 120)}deg); margin: ${Math.floor(Math.random() * 40)}px ${Math.floor(Math.random() * 40)}px ${Math.floor(Math.random() * 40)}px ${Math.floor(Math.random() * 40)}px`,
  getPlayerClasses: (isFacedUp,card) => `card ${isFacedUp ? `playable card_${card}` : 'card_back'}`

}

CSSUtils.getFacedUpStyles()

class Player {
  constructor(deck) {
    this.playableIndexes =[];
    this.deck = deck;
  }

  getPlayableDeck(card) {
    this.playableIndexes = this.deck.getPlayableIndexes(card);
  }

  playCard(index) {
    if(this.playableIndexes.includes(index)){
      const card = this.deck.getCard(index);
      this.deck.removeCard(index);
      this.playableIndexes = this.playableIndexes.filter((item, i) => i !== index);
      return card;
    }
    else
      return false;
  }
}

class Game{
  constructor(){
    this.mainDeck = new Deck('deck');
    this.pile = new Deck('pile');
    this.player = new Player('player-one');
    this.bot = new Player('bot');
  }

  startGame(){

  }
}