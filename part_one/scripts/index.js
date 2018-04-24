const FACED_UP = true;
const FACED_DOWN = false;
const ACTIVE = 1;
const NOTACTIVE = 0;
const PLAYER = 0;
const BOT = 1;
const NOTFINISH = -1;
const STACK = true;

Array.prototype.popIndex = function(index) {
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
};

Array.prototype.popRandomIndex = function() {
  let rand = Math.floor(Math.random() * this.length);
  return this.popIndex(rand);
};

const render = (innerHTML, elementId) =>
  (document.getElementById(elementId).innerHTML = innerHTML);

class Game {
  start() {
    this.taki = false;
    this.takinCount = 1;
    this.active = ACTIVE;
    this.turn = PLAYER;
    this.finished = false;
    this.createDataMembers();
    this.mainDeck.setDeck(this.createCardsArray());
    this.distributeCards();
    this.renderAll();
    this.switchToPlayerTurn();
  }

  playCard(index) {
    return this.player.playCard(index);
  }

  specialCard(card) {
    return this.bot.specialCard(card);
  }

  clearClickable() {
    this.player.removeCardsClickable();
    this.player.clearPlayable();
  }

  addCardToPile(card, origName = false) {
    const splitName = card.split("_");
    let number = splitName[0];
    if (number === "2plus") {
      this.takinCount = this.takinCount === 1 ? 0 : this.takinCount;
      this.takinCount += 2;
    }
    this.pile.addCard(card, false, origName);
    this.active = ACTIVE;
    this.renderAll();
  }

  switchToPlayerTurn() {
    this.renderAll();
    this.player.getPlayableIndexes(this.lastCard(), this.active, this.taki);
    this.player.setCardsClickable();
    if (this.player.hasNoPlay()&& !game.taki) this.mainDeck.setLastCardClickable();
    this.renderAll();
  }

  setLastCardUnClickable() {
    this.mainDeck.setLastCardUnClickable();
  }

  botPickColor() {
    let colorsArr = { red: 0, blue: 0, yellow: 0, green: 0, colorful: -5 };
    let cards = this.bot.deck.getDeck();
    cards.forEach(element => {
      colorsArr[element.color]++;
    });
    return Object.keys(colorsArr).reduce(function(a, b) {
      return colorsArr[a] > colorsArr[b] ? a : b;
    });
  }

  botTurn() {
    let lastCard = this.taki
      ? new Card("taki_" + this.lastCard().color)
      : this.lastCard();
    let card = this.bot.chooseCard(lastCard, this.active);
    this.bot.removeCardByCard(card);
    let orig = card.name;
    if (card.color === "colorful") {
      if (card.number === "taki") card.color = lastCard.color;
      else {
        card.number = "";
        card.color = this.botPickColor(card);
      }
      card.name = card.number + "_" + card.color;
    }
    return { card, orig };
  }

  renderAll() {
    render(this.mainDeck.getDeckHtml(), "deck");
    render(this.pile.getDeckHtml(), "pile");
    render(this.player.getHtml(), "player");
    render(this.bot.getHtml(), "bot");
    this.reduceImageNumber();
  }

  reduceImageNumber() {
    let c = document.getElementById('deck').children[0].children;
    let i;
    for (i = 0; i < c.length; i++) {
      if (i < c.length - 2) {
        c[i].classList.remove("card_back");
      }
    }
    c = document.getElementById('pile').children[0].children;
    for (i = 0; i < c.length; i++) {
      if (i < c.length - 15) {
        c[i].className = 'card';
      }
    }
  }

  createDataMembers() {
    this.mainDeck = new Deck("deck", FACED_DOWN, STACK);
    this.pile = new Deck("pile", FACED_UP);
    this.player = new Player("player", FACED_UP);
    this.bot = new Bot("bot", FACED_DOWN);
  }

  createCardsArray() {
    let cards = [
      "1",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "taki",
      "stop",
      "plus"
    ]; ///removed 2plus,taki_colorful
    let colors = ["red", "blue", "green", "yellow"];
    let arr = [];
    let card;
    cards.forEach(function(number) {
      colors.forEach(function(color) {
        card = String(number) + "_" + color;
        arr.push(card);
        arr.push(card);
      });
    });
    colors.forEach(function(color) {
      arr.push("change_colorful");
    });
    /// arr.push('taki_colorful');
    /// arr.push('taki_colorful');
    return arr;
  }

