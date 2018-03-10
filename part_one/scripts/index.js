

var mainDeck = new Deck('deck', false, true);
var pile = new Deck('pile', true);
var player = new Deck('player-one', true);
var bot = new Deck('bot', false);

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

Deck.prototype.popCard = function() {
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