import React from "react";
import ReactDOM from "react-dom";
import "./styles/style.css";
import "./styles/cards.css";

const shuffleDeck = deck => {
  const times = 300 + Math.floor(Math.random() * 500);
  let copiedDeck = [...deck];
  for (let i = 0; i < times; ++i) {
    const cardsToRemove = Math.floor(Math.random() * copiedDeck.length / 2);
    let up = Math.floor(Math.random() * 2);
    const portions = [
      copiedDeck.slice(0, cardsToRemove / 2 + 1),
      copiedDeck.slice(
        cardsToRemove / 2 + 1,
        cardsToRemove / 2 + 1 + cardsToRemove
      ),
      copiedDeck.slice(cardsToRemove / 2 + cardsToRemove + 1)
    ];
    if (up) {
      copiedDeck = []
        .concat(portions[1])
        .concat(portions[0])
        .concat(portions[2]);
    } else {
      copiedDeck = []
        .concat(portions[0])
        .concat(portions[2])
        .concat(portions[1]);
    }
  }
  return copiedDeck;
};

const createCardsArray = () => {
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
    "plus",
    "2plus"
  ];
  let colors = ["red", "blue", "green", "yellow"];
  let arr = [];
  let card;
  cards.forEach(number => {
    colors.forEach(color => {
      card = String(number) + "_" + color;
      arr.push(card);
      arr.push(card);
    });
  });
  colors.forEach(color => {
    arr.push("change_colorful");
  });
  arr.push("taki_colorful");
  arr.push("taki_colorful");
  return shuffleDeck(arr);
};

class SideBar extends React.Component {
  render() {
    return (
      <div id="side-bar">
        {/* <div id="stats-section">
          <div id="p1-stats" className="stats" style={{display: 'none'}}>
            <h2>
              Clock
              <a id="timer">0:0:0</a>
            </h2>
            <h1>Your Stats:</h1>
            <h2>
              Turns played:
              <a id="num_turns">0</a>
            </h2>
            <h2 style="font-size: 100%;">
              Average turn time:
              <a id="avg_time">0</a>
            </h2>
            <h2 style="font-size: 90%;">
              Last card declerations:
              <a id="last_one">0</a>
            </h2>
          </div>
        </div>
        <div id="actions-section">
          <button
            id="quit-button"
            disabled
            onClick="restart()"
            style="width: 50%; background-color: antiquewhite"
          >
            Restart
          </button>
        </div> */}
      </div>
    );
  }
}

const PLAYER = 0;
const BOT = 1;

class MainGameWindow extends React.Component {
  constructor() {
    super();
    this.state = {
      deckCards: createCardsArray().map(item => new Card(item)),
      playerDeck: [],
      botDeck: [],
      pileCards: [],
      currentPlayer: PLAYER,
      cardIsActive: false,
      isTaki: false,
      hasMove:false
    };
    this.takinNumber = 1;
    this.hasMove = this.hasMove.bind(this);
    this.playCard = this.playCard.bind(this);
    this.setTaki = this.setTaki.bind(this);
    this.closeTaki = this.closeTaki.bind(this);
    this.takeCardFromMainDeck = this.takeCardFromMainDeck.bind(this);
    this.switchPlayer = this.switchPlayer.bind(this);
    this.selectColor = this.selectColor.bind(this);
    this.getBotProps = this.getBotProps.bind(this);
    this.getMiddleProps = this.getMiddleProps.bind(this);
    this.getPlayerProps = this.getPlayerProps.bind(this);
    this.buildNewMainDeck = this.buildNewMainDeck.bind(this);
  }

  switchPlayer(toPlayer) {

    this.setState({
      currentPlayer: toPlayer,
      hasMove: false
    }); 
  }

  hasMove(bool){
    this.setState({
      hasMove: bool
    }); 
  }

  dealCardsToPlayers() {
    const cardsInDeck = [...this.state.deckCards],
      playerDeck = [],
      botDeck = [],
      pileCards = [];
    for (let i = 0; i < 8; ++i) {
      playerDeck.push(cardsInDeck.pop());
      botDeck.push(cardsInDeck.pop());
    }
    let card;
    while (card = cardsInDeck.pop()) {
      if (!isSpecialCard(card) && card.number !== "2plus") {
        pileCards.push(card);
        break;
      }
      cardsInDeck.unshift(card);
    }
    this.setState({
      deckCards: cardsInDeck,
      playerDeck,
      botDeck,
      pileCards
    });
  }
 
