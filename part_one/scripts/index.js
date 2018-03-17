var mainDeck = new Deck('deck', false, true);
var pile = new Deck('pile', true);
var player = new Deck('player-one', true);
var bot = new Deck('bot', false);
var p1stats = new Stats('p1-stats', true);
var botstats = new Stats('bot-stats', false);

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
  for (var i = 0; i < 8; ++i) {
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
  var name = card.split('_');
  var cardNum = Number(name[0]);
  var color = name[1];
  if (isNaN(cardNum)) {
    return true; // card is not
  }
}

Deck.prototype.render = function () {
  var isFacedUp = this.isFacedUp;
  var isStack = this.isStack;
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
  var cards = ['1', '2plus', '3', '4', '5', '6', '7', '8', '9', 'taki', 'stop', 'plus'];
  var colors = ['red', 'blue', 'green', 'yellow'];
  var arr = [];
  var card;
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
  var item = this[index];
  var write = 0;
  for (var i = 0; i < this.length; i++) {
    if (index !== i) {
      this[write++] = this[i];
    }
  }
  this.length--;
  return item;
}

Array.prototype.popRandomIndex = function () {
  var rand = Math.floor(Math.random() * this.length);
  return this.popIndex(rand);
}

Array.prototype.map = function (callback) {
  var arr = [];
  for (var i = 0; i < this.length; i++) {
    arr.push(callback(this[i], i));
  }
  return arr;
}

function chooseCard(card, active) { //the comp well aware of the cards he has (this.cards)
  var cardArr = card.split("_");
  var number = cardArr[0];
  var color = cardArr[1];

  if (number == "2plus" && active)
    return has2plus(); // options: card name, false (take a card from the pile)
  var colorCount = getColorCount(color); // count number of cards with this color
  var numberCount = getNumberCount(number); // count number of cards with this number
  var plus = getPlusColor(color);
  var stop = getStopColor(color);
  var taki = getTakiColor(color); //check for taki in this color

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
  var colorCount = getColorCount(color); // count number of cards with this color
  var numberCount = getNumberCount(type); // count number of cards with this number
  if (type == "taki") { // handle taki
    if (numberCount > 0) {
      return allCard(color);
    }
  }
  var res = hasSameCard(color, type);
  if (res)
    return res;
  var otherType = getTypeOtherColor(type);
  if (otherType && colorCount > 1)
    return otherType;
  if (numberCount > 0) {
    return selectNumberCard(color);
  }
  /*if(number == "plus" && active){ // handle plus
    if(plus)
      return plus;
    var otherplus = getPlus();
    if(otherplus && getColorCount(otherplus.color) > 1)
      return otherplus;
    if(numberCount > 0){
      return numberCard(color);
    }
  }*/
}

new Card(name, CSSUtils.getFacedUpStyles())


class Card {
  constructor(name) {
    const splitName = name.split('_');
    this.name = name;
    this.color = splitName[0];
    this.number = splitName[1];
  }

  getHtml(faceUp) {
    return `
    <div 
      style="${this.styles}"
      class="${this.cardClasses}"
    </div>
    `;
  }
  
  setClasses(classes) {
    this.cardClasses = classes;
  }
}

class Deck {
  constructor(cards) {
    this.cards = cards;

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
}


[1, 2, 3].map(item => {
  return item * s;
})


const CSSUtils = {
  getFacedUpStyles: () => {

  }
}

CSSUtils.getFacedUpStyles()