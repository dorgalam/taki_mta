const FACED_UP = true;

const FACED_DOWN = false;
const ACTIVE = 1;
const NOTACTIVE = 0;

const PLAYER = 0;
const BOT = 1;

const NOTFINISH = -1;

const STACK = true;

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
// }let game;
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
/*
function chooseCard(card, active) { //the bot well aware of the cards he has (this.cards)
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
    return this.handleSpecial(color, number);
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

hasChangeColor

handleSpecial(color, type) {
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
}*/
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

  getName(){
    return this.name;
  }

  getHtml(index) {
    return `
    <div
      id="card_number_${index}"
      style="${this.styles}"
      class="${this.cardClasses} ${this.cardIndex > -1 ? 'playable' : ''}"
      ${this.cardIndex > -1 || this.cardIndex === -2? `onclick="handleCardClick(${this.cardIndex})"` : ''}>
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

  getDeck(){
    return this.deck;
  }

  getDeckHtml() {
    return `
      <div class="cards">
        ${
          this.deck.map((card, i) => card.getHtml(i)).join('\n')
        }
      </div>
    `;
  }

  setDeck(cards) {
    cards.forEach((card,index) => this.addCard(card,index));
  }

  shuffle() {
    const times = 5 + Math.floor(Math.random() * 10);
    for (let i = 0; i < times; ++i) {
      const cardsToRemove = Math.floor(Math.random() * this.deck.length/2);
      let up = Math.floor(Math.random() * 2);
      const portions = [
        this.deck.slice(0, cardsToRemove / 2),
        this.deck.slice(cardsToRemove / 2 + 1, cardsToRemove / 2 + 1 + cardsToRemove),
        this.deck.slice(cardsToRemove / 2 + 1 + cardsToRemove + 1)
      ];
      if (up) {
        this.deck = [].concat(portions[1]).concat(portions[0]).concat(portions[2]);
      } else {
        this.deck = [].concat(portions[0]).concat(portions[2]).concat(portions[1]);
      }
    }
  }

  addCard(card,index) {
    let style = this.isStack ? CSSUtils.getMainDeckStyle(index) : '';
    if (this.elementId === "pile")
      style = CSSUtils.getPileStyles();
    let classes = CSSUtils.getPlayerClasses(this.isFacedUp, card);
    style = style ? style : CSSUtils.getPlayerStyle(this.isFacedUp,index);
    this.deck.push(new Card(card, classes, style));
  }

  removeCard(index) {
    return this.deck.filter((item, i) => i !== index);
  }

  popRandomCard() {
    return this.deck.popRandomIndex().getName();
  }

  popCard() {
    return this.deck.pop().name;
  }

  lastOne(){
    return this.deck.length === 1;
  }

  getCard(index) {
    return this.deck[index];
  }
  
  getCardName(index){
    return this.deck[index].getName();
  }

  getPlayableIndexes(card,active) {
    let indexes =[];
    this.deck.forEach((cardElem, index) => {
      if (this.isPlayableCard(card, cardElem,active))
        indexes.push(index);
    });
    return indexes;
  }

  isPlayableCard(card, cardElem,active) {
    if(active && card.number === "2plus")
      return cardElem.number === "2plus";
    return (card.color === cardElem.color || card.number === cardElem.number || cardElem.color === "colorful");
  }
  
  setLastCardClickable(){
    if(this.deck.length !== 0)
      this.deck[this.deck.length-1].cardIndex = -2;
  }

}


const CSSUtils = {
  getMainDeckStyle: (index) => `margin: ${index / 3}px ${index / 3}px `,
  getPileStyles: () => `transform: rotate(${-60 + Math.floor(Math.random() * 120)}deg); margin: ${Math.floor(Math.random() * 40)}px ${Math.floor(Math.random() * 40)}px ${Math.floor(Math.random() * 40)}px ${Math.floor(Math.random() * 40)}px`,
  getPlayerClasses: (isFacedUp, card) => `card ${isFacedUp ? `card_${card}` : 'card_back'} `,
  getPlayerStyle: (isFacedUp,index) => ``
}

class Player {
  constructor(deck,isFacedUp) {
    this.playableIndexes = [];
    this.deck = new Deck(deck, isFacedUp);
  }

  getPlayableIndexes(card,active) {
    this.playableIndexes = this.deck.getPlayableIndexes(card,active);
  }

  playCard(index) {
    if (this.playableIndexes.includes(index)) {
      const card = this.deck.getCard(index);
      this.deck.deck = this.deck.removeCard(index);
      this.playableIndexes = this.playableIndexes.filter((item, i) => i !== index);
      return card;
    } else
      return false;
  }

  addCard(card,index) {
    this.deck.addCard(card,index);
  }

  removeCardByCard(card){
    let index;
    this.deck.getDeck().forEach((element,i) => {
      if(element === card)
         index = i;
    });
    this.deck.deck = this.deck.removeCard(index); 
  }

  getHtml() {
    return this.deck.getDeckHtml();
  }

  setCardsClickable(){
    this.deck.getDeck().forEach((element,index) => {
      if(this.playableIndexes.includes(index))
        element.setClickable(index);
    });
  }

  removeCardsClickable(){
    this.deck.getDeck().forEach((element) => {
        element.removeClickable();
    });
  }

  getColorCount(color){
    let count = 0;
    this.deck.getDeck().forEach((element) => {
      if(element.color === color){
        count++;
      }
    });
    return count;
  }

  getNumberCount(number){
    let count = 0;
    this.deck.getDeck().forEach((element) => {
      if(element.number === number){
        count++;
      }
    });
    return count;
  }

  getSpecialTypeColor(color,specialType){
    let special = false;
    this.deck.getDeck().forEach(function(element) {
      if(element.color === color && element.number === specialType){
        special = element;
      }
    });
    return special;
  }

  has2plus(){
    let elem = false;
    this.deck.getDeck().forEach(function(element) {
      console.log(element)
      if(element.number === "2plus"){
        elem = element;
      }
    });
    return elem;
  }

  specialCard(card){
    if(card.number === "taki" || card.number === "stop" || card.number === "plus" || card.color == "colorful"){
      return true;
    }
    return false;
  }

  chooseCard(card, active = true) { //the bot well aware of the cards he has (this.cards)
    let number = card.number;
    let color = card.color;
    if (number === "2plus")
      return this.has2plus(); // options: card name, false (take a card from the pile)
    if (active && this.specialCard(card)){
      return this.handleSpecial(color, number);
    }
    let colorCount = this.getColorCount(color); // count number of cards with this color
    let numberCount = this.getNumberCount(number); // count number of cards with this number
    let plus = this.getSpecialTypeColor(color,"plus");
    let stop = this.getSpecialTypeColor(color,"stop");
    let taki = this.getSpecialTypeColor(color,"taki"); //check for taki in this color
    if (taki && colorCount > 1)
      return taki;
    if (stop && (colorCount > 1 || this.getTypeOtherColor("stop")))
      return stop;
    if (plus && (colorCount > 1 || this.getTypeOtherColor("plus")))
      return plus;
    if (colorCount > 0)
      return this.selectColorCard(color); //select the best card with my color (has two of the same number)
    if (numberCount > 0)
      return this.selectNumberCard(number); //select the best card with my number (has two of the same color)
    return this.hasChangeColor(); // true = best color for me , false = take a card from the pile
  }

  hasChangeColor(){
    const deck = this.deck.getDeck();
    for(let i=0;i<deck.length;i++){
      if(deck[i].color === "colorful")
        return deck[i];
    }
    return false;
  }

  selectColorCard(color){
    const deck = this.deck.getDeck();
    for(let i=0;i<deck.length;i++){
      if(deck[i].color === color)
        return deck[i];
    }
    return false;
  }

  selectNumberCard(number){
    const deck = this.deck.getDeck();
    for(let i=0;i<deck.length;i++){
      if(deck[i].number === number)
        return deck[i];
    }
    return false;
  }
  
  handleSpecial(color, type) {
    let colorCount = this.getColorCount(color); // count number of cards with this color
    if (type === "taki") { // handle taki
      if (colorCount > 1) {
        return this.selectColorCard(color);
      }
      return false;
    }
    let res = this.hasSameCard(color, type);
    if (res)
      return res;
    let otherType = this.getTypeOtherColor(type);
    if (otherType && this.getColorCount(otherType.color) > 1)
      return otherType;
    if (colorCount > 0) {
      return this.selectNumberCard(color);
    }
    return otherType; //can be false
  }

  getTypeOtherColor(type){
    const deck = this.deck.getDeck();
    for(let i=0;i<deck.length;i++){
      if(deck[i].number === type)
        return deck[i];
    }
    return false;
  }

  hasSameCard(color,type){
    const deck = this.deck.getDeck();
    for(let i=0;i<deck.length;i++){
      if(deck[i].number === type && deck[i].color === color)
        return deck[i];
    }
    return false;
  }

  clearPlayable(){
    this.playableIndexes = [];
  }

  pickColor(){
    return "red";
  }
  
  won(){
    return this.deck.getDeck().length=== 0; 
  }

}


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

  playCard(index){
    return this.player.playCard(index);
  }

  specialCard(card){
    return this.bot.specialCard(card);
  }

  clearClickable(){
    this.player.removeCardsClickable();
    this.player.clearPlayable();
  }

  addCardToPile(card){
    const splitName = card.split('_');
    let number = splitName[0];
    if(number === "2plus"){
      this.takinCount = this.takinCount === 1 ? 0 : this.takinCount;
      this.takinCount += 2;
    }
    this.pile.addCard(card);
    this.active = ACTIVE;
  }

  switchToPlayerTurn(){
    this.player.getPlayableIndexes(this.pile.getCard(this.pile.deck.length-1),this.active);
    this.player.setCardsClickable();
    this.mainDeck.setLastCardClickable();
    this.renderAll();
    let winner;
    if((winner = this.getWinner()) !==NOTFINISH){
      goToWinner(winner);
      return;
    }
  }

  botTurn(){
    this.switchTurn();
    let lastCard = this.taki ? new Card("taki_" + this.pile.getCard(this.pile.deck.length-1).color) : this.pile.getCard(this.pile.deck.length-1);
    let card = this.bot.chooseCard(lastCard,this.active);
    this.bot.removeCardByCard(card);
    if(card.color === "colorful")
      card = this.pickColor(card);
    return card;
  }

  renderAll() {
    render(this.mainDeck.getDeckHtml(), 'deck');
    render(this.pile.getDeckHtml(), 'pile');
    render(this.player.getHtml(), 'player');
    render(this.bot.getHtml(), 'bot');
  }

  createDataMembers() {
    this.mainDeck = new Deck('deck', FACED_DOWN, STACK);
    this.pile = new Deck('pile', FACED_UP);
    this.player = new Player('player',FACED_UP);
    this.bot = new Player('bot',FACED_DOWN);
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
      this.player.addCard(this.mainDeck.popRandomCard(),i);
      this.bot.addCard(this.mainDeck.popRandomCard(),i);
    }
    this.pile.addCard(this.mainDeck.popCard());
  }

  switchTurn(){
    this.turn = 1 - this.turn;
  }

  getTurn(){
    return this.turn;
  }

  buildMainFromPile(){
    let cards = this.pile.getDeck();
    this.pile.deck = this.pile.getCard(this.pile.deck.length-1);
    cards.pop();
    cards.forEach((element,index) => {
      this.mainDeck.addCard(element.name,index);  
    });
  }

  takeCardFromMainDeck(player){
    this.active = NOTACTIVE;
    this.takinCount = 1;
    if(this.mainDeck.lastOne()){
      this.buildMainFromPile();

    }
    if(player === PLAYER){
      this.player.addCard(this.mainDeck.popCard());
    }
    else{
      this.bot.addCard(this.mainDeck.popCard());
    }
  }

  pickColor(card){
    let color = this.player.pickColor();
    let number = card.number == "taki" ? "taki" : ""; 
    return new Card(number + '_' + color);
  }

  takinNumber(){
    return this.takinCount;
  }

  openTaki(){
    this.taki = true;
    document.getElementById("closeTaki").style.display = "block";
    //this.showMsgTakiToPlayer();
  }

  closeTaki(){
    this.taki = false;
  }

  getWinner(){
    if(this.player.won()){
      return PLAYER;
    }
    else if(this.bot.won()){
      return BOT;
    }
    return NOTFINISH;
  }
}


window.onload = function () { //active handle
  
}
function startGame(){
  game = new Game();
  document.getElementById("startGame").style.display = "none"; 
  game.start();
}

function closeTaki(){
  alert(1);
  document.getElementById("closeTaki").style.display = "none";
  game.closeTaki();
  doBotTurn();
}

function goToWinner(winner){
  alert(winner);
}

function doBotTurn(){
  let winner;
  /*if((winner = game.getWinner()) !==NOTFINISH){
    goToWinner(winner);
    return;
  }*/
  card = game.botTurn();
  if(card){ //legit card
    game.addCardToPile(card.name);
    game.renderAll();
  }
  else{
    const count = game.takinNumber();
    for(let i=0;i<count;i++){
      game.takeCardFromMainDeck(BOT);
    }
    game.renderAll();
    game.switchToPlayerTurn();
    return;
  }
  while(game.specialCard(card)){
    if(card.number === "taki"){
      game.taki = true;
    }
    card = game.botTurn();
    if(card){ //legit card
      game.addCardToPile(card.name);
    }
    else{
      if(game.taki){
        game.taki = false;
        game.renderAll();
        game.switchToPlayerTurn();
        return;
      }
      const count = game.takinNumber();
      for(let i=0;i<count;i++){
        game.takeCardFromMainDeck(BOT);
        game.renderAll();
      }
      game.renderAll();
      game.switchToPlayerTurn();
      return;
    }
  }
  game.renderAll();
  game.switchToPlayerTurn();
}



document.handleCardClick = (index) => {
  if(index === -2){
    const count = game.takinNumber();
      for(let i=0;i<count;i++){
        game.takeCardFromMainDeck(PLAYER);
        game.renderAll();    
      }
    doBotTurn();
  }
  let card = false;
    card = game.playCard(index);
    if(card){ //legit card
      if(card.color == "colorful"){
        card = game.pickColor(card);
      }
      game.addCardToPile(card.name);
      game.clearClickable();
    }
    else 
      return; 
  game.renderAll();
  if(game.specialCard(card)){
    /*if(card.number === "taki")
      game.openTaki();
    */game.switchToPlayerTurn();
    return ;
  }
  doBotTurn();
};