  buildNewMainDeck(){
    const copiedDeck = [...this.state.pileCards];
    const lastPileCard = [];
    lastPileCard.push(copiedDeck.pop());
    let newDeck = this.state.deckCards;
    copiedDeck.forEach((element, index) => {
      newDeck.push(new Card(element.card, element.card));
    });
    newDeck = shuffleDeck(newDeck);
    this.setState({
      pileCards:lastPileCard
    });
    return newDeck;
  }

  playCard(index, deckName) {
    const copiedDeck = [...this.state[deckName]];
    const cardToPlay = copiedDeck.popIndex(index);
    const newPile = [...this.state.pileCards, cardToPlay];
    if(cardToPlay.number === "2plus"){
      this.takinNumber = this.takinNumber === 1 ? 0 : this.takinNumber;
      this.takinNumber += 2;
    }
    if(cardToPlay.color === "colorful"){
      this.switchPlayer(-1);
    }

    this.setState({
      [deckName]: copiedDeck,
      pileCards: newPile,
      cardIsActive: true
    });
  }

  takeCardFromMainDeck(deckName,player) {
    let cards =[];
    let copiedDeck = [...this.state.deckCards];
    for(let i=0;i<this.takinNumber;i++){
      cards.push(copiedDeck.pop());
      if(copiedDeck.length === 1)
        copiedDeck = this.buildNewMainDeck();
    }
    this.takinNumber = 1; 
    const newPile = [...this.state[deckName],...cards];
    

    this.setState({
      deckCards: copiedDeck,
      [deckName]: newPile,
      cardIsActive: false
    });
    this.switchPlayer(player)
  }

  closeTaki(){
    let lastcard = this.state.pileCards[this.state.pileCards.length-1];
    this.setTaki(false);
    if(isSpecialCard(lastcard) && lastcard.number!=="taki")
      this.switchPlayer(PLAYER);
    else{
      this.switchPlayer(BOT);
    }
  }

  setTaki(bool){
    this.setState({
      isTaki: bool
    });
  }

  selectColor(color){
    this.state.pileCards[this.state.pileCards.length - 1] = new Card("_"+color);
    this.switchPlayer(BOT);
  }

  componentDidMount() {
    this.dealCardsToPlayers();
  }

  getBotProps(botDeck,pileCards,currentPlayer,cardIsActive,isTaki) {
    return {
      cards:botDeck,
      myTurn:currentPlayer === BOT,
      playCard:currentPlayer === BOT ? this.playCard : "",
      switchPlayer:this.switchPlayer, 
      lastPileCard:pileCards[pileCards.length - 1],
      isActive:cardIsActive,
      isTaki:isTaki,
      setTaki:this.setTaki,
      takeCard:this.takeCardFromMainDeck
    }
  }

  getMiddleProps(deckCards,pileCards,currentPlayer,isTaki,hasMove){
    return {
      mainDeckCards:deckCards,
      pileCards:pileCards,
      player:currentPlayer, ///who's turn
      takeCard:currentPlayer === PLAYER ? this.takeCardFromMainDeck: null,
      isTaki:isTaki,
      closeTaki:this.closeTaki,
      selectColor:this.selectColor,
      allowTake:hasMove === false && currentPlayer === PLAYER //need to add has move
    }
  }

  getPlayerProps(playerDeck,pileCards,currentPlayer,cardIsActive,isTaki){
    return {
      playCard:currentPlayer === PLAYER ? this.playCard : null,
      switchPlayer:this.switchPlayer,
      cards:playerDeck,
      isActive:cardIsActive,
      lastPileCard:pileCards[pileCards.length - 1],
      isTaki:isTaki,
      setTaki:this.setTaki,
      hasMove:this.hasMove,
      buildDeck:this.buildNewMainDeck
    }
  }

  render() {
    const {
      botDeck,
      deckCards,
      pileCards,
      currentPlayer,
      playerDeck,
      cardIsActive,
      isTaki,
      hasMove
    } = this.state;
    return (
      <div id="wrapper">
        <Bot {...this.getBotProps(botDeck,pileCards,currentPlayer,cardIsActive,isTaki)}/>
        <MiddleSection {...this.getMiddleProps(deckCards,pileCards,currentPlayer,isTaki,hasMove)}/>
        <Player {...this.getPlayerProps(playerDeck,pileCards,currentPlayer,cardIsActive,isTaki)}/>
      </div>
    );
  }
}

