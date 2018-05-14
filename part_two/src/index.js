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
      deckCards: createCardsArray(),
      playerDeck: [],
      botDeck: [],
      pileCards: [],
      currentPlayer: PLAYER,
      cardIsActive: false
    };

    this.playCard = this.playCard.bind(this);
    this.switchPlayer = this.switchPlayer.bind(this);
  }

  switchPlayer(toPlayer) {
    this.setState({
      currentPlayer: toPlayer
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
    pileCards.push(cardsInDeck.pop());

    this.setState({
      deckCards: cardsInDeck,
      playerDeck,
      botDeck,
      pileCards
    });
  }

  playCard(index, deckName) {
    const copiedDeck = [...this.state[deckName]];
    const cardToPlay = copiedDeck.popIndex(index);
    const newPile = [...this.state.pileCards, cardToPlay];

    this.setState({
      [deckName]: copiedDeck,
      pileCards: newPile
    });
  }

  componentDidMount() {
    this.dealCardsToPlayers();
  }

  render() {
    const {
      botDeck,
      deckCards,
      pileCards,
      currentPlayer,
      playerDeck,
      cardIsActive
    } = this.state;

    return (
      <div id="wrapper">
        <Bot cards={botDeck}
        myTurn={currentPlayer === BOT}
        playCard={currentPlayer === PLAYER ? this.playCard : ""}
        switchPlayer={this.switchPlayer} 
        lastPileCard={pileCards[pileCards.length - 1]}
        isActive={cardIsActive}/>?
        <MiddleSection
          mainDeckCards={deckCards}
          pileCards={pileCards}
          player={currentPlayer} ///who's turn
        />
        <Player
          playCard={currentPlayer === PLAYER ? this.playCard : ""}
          switchPlayer={this.switchPlayer}
          cards={playerDeck}
          isActive={cardIsActive}
          lastPileCard={pileCards[pileCards.length - 1]}
         
        />
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
const MiddleSection = ({ mainDeckCards, pileCards = [], player }) => (
  <div id="content">
    <StartGameButton />
    <Pile cards={pileCards} />
    <MainDeck cards={mainDeckCards} />
    <TurnIdentifier myTurn={player === PLAYER} />
    <EndingDisplay />
  </div>
);

const Pile = ({ cards }) => (
  <div id="pile">
    {cards.map((cardName, index, arr) => (
      <Card
        styles={getPileStyles()}
        key={index}
        name={cardName}
        classes={index >= arr.length - 15 ? `card_${cardName}` : ""}
      />
    ))}
  </div>
);

const Card = ({ name, styles, classes, handleCardClick }) => (
  <div style={styles} className={`card ${classes}`} onClick={handleCardClick} />
);
const randomMargin = () => Math.floor(Math.random() * 40);

const getPileStyles = () => ({
  transform: `rotate(${-60 + randomMargin() * 3}deg)`,
  margin: `${randomMargin()}px ${randomMargin()}px ${randomMargin()}px ${randomMargin()}px`,
  position: "absolute"
});

const MainDeck = ({ cards }) => (
  <div>
    {cards.map((cardName, index, arr) => (
      <Card
        styles={{ left: `${index / 3}px`, position: "absolute" }}
        key={index}
        name={cardName}
        classes={index >= arr.length - 2 ? "card_back" : ""}
      />
    ))}
  </div>
);

const isSpecialCard = card => {
  const [number, color] = card;
  return (
    number === "taki" ||
    number === "stop" ||
    number === "plus" ||
    color === "colorful"
  );
};

class Player extends React.Component {
  constructor() {
    super();
    this.state = {
      isTaki: false
    }
    this.handleCardClick = this.handleCardClick.bind(this);
    this.isPlayableCard = this.isPlayableCard.bind(this);
    this.getAttributeFromName = this.getAttributeFromName.bind(this);
  }

  handleCardClick(index) {
    if (!this.isPlayableCard(index)) {
      return;
    }
    let card = this.props.cards[index];
    const [number, color] = card.split("_");
    let name = card;
    // if (color === "colorful") {
    //   //handle colorful
    //   if (number === "taki") {
    //     card = number + "_" + game.lastCard().color;
    //   }
    // }
    this.props.playCard(index, "playerDeck");
    this.props.switchPlayer(BOT);
    // if (isSpecialCard(card)) {
    //   if (number === "taki") {
    //     // game.openTaki();
    //     console.log("hi");
    //   }
    //   if (color !== "colorful") {
    //     // switchTurn(PLAYER, PLAYER)
    //   }
    // } else if (game.taki) {
    //   switchTurn(PLAYER, PLAYER);
    // } else if (number !== "") {
    //   game.setLastCardUnClickable();
    //   switchTurn(PLAYER, BOT);
    //   return;
    // }
  }

  isPlayableCard(index) {
    const { isTaki } = this.state
    const { lastPileCard, cards, cardIsActive } = this.props;
    const [lastCardNumber, lastCardColor] = lastPileCard.split("_");
    const [currentCardNumber, currentCardColor] = cards[index].split("_");

    if (cardIsActive && isTaki) {
      return lastCardColor === cardElem.color;
    }
    if (cardIsActive && lastCardNumber === "2plus") {
      return cardElem.number === "2plus";
    }
    return (
      lastCardColor === currentCardColor ||
      lastCardNumber ===currentCardNumber ||
      currentCardColor === "colorful"
    );
  }

  getAttributeFromName(name) {
    name = name.split("_");
    let card = [];
    card.number = name[0];
    card.color = name[1];
    return card;
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
  let leftPx = index * 50;
  if (length === 8) {
    leftPx = index * 30;
  }
  return {
    position: "relative",
    left: `-${leftPx}px`
  };
};

const PlayerDeck = ({ cards, handleCardClick, lastCard, active, taki, isPlayableCard ,isFacedUp}) => (
  <div>
    {cards.map((cardName, index, { length }) => (
      <Card
        key={index}
        styles={getStylesForPlayerCard(index, length)}
        classes={getPlayerClasses(isFacedUp,cardName)}
        handleCardClick={() => isPlayableCard(index) ? handleCardClick(index) : null}
      />
    ))}
  </div>
);

class Bot extends React.Component {
  constructor(deck, isFacedUp) {
    super(deck, isFacedUp);
    this.getAttributeFromName = this.getAttributeFromName.bind(this);
  }

  getAttributeFromName(name) {
    name = name.split("_");
    let card = [];
    card.number = name[0];
    card.color = name[1];
    return card;
  }

  getCardIndex(card){
    if(card === false)
      return -1;
    this.props.cards.forEach((element,index) => {
      if (element.color === card.color && element.number === card.number) {
        return index;
      }
    });
  }

  chooseCardIndex(active = true){
      let card = this.chooseCard(active);
      return this.getCardIndex(card);
  }

  chooseCard(active = true) { //the bot well aware of the cards he has (this.cards)
    let card = this.getAttributeFromName(this.props.lastPileCard);
    let number = card.number;
    let color = card.color;
    if (active && number === "2plus")
      return this.has2plus(); // options: card name, false (take a card from the pile)
    if (active && isSpecialCard(card)) {
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

  componentDidUpdate(){
    if(this.props.myTurn){
      card = this.chooseCard(this.props.lastPileCard);
      console.log(card);
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
