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

class Stats{
  constructor(elementId, isplayer) {
    this.turns = 0;
    this.elementId = elementId;
    if (isplayer) {
      this.timepass = 0; // maybe new time
      this.turnstime = [];
    }
  }
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

const render = (innerHTML, elementId) => document.getElementById(elementId).innerHTML = innerHTML;

class Card {
  constructor(name, classes = '', styles = '', attributes = '',origName ='') {
    const splitName = name.split('_');
    this.name = name;
    this.number = splitName[0];
    this.color = splitName[1];
    this.styles = styles;
    this.cardClasses = classes;
    this.cardIndex = -1;
    this.original = origName === '' ? name : origName; 
  }

  getName(){ // useless?
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

  shuffle() { // demonstrate human shuffle
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

  addCard(card,index,origName) {
    let style = this.isStack ? CSSUtils.getMainDeckStyle(index) : '';
    if (this.elementId === "pile")
      style = CSSUtils.getPileStyles();
    let classes = CSSUtils.getPlayerClasses(this.isFacedUp, card);
    style = style ? style : CSSUtils.getPlayerStyle(this.isFacedUp,index);
    this.deck.push(new Card(card, classes, style,"",origName));
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

  isLastOne(){
    return this.deck.length === 1;
  }

  getCard(index) {
    return this.deck[index];
  }

  getPlayableIndexes(card,active,taki) {
    let indexes =[];
    this.deck.forEach((cardElem, index) => {
      if (this.isPlayableCard(card, cardElem,active,taki))
        indexes.push(index);
    });
    return indexes;
  }

  isPlayableCard(card, cardElem,active,taki) { //need to check on taki
    if(active && card.number === "2plus")
      return cardElem.number === "2plus";
    if(active && taki){
      return card.color === cardElem.color;  
    }
    return (card.color === cardElem.color || card.number === cardElem.number || cardElem.color === "colorful");
  }
  
  setLastCardClickable(){
    if(this.deck.length !== 0)
      this.deck[this.deck.length-1].cardIndex = -2;
  }

  setLastCardUnClickable(){
    if(this.deck.length !== 0)
      this.deck[this.deck.length-1].cardIndex = -1;
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

  getPlayableIndexes(card,active,taki) {
    this.playableIndexes = this.deck.getPlayableIndexes(card,active,taki);
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

  addCard(card,index,orig) {
    this.deck.addCard(card,index,orig);
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

  chooseCard(card,active = true) { //the bot well aware of the cards he has (this.cards)
    let number = card.number;
    let color = card.color;
    if (active && number === "2plus")
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
    let numbersArr = {"1": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0, "8": 0, "9": 0,
     "plus": 0,"stop": 0, "taki": 0,"2plus": 0};
    const deck = this.deck.getDeck();
    for(let i=0;i<deck.length;i++){
      if(deck[i].color === color)
        numbersArr[deck[i].number]++;
    }
    let max = Object.keys(numbersArr).reduce(function(a, b){ return numbersArr[a] > numbersArr[b] ? a : b });
    if(numbersArr[max] === 0)
      return false;
    for(let i=0;i<deck.length;i++){
      if(deck[i].color === color && deck[i].number === max)
        return deck[i];
    } 
    
  }

  selectNumberCard(number){
    let colorsArr = {"red": 0,"blue": 0,"green": 0,"yellow": 0};
    const deck = this.deck.getDeck();
    for(let i = 0;i < deck.length;i++){
      if(deck[i].number === number)
      colorsArr[deck[i].color]++;
    }
    let max = Object.keys(colorsArr).reduce(function(a, b){ return colorsArr[a] > colorsArr[b] ? a : b });
    if(colorsArr[max] === 0)
      return false;
    for(let i = 0;i < deck.length;i++){
      if(deck[i].number === number && deck[i].color === max)
        return deck[i];
    }
  }
  
  handleSpecial(color, type) {
    let colorCount = this.getColorCount(color); // count number of cards with this color
    if (type === "taki") { // handle taki
      if (colorCount >= 1) {
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
      return this.selectColorCard(color);
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

  addCardToPile(card,origName = false){
    const splitName = card.split('_');
    let number = splitName[0];
    if(number === "2plus"){
      this.takinCount = this.takinCount === 1 ? 0 : this.takinCount;
      this.takinCount += 2;
    }
    this.pile.addCard(card,false,origName);
    this.active = ACTIVE;
    this.renderAll();
  }

  switchToPlayerTurn(){
    this.renderAll();
    this.player.getPlayableIndexes(this.lastCard(),this.active,this.taki);
    this.player.setCardsClickable();
    this.mainDeck.setLastCardClickable();
    this.renderAll();
  }

  setLastCardUnClickable(){
    this.mainDeck.setLastCardUnClickable();    
  }

  botPickColor(){
    let colorsArr = {"red":0,"blue":0,"yellow":0,"green":0};
    let cards = this.bot.deck.getDeck();
    cards.forEach(element=>{
      colorsArr[element.color]++;
    });
    return Object.keys(colorsArr).reduce(function(a, b){ return colorsArr[a] > colorsArr[b] ? a : b });
  }

  botTurn(){
    //this.switchTurn();
    let lastCard = this.taki ? new Card("taki_" + this.lastCard().color) : this.lastCard();
    let card = this.bot.chooseCard(lastCard,this.active);
    this.bot.removeCardByCard(card);
    let orig = card.name;
    if(card.color === "colorful"){
      if(card.number ==="taki")
        card.color = lastCard.color;
      else{
        card.number = "";
        card.color = this.botPickColor(card);
      }
      card.name = card.number + "_" + card.color;
    }
    return {card,orig};
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
    let card,cardName;
    while((cardName = this.mainDeck.popCard())){
      card = new Card(cardName);
      if(!this.specialCard(card) && card.number !== "2plus"){
        this.pile.addCard(cardName);
        break;
      }
      this.mainDeck.pushCardToStart(card);
    }
  }

  /*switchTurn(){
    this.turn = 1 - this.turn;
  }*/

  getTurn(){
    return this.turn;
  }

  buildMainFromPile(){
    let cards = this.pile.getDeck();
    let lcard = this.lastCard();
    this.pile.deck = [];
    this.pile.deck.push(lcard);
    cards.pop();
    cards.forEach((element,index) => {
      this.mainDeck.addCard(element.original,index);  
    });
  }

  takeCardFromMainDeck(player){
    this.active = NOTACTIVE;
    this.takinCount = 1;
    if(this.mainDeck.isLastOne()){
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
    document.getElementById("pickColor").style.display = "block";
  }

  takinNumber(){
    return this.takinCount;
  }

  openTaki(){
    this.taki = true;
    document.getElementById("closeTaki").style.display = "block";
  }

  closeTaki(){
    this.taki = false;
    if(this.lastCard().number !== "taki" && this.specialCard(this.lastCard())){
      this.switchToPlayerTurn();
      return false;
    }
    return true;
  }

  lastCard(){
    return this.pile.getCard(this.pile.getDeck().length-1);
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

function gameOver(){
  let winner;
  if((winner = game.getWinner()) !== NOTFINISH){
    goToWinner(winner);
    return;
  }
}

function startGame(){
  game = new Game();
  document.getElementById("startGame").style.display = "none"; 
  game.start();
}

function closeTaki(){
  document.getElementById("closeTaki").style.display = "none";
  if(game.closeTaki())
    doBotTurn();
}

function goToWinner(winner){
  alert(winner);
}

function selectColor(color){
  let orig = game.pile.popCard();
  let card = "_" + color.id;
  document.getElementById("pickColor").style.display = "none";
  game.addCardToPile(card,orig);
  doBotTurn();
}

function doBotTurn(){
  gameOver(); //check if game over
  card = game.botTurn(); //get card from bot deck -- choosen by a smart algo
  if(card["card"]){ //legit card
    game.addCardToPile(card["card"].name,card["orig"]);
  }
  else{ // didnt find suitable card ,if was taki turn - no need to take a card , else take cards (as needed maybe 2plus)
    if(!game.taki){
      const count = game.takinNumber();
      for(let i=0;i<count;i++){
        game.takeCardFromMainDeck(BOT);
      }
    }
    else{ //finish my taki turn
      game.taki = false;
      if(game.specialCard(game.lastCard())&& game.lastCard().number !== "taki"){
        doBotTurn(); // check if last card was "stop" or "plus" need to get another turn
        return;
      } 
    }
    game.switchToPlayerTurn();
    gameOver();
    return;
  }
  if(game.specialCard(card["card"])){ // do again bot turn(plus,stop,taki)
    if(card["card"].number === "taki"){
      game.taki = true; // taki flag on
    }
    doBotTurn();
  }
  else if(game.taki){ // regular card but on taki - need to do bot turns until no card in this color
    game.botTurn();
  }
  game.switchToPlayerTurn(); // bot finish turn
  gameOver(); // check if game over
}




document.handleCardClick = (index) => {
  if(index === -2){ // taking card from deck
    const count = game.takinNumber();
    closeTaki();
    for(let i=0;i<count;i++){ //in the right amount(maybe was 2plus)
      game.takeCardFromMainDeck(PLAYER);
      game.renderAll();
    }
    game.setLastCardUnClickable();
    doBotTurn();
    return;
  }
  let card = game.playCard(index);
  let name = card.name;
  if(card){ //legit card
    if(card.color === "colorful"){ //handle colorful
      if(card.number === "taki")
        card.name = card.number + "_" + game.lastCard().color;
      else{
        game.setLastCardUnClickable();
        game.pickColor(card);
      }
    }
    game.addCardToPile(card.name,name);
    game.clearClickable();
  }
  else // never should get here
    return; 
  game.renderAll();
  card = game.lastCard(); //maybe changed by color pick
  if(game.specialCard(card)){
    if(card.number === "taki")
      game.openTaki();
    if(card.color !== "colorful")
      game.switchToPlayerTurn();
    return;
  }
  else if(game.taki){
    game.switchToPlayerTurn();
    return;
  }
  else if(card.number === ""){
    return;
  }
  game.setLastCardUnClickable();
  doBotTurn();
};