const TurnIdentifier = ({ myTurn }) =>
  myTurn ? (
    <div id="turn" className="turn">
      <img id="turn-img" src="../src/styles/assets/yourturn.png" alt="turn" />
    </div>
  ) : null;

  const TakiIdentifier = ({openTaki,closeTaki}) =>
    openTaki ? (
      <div id="closeT" className="turn">
      <button className="btn" onClick={closeTaki} id="closeTaki">Close taki</button>
      </div>
  ) : null;

  const ColorPick = ({choose,selectColor}) =>
    choose ? (
      <div className="color_tooltip"><a>Choose Color:</a>        
        <div onClick={selectColor('red')} className="color_tooltip_red"></div>
        <div onClick={selectColor('yellow')} className="color_tooltip_yellow"></div>
        <div onClick={selectColor('blue')} className="color_tooltip_blue"></div>
        <div onClick={selectColor('green')} className="color_tooltip_green"></div>
    </div>
  ) : null;

const EndingDisplay = ({ }) => (
  <div id="ending" style={{ position: "absolute", left: "30%", top: "20%" }}>
    <div id="celebrate" style={{ display: "none" }}>
      <img src="../src/styles/assets/barney-celebrate.gif" alt="gif" />
    </div>
    <div id="loser" style={{ display: "none" }}>
      <img src="../src/styles/assets/loser.gif" alt="gif" />
      <img src="../src/styles/assets/cry.gif" alt="gif" />
    </div>
    <div id="bot-stats" className="bot_stats" style={{ display: "none" }}>
      <h1>Bot Stats:</h1>
      <h2>
        Turns played:
        <a id="bot_num_turns">0</a>
      </h2>
      <h2 style={{ fontSize: "90%" }}>
        Last card declerations:
        <a id="bot_last_one">0</a>
      </h2>
    </div>
  </div>
);
const StartGameButton = ({ }) => (
  <button type="button" id="startGame" className="btn start-game-button">
    Start Game
  </button>
);
const MiddleSection = ({ mainDeckCards, pileCards = [], player ,takeCard,isTaki ,closeTaki,selectColor,allowTake}) => (
  <div id="content">
    <StartGameButton />
    <Pile cards={pileCards} />
    <MainDeck cards={mainDeckCards} giveCardToPlayer={takeCard} allowTake={allowTake}/>
    <TurnIdentifier myTurn={player === PLAYER} />
    <TakiIdentifier openTaki ={player === PLAYER && isTaki} closeTaki={closeTaki} />
    <ColorPick choose={player===-1} selectColor={color => () => selectColor(color)}/>
    <EndingDisplay />
  </div>
);



const Pile = ({ cards }) => (
  <div id="pile">
    {cards.map((card, index, arr) => (
      <CardComp
        styles={getPileStyles()}
        key={index}
        name={card.name}
        classes={index >= arr.length - 15 ? `card_${card.name}` : ""}
      />
    ))}
  </div>
);

const CardComp = ({ name, styles, classes, handleCardClick }) => (
  <div style={styles} className={`card ${classes}`} onClick={handleCardClick} />
);

const randomMargin = () => Math.floor(Math.random() * 40);

const getPileStyles = () => ({
  transform: `rotate(${-60 + randomMargin() * 3}deg)`,
  margin: `${randomMargin()}px ${randomMargin()}px ${randomMargin()}px ${randomMargin()}px`,
  position: "absolute"
});

const MainDeck = ({ cards ,giveCardToPlayer, allowTake}) => (
  <div id="deck">
    {cards.map((card, index, arr) => (
      <CardComp
        styles={{ left: `${index / 3}px`, position: "absolute" }}
        key={index}
        name={card.name}
        classes={allowTake && index === cards.length-1 ? 
          "card_back playable" : index === cards.length-1 ? "card_back notplayable" : ""}
        handleCardClick={() => allowTake && index === cards.length-1 ? giveCardToPlayer("playerDeck",BOT) : null}
      />
    ))}
  </div>
);

const isSpecialCard = card => {
  return (
    card.number === "taki" ||
    card.number === "stop" ||
    card.number === "plus" ||
    card.color === "colorful"
  );
};

class Player extends React.Component {
  constructor() {
    super();
   
    this.handleCardClick = this.handleCardClick.bind(this);
    this.isPlayableCard = this.isPlayableCard.bind(this);
  }

  handleCardClick(index) {
    if (!this.isPlayableCard(index)) {
      return;
    }
    let card = this.props.cards[index];
    let name = card.name;
    const {number,color} = card;
     if (color === "colorful") {//handle colorful
       if (number === "taki") {
         this.props.setTaki(true);
          this.props.cards[index] = new Card(number + "_" + this.props.lastPileCard.color);
       }//set last unclickable - done auto
     }
    this.props.playCard(index, "playerDeck");
    if (isSpecialCard(card)) {
        if (number === "taki") {
          this.props.setTaki(true);
        }
     } else if (this.props.isTaki) {
      this.props.switchPlayer(PLAYER);
     } else if (number !== "") {
       //this.props.setLastCardUnClickable();
       this.props.switchPlayer(BOT);
       return;
     }
  }

