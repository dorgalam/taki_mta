var deck = [];

var player = new Player('player-one', true);
var bot = new Player('bot', false);

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

function Player(elementId, isFacedUp) {
  this.deck = [];
  this.elementId = elementId;
  this.isFacedUp = isFacedUp;
}

Player.prototype.render = function () {
  var isFacedUp = this.isFacedUp;
  document.getElementById(this.elementId).innerHTML = `
    ${
      this.deck.map(function(card) {
        return `<div class="card ${isFacedUp ? `card_${card}` : 'card_back'}"></div>`;
      }).join('\n')
    }
  `;
}

Player.prototype.addCard = function (card) {
  this.deck.push(card);
}


function resetDeck() {
  deck = [
    '1_blue',
    '1_blue',
    '1_red',
    '1_yellow',
    '2plus_blue',
    '2plus_green',
    '2plus_red',
    '2plus_yellow',
    '3_blue',
    '3_green',
    '3_red',
    '3_yellow',
    '4_blue',
    '4_green',
    '4_red',
    '4_yellow',
    '5_blue',
    '5_green',
    '5_red',
    '5_yellow',
    '6_blue',
    '6_green',
    '6_red',
    '6_yellow',
    '7_blue',
    '7_green',
    '7_red',
    '7_yellow',
    '8_blue',
    '8_green',
    '8_red',
    '8_yellow',
    '9_blue',
    '9_green',
    '9_red',
    '9_yellow',
    'change_colorful',
    'plus_blue',
    'plus_green',
    'plus_red',
    'plus_yellow',
    'stop_blue',
    'stop_green',
    'stop_red',
    'stop_yellow',
    'taki_blue',
    'taki_colorful',
    'taki_green',
    'taki_red',
    'taki_yellow'
  ]
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

Array.prototype.map = function(callback) {
  var arr = [];
  for(var i = 0; i < this.length; i++) {
    arr.push(callback(this[i]));
  }
  return arr;
}