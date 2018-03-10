var deck = [];

var mainDeck = new Deck('deck', false);
var played = new Deck('played', true);
var player = new Deck('player-one', true);
var bot = new Deck('bot', false);

window.onload = function () {
  resetDeck();
  distributeCards();
  bot.render();
  player.render();
}

function distributeCards() {
  for (var i = 0; i < 8; ++i) {
    player.addCard(deck.popRandomIndex());
    bot.addCard(deck.popRandomIndex());
  }
}

function Deck(elementId, isFacedUp, cardClasses = '') {
  this.deck = [];
  this.elementId = elementId;
  this.isFacedUp = isFacedUp;
  this.cardClasses = cardClasses;
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
  var classes = this.cardClasses;
  document.getElementById(this.elementId).innerHTML = `
    ${
      this.deck.map(function(card) {
        return `<div class="card ${classes} ${isFacedUp ? `playable card_${card}` : 'card_back'}"></div>`;
      }).join('\n')
    }
  `;
}

Deck.prototype.addCard = function (card) {
  this.deck.push(card);
}


function resetDeck() {
  deck = createCardsArray();
  deck.forEach(function (card) {
    mainDeck.addCard(card);
  });
  mainDeck.render();
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
    arr.push(callback(this[i]));
  }
  return arr;
}