  isPlayableCard(index) {
    const { lastPileCard, cards, isActive ,isTaki} = this.props;
    const currentCard = cards[index];
    if (isActive && isTaki) {
      return lastPileCard.color === currentCard.color;
    }
    if (isActive && lastPileCard.number === "2plus") {
      return currentCard.number === "2plus";
    }
    return (
      lastPileCard.color === currentCard.color ||
      lastPileCard.number ===currentCard.number ||
      currentCard.color === "colorful"
    );
  }

  render() {
    return (
      <div id="player">
        <PlayerDeck
          handleCardClick={this.handleCardClick}
          isPlayableCard={this.isPlayableCard}
          cards={this.props.cards}
          lastCard={this.props.lastPileCard}
          active={this.props.isActive}
          taki={this.props.isTaki}
          isFacedUp={true}
        />
      </div>
    );
  }
}

const getPlayerClasses = (isFacedUp, card) =>{
  return(
`card ${isFacedUp ? `card_${card}` : "card_back"} `)
};

const getStylesForPlayerCard = (index, length) => {
  let leftPx = index * (length/2-15) ;
  /*if (length === 8) {
    leftPx = index * 30;
  }*/
  return {
    position: "relative",
    left: `-${leftPx}px`
  };
};

const PlayerDeck = ({ cards, handleCardClick, lastCard, active, taki, isPlayableCard ,isFacedUp}) => (
  <div className="cards">
    {cards.map((card, index, { length }) => (
      <CardComp
        key={index}
        styles={getStylesForPlayerCard(index, length)}
        classes={getPlayerClasses(isFacedUp,card.name) + 
          String(isFacedUp && isPlayableCard(index) ? "playable":"")}
        handleCardClick={() => isPlayableCard(index) ? handleCardClick(index) : null}
      />
    ))}
  </div>
);

class Card {
  constructor(card,orig ="") {
    this.name = card;
    const [number, color] = card.split('_')
    this.number = number;
    this.color = color;
    this.card = orig === "" ? JSON.stringify(card) : JSON.stringify(orig);
  }
}

class Bot extends React.Component {
  
  getCardIndex(card){
    let res = -1;
    if(card === false)
      return -1;
    this.props.cards.forEach((element,index) => {
      if (element.color === card.color && element.number === card.number) {
        res = index;
      }
    });
    return res;
  }

  chooseCard(active,isTaki) { //the bot well aware of the cards he has (this.cards)
    const {lastPileCard} = this.props;
    let number = lastPileCard.number;
    let color = lastPileCard.color;
    if(isTaki){
      return this.selectColorCard(color);
    }
    if (active && number === "2plus")
      return this.has2plus(); // options: card name, false (take a card from the pile)
    if (active && isSpecialCard(lastPileCard)) {
      return this.handleSpecial(color, number);
    }
    let colorCount = this.getColorCount(color); // count number of cards with this color
    let numberCount = this.getNumberCount(number); // count number of cards with this number
    let plus = this.getSpecialTypeColor(color, "plus");
    let stop = this.getSpecialTypeColor(color, "stop");
    let taki = this.getSpecialTypeColor(color, "taki"); //check for taki in this color
    if (taki && colorCount > 1)
      return taki;
    if (plus && (colorCount > 1 || this.getTypeOtherColor("plus")))
      return plus;
    if (stop && (colorCount > 1 || this.getTypeOtherColor("stop")))
      return stop;
    if (colorCount > 0)
      return this.selectColorCard(color); //select the best card with my color (has two of the same number)
    if (numberCount > 0)
      return this.selectNumberCard(number); //select the best card with my number (has two of the same color)
    return this.hasChangeColor(); // true = best color for me , false = take a card from the pile
  }

  getColorCount(color) {
    let count = 0;
    this.props.cards.forEach((element) => {
      if (element.color === color) {
        count++;
      }
    });
    return count;
  }

  getNumberCount(number) {
    let count = 0;
    this.props.cards.forEach((element) => {
      if (element.number === number) {
        count++;
      }
    });
    return count;
  }

  getSpecialTypeColor(color, specialType) {
    let special = false;
    this.props.cards.forEach(function (element) {
      if (element.color === color && element.number === specialType) {
        special = element;
      }
    });
    return special;
  }