  distributeCards() {
    this.mainDeck.shuffle();
    for (let i = 0; i < 8; ++i) {
      this.player.addCard(this.mainDeck.popRandomCard(), i);
      this.bot.addCard(this.mainDeck.popRandomCard(), i);
    }
    let card, cardName;
    while ((cardName = this.mainDeck.popCard())) {
      card = new Card(cardName);
      if (!this.specialCard(card) && card.number !== "2plus") {
        this.pile.addCard(cardName);
        break;
      }
      this.mainDeck.pushCardToStart(card);
    }
  }

  getTurn() {
    return this.turn;
  }

  buildMainFromPile() {
    let cards = this.pile.getDeck();
    let lcard = this.lastCard();
    this.pile.deck = [];
    this.pile.deck.push(lcard);
    cards.pop();
    cards.forEach((element, index) => {
      this.mainDeck.addCard(element.original, index);
    });
    this.mainDeck.shuffle();
  }

  takeCardFromMainDeck(player) {
    this.active = NOTACTIVE;
    this.takinCount = 1;
    if (this.mainDeck.isTwoLeft()) {
      this.buildMainFromPile();
    }
    let cardName = this.mainDeck.popCard();
    if(!cardName){//end of deck
      return;
    }
    if (player === PLAYER) {
      document.getElementById("closeTaki").style.display = "none";
      this.player.addCard(cardName);
    } else {
      this.bot.addCard(cardName);
    }
  }

  pickColor(card) {
    document.getElementById("pickColor").style.display = "block";
  }

  takinNumber() {
    return this.takinCount;
  }

  openTaki() {
    this.taki = true;
    document.getElementById("turn-img").style.display = "none";
    document.getElementById("closeTaki").style.display = "block";
  }

  closeTaki() {
    this.taki = false;
    document.getElementById("turn-img").style.display = "block";
    document.getElementById("closeTaki").style.display = "none";
    if (
      this.lastCard().number !== "taki" &&
      this.specialCard(this.lastCard())
    ) {
      this.switchToPlayerTurn();
      return false;
    }
    return true;
  }

  lastCard() {
    return this.pile.getCard(this.pile.getDeck().length - 1);
  }

  getWinner() {
    if (this.player.won()) {
      return PLAYER;
    } else if (this.bot.won()) {
      return BOT;
    }
    return NOTFINISH;
  }
}

function gameOver() {
  let winner;
  if ((winner = game.getWinner()) !== NOTFINISH) {
    goToWinner(winner);
    return true;
  }
  return false;
}

function restart() {
  document.getElementById("bot-stats").style.display = "none"; ///for restart --
  document.getElementById("loser").style.display = "none";
  document.getElementById("celebrate").style.display = "none";
  document.getElementById("bot").style.display = "block";
  document.getElementById("player").style.display = "block";
  document.getElementById("pile").style.display = "block";
  document.getElementById("deck").style.display = "block";
  totalSeconds = 0; ///end of for restart
  lstTime = 0;
  startGame();
  renderStats();
}

function startGame() {
  game = new Game();
  document.getElementById("startGame").style.display = "none";
  document.getElementById("p1-stats").style.display = "block";
  document.getElementById("quit-button").disabled = false;
  document.getElementById("restart-button").disabled = true;
  document.getElementById("turn").style.display = "block";
  document.getElementById("pile").style.display = "block";

  game.start();
  timerVar = setInterval(countTimer, 1000);
}

function closeTaki() {
  document.getElementById("closeTaki").style.display = "none";
  if (game.closeTaki()) switchTurn(PLAYER, BOT);
  //doBotTurn();
}

function goToWinner(winner) {
  document.getElementById("bot-stats").style.display = "block";
  document.getElementById("quit-button").disabled = true;
  document.getElementById("restart-button").disabled = false;
  document.getElementById("bot").style.display = "none";
  document.getElementById("turn").style.display = "none";
  document.getElementById("player").style.display = "none";
  document.getElementById("deck").style.display = "none";
  document.getElementById("pile").style.display = "none";

  if (winner === PLAYER)
    document.getElementById("celebrate").style.display = "block";
  else document.getElementById("loser").style.display = "block";
  clearInterval(timerVar);
}

function selectColor(color, index) {
  let card = "_" + color;
  game.addCardToPile(card,"change_colorful");
  game.player.removeCardByIndex(index);
  game.renderAll();
  switchTurn(PLAYER, BOT);
}

