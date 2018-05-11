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
      currentPlayer: PLAYER
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

    setTimeout(() => {
      this.switchPlayer(BOT);
    }, 2000);
  }

  render() {
    const {
      botDeck,
      deckCards,
      pileCards,
      currentPlayer,
      playerDeck
    } = this.state;
    return (
      <div id="wrapper">
        <Bot cards={botDeck} />Î
        <MiddleSection
          mainDeckCards={deckCards}
          pileCards={pileCards}
          player={currentPlayer}
        />
        <Player playCard={this.playCard} switchPlayer={this.switchPlayer} cards={playerDeck} />
      </div>
    );
  }
}

const TurnIdentifier = ({ myTurn }) =>
  myTurn ? (
    <div id="turn" className="turn">
      <img id="turn-img" src="./styles/assets/yourturn.png" alt="turn" />
    </div>
  ) : null;

const EndingDisplay = ({}) => (
  <div id="ending" style={{ position: "absolute", left: "30%", top: "20%" }}>
    <div id="celebrate" style={{ display: "none" }}>
      <img src="./styles/assets/barney-celebrate.gif" alt="gif" />
    </div>
    <div id="loser" style={{ display: "none" }}>
      <img src="./styles/assets/loser.gif" alt="gif" />
      <img src="./styles/assets/cry.gif" alt="gif" />
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
const StartGameButton = ({}) => (
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
    this.handleCardClick = this.handleCardClick.bind(this);
  }

  handleCardClick(index) {
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

  render() {
    return (
      <div id="player">
        <PlayerDeck
          handleCardClick={this.handleCardClick}
          cards={this.props.cards}
        />
      </div>
    );
  }
}
class Bot extends React.Component {
  render() {
    return (
      <div id="bot">
        <PlayerDeck cards={this.props.cards} />
      </div>
    );
  }
}

const PlayerDeck = ({ cards, handleCardClick }) => (
  <div>
    {cards.map((cardName, index, { length }) => (
      <Card
        key={index}
        styles={getStylesForPlayerCard(index, length)}
        classes={`card_${cardName}`}
        handleCardClick={() => handleCardClick(index)}
      />
    ))}
  </div>
);

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

ReactDOM.render(<MainGameWindow />, document.getElementById("root"));

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