  has2plus() {
    let elem = false;
    this.props.cards.forEach(function (element) {
      if (element.number === "2plus") {
        elem = element;
      }
    });
    return elem;
  }

  hasChangeColor() {
    const deck = this.props.cards;
    for (let i = 0; i < deck.length; i++) {
      if (deck[i].color === "colorful")
        return deck[i];
    }
    return false;
  }

  selectColorCard(color) {
    let numbersArr = {
      "1": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0,
      "8": 0,
      "9": 0,
      "plus": 0,
      "stop": 0,
      "taki": 0,
      "2plus": 0
    };
    const deck = this.props.cards;
    for (let i = 0; i < deck.length; i++) {
      if (deck[i].color === color)
        numbersArr[deck[i].number]++;
    }
    let max = Object.keys(numbersArr).reduce(function (a, b) {
      return numbersArr[a] > numbersArr[b] ? a : b
    });
    if (numbersArr[max] === 0)
      return false;
    for (let i = 0; i < deck.length; i++) {
      if (deck[i].color === color && deck[i].number === max)
        return deck[i];
    }

  }

  selectNumberCard(number) {
    let colorsArr = {
      "red": 0,
      "blue": 0,
      "green": 0,
      "yellow": 0
    };
    const deck = this.props.cards;
    for (let i = 0; i < deck.length; i++) {
      if (deck[i].number === number)
        colorsArr[deck[i].color]++;
    }
    let max = Object.keys(colorsArr).reduce(function (a, b) {
      return colorsArr[a] > colorsArr[b] ? a : b
    });
    if (colorsArr[max] === 0)
      return false;
    for (let i = 0; i < deck.length; i++) {
      if (deck[i].number === number && deck[i].color === max)
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

  getTypeOtherColor(type) {
    const deck = this.props.cards;
    for (let i = 0; i < deck.length; i++) {
      if (deck[i].number === type)
        return deck[i];
    }
    return false;
  }

  hasSameCard(color, type) {
    const deck = this.props.cards;
    for (let i = 0; i < deck.length; i++) {
      if (deck[i].number === type && deck[i].color === color)
        return deck[i];
    }
    return false;
  }

  botPickColor() {
    let colorsArr = {
      red: 0,
      blue: 0,
      yellow: 0,
      green: 0,
      colorful: -20
    };
    this.props.cards.forEach(element => {
      colorsArr[element.color]++;
    });
    return Object.keys(colorsArr).reduce(function (a, b) {
      return colorsArr[a] > colorsArr[b] ? a : b;
    });
  }

  handleColorful(card){
    let res;
    if (card.number === "taki") {
      res = new Card(card.number + "_" + this.props.lastPileCard.color,card.name);
    }
    else{
      res = new Card("_" + this.botPickColor(),card.name);
    }
    return res;
  }

  handleHaveNoCard(card){
    if (!this.props.isTaki) {
      this.props.takeCard("botDeck",PLAYER);
      return;
    }
    else { //finish my taki turn
      this.props.setTaki(false);
      if (isSpecialCard(this.props.lastPileCard) && this.props.lastPileCard.number !== "taki") {
        this.props.switchPlayer(BOT); // check if last card was "stop" or "plus" need to get another turn
        return;
      }
    }
    this.props.switchPlayer(PLAYER);
    return;
  }

  componentDidUpdate(){
    if(this.props.myTurn){
      let card = this.chooseCard(this.props.isActive,this.props.isTaki);
      let index = this.getCardIndex(card);
      if(index === -1){
        this.handleHaveNoCard(card,index);
        return; 
      }
    else{
      if (card.color === "colorful") {//handle colorful
        card = this.props.cards[index] = this.handleColorful(card);
      }
      this.props.playCard(index,"botDeck");
      if (isSpecialCard(card)) { // do again bot turn(plus,stop,taki)
        if (card.number === "taki"){
          this.props.setTaki(true); // taki flag on
        }
        this.props.switchPlayer(BOT);
        return;
      } else if (this.props.isTaki) { // regular card but on taki - need to do bot turns until no card in this color
        this.props.switchPlayer(BOT);
        return;
      }
      this.props.switchPlayer(PLAYER);
    }
  }
}

  render() {
    return (
      <div id="bot">
        <PlayerDeck cards={this.props.cards}
         lastCard={this.props.lastPileCard}
         active={this.props.isActive}
         taki={this.props.isTaki}
         isFacedUp={false}
         
         />
      </div>
    );
  }
}

ReactDOM.render(<MainGameWindow />, document.getElementById("root"));

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
};