function doBotTurn() {
  card = game.botTurn(); //get card from bot deck -- choosen by a smart algo
  if (card["card"]) {//legit card
    game.addCardToPile(card["card"].name, card["orig"]);
  } else {// didnt find suitable card ,if was taki turn - no need to take a card , else take cards (as needed maybe 2plus)
    if (!game.taki) {
      const count = game.takinNumber();
      for (let i = 0; i < count; i++) {
        game.takeCardFromMainDeck(BOT);
      }
    } else {//finish my taki turn
      game.taki = false;
      if (
        game.specialCard(game.lastCard()) &&
        game.lastCard().number !== "taki"
      ) {
        switchTurn(BOT, BOT); // check if last card was "stop" or "plus" need to get another turn
        return;
      }
    }
    switchTurn(BOT, PLAYER);
    return;
  }
  if (game.specialCard(card["card"])) {// do again bot turn(plus,stop,taki)
    if (card["card"].number === "taki") 
      game.taki = true;// taki flag on
    else 
      game.taki = false;
    switchTurn(BOT, BOT);
    return;
  } else if (game.taki) { // regular card but on taki - need to do bot turns until no card in this color
    switchTurn(BOT, BOT);
    return;
  }
  switchTurn(BOT, PLAYER); // bot finish turn
}

function switchTurn(from, to) {
  if (from !== to) {
    if (to === PLAYER) {
      document.getElementById("turn").style.display = "block";
      lstTime = totalSeconds;
    } else {
      document.getElementById("turn").style.display = "none";
      game.player.setTurnTime(totalSeconds, lstTime);
    }
    let player = from === BOT ? game.bot : game.player;
    game.taki = false;
    player.setStats();
    renderStats();
    if (!(game.active && game.lastCard().number === "2plus"))
      if (gameOver())
        //check if game over
        return;
  } else if (!game.taki &&(game.lastCard().number === "plus" || game.lastCard().number === "stop")) {
    let player = from === BOT ? game.bot : game.player;
    player.setStats();
    renderStats();
    if (game.lastCard().number === "stop") {
      if (gameOver())
        //check if game over
        return;
    }
  }
  if (to === PLAYER) game.switchToPlayerTurn();
  else {
    if (from === BOT) {
      game.consecutiveBotTurn += 1;
    } else {
      game.consecutiveBotTurn = 1;
    }
    setTimeout(() => {
      doBotTurn();
    }, game.consecutiveBotTurn * 400);
  }
}

function renderStats() {
  let pstats = game.player.getStats();
  for (let element in pstats) {
    document.getElementById(element).innerHTML = pstats[element];
  }
  let bstats = game.bot.getStats();
  for (let element in bstats) {
    document.getElementById("bot_" + element).innerHTML = bstats[element];
  }
}

document.takeCard = index => {
  if (index === -2) {
    // taking card from deck
    const count = game.taki ? 1 : game.takinNumber();
    for (let i = 0; i < count; i++) {
      //in the right amount(maybe was 2plus)
      game.takeCardFromMainDeck(PLAYER);
      game.renderAll();
    }
    game.setLastCardUnClickable();
    switchTurn(PLAYER, BOT);
    return;
  }
};

document.handleCardClick = index => {
  let card = game.playCard(index);
  let name = card.name;
  if (card) {
    //legit card
    if (card.color === "colorful") {
      //handle colorful
      if (card.number === "taki")
        card.name = card.number + "_" + game.lastCard().color;
      else {
        game.setLastCardUnClickable();
        game.pickColor(card);
      }
    }
    game.addCardToPile(card.name, name);
    game.clearClickable();
  } // never should get here
  else return;
  game.renderAll();
  card = game.lastCard(); //maybe changed by color pick
  if (game.specialCard(card)) {
    if (card.number === "taki") game.openTaki();
    if (card.color !== "colorful") switchTurn(PLAYER, PLAYER);
    return;
  } else if (game.taki) {
    switchTurn(PLAYER, PLAYER);
    return;
  } else if (card.number === "") {
    return;
  }
  game.setLastCardUnClickable();
  switchTurn(PLAYER, BOT);
};

let lstTime = 0;
let timerVar;
let totalSeconds = 0;

function countTimer() {
  ++totalSeconds;
  let hour = Math.floor(totalSeconds / 3600);
  let minute = Math.floor((totalSeconds - hour * 3600) / 60);
  let seconds = totalSeconds - (hour * 3600 + minute * 60);
  document.getElementById("timer").innerHTML =
    hour + ":" + minute + ":" + seconds;
}