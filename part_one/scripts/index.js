const FACED_UP = true;

const FACED_DOWN = false;
const ACTIVE = 1;
const NOTACTIVE = 0;

const PLAYER = 0;
const BOT = 1;

const NOTFINISH = -1;

const STACK = true;

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
    let colorsArr = {"red":0,"blue":0,"yellow":0,"green":0,"colorful":-5};
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
        switchTurn(BOT,BOT); // check if last card was "stop" or "plus" need to get another turn
        return;
      } 
    }
    switchTurn(BOT,PLAYER);
    return;
  }
  if(game.specialCard(card["card"])){ // do again bot turn(plus,stop,taki)
    if(card["card"].number === "taki")
      game.taki = true; // taki flag on
    else
      game.taki = false;
    switchTurn(BOT,BOT);
    return;
  }
  else if(game.taki){ // regular card but on taki - need to do bot turns until no card in this color
    switchTurn(BOT,BOT);
    return;
  }
  switchTurn(BOT,PLAYER); // bot finish turn
}

function switchTurn(from,to){
  if(from !== to){
    game.taki = false;
    //turns++;
  gameOver(); //check if game over
  }
  if(to === PLAYER)
    game.switchToPlayerTurn();
  else
    doBotTurn();
}

document.handleCardClick = (index) => {
  if(index === -2){ // taking card from deck
    const count = game.takinNumber();
    //closeTaki();
    for(let i=0;i<count;i++){ //in the right amount(maybe was 2plus)
      game.takeCardFromMainDeck(PLAYER);
      game.renderAll();
    }
    game.setLastCardUnClickable();
    switchTurn(PLAYER,BOT); 
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
      switchTurn(PLAYER,PLAYER);
    return;
  }
  else if(game.taki){
    switchTurn(PLAYER,PLAYER);
    return;
  }
  else if(card.number === ""){
    return;
  }
  game.setLastCardUnClickable();
  switchTurn(PLAYER,BOT);
};