import React from "react";
import ReactDOM from "react-dom";
import "./styles/style.css";
import "./styles/cards.css";

const shuffleDeck = deck => {
  const times = 5 + Math.floor(Math.random() * 100);
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

class MainGameWindow extends React.Component {
  constructor() {
    super();
    this.state = {
      deckCards: createCardsArray(),
      playerDeck: [],
      botDeck: []
    };
  }

  dealCardsToPlayers() {
    const cardsInDeck = [...this.state.deckCards],
      playerDeck = [],
      botDeck = [];
    for (let i = 0; i < 8; ++i) {
      playerDeck.push(cardsInDeck.pop());
      botDeck.push(cardsInDeck.pop());
    }
    this.setState({
      deckCards: cardsInDeck,
      playerDeck,
      botDeck
    });
  }

  componentDidMount() {
    this.dealCardsToPlayers();
  }

  render() {
    return (
      <div id="wrapper">
        <Bot cards={this.state.botDeck} />
        <MiddleSection cards={this.state.deckCards}/>
        <Player cards={this.state.playerDeck} />
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
const MiddleSection = ({cards}) => (
  <div id="content">
    <StartGameButton/>
    <div id="pile" />
    <MainDeck cards={cards} />
    <TurnIdentifier />
    <EndingDisplay />
  </div>
);

const Card = ({ name, styles, classes }) => (
  <div style={styles} className={`card ${classes}`} />
);

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

class Player extends React.Component {
  render() {
    return (
      <div id="player">
        <PlayerDeck cards={this.props.cards} />
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

const PlayerDeck = ({ cards }) => (
  <div style={{ position: "absolute" }}>
    {cards.map((cardName, index, { length }) => (
      <Card
        key={index}
        styles={getStylesForPlayerCard(index, length)}
        classes={`card_${cardName}`}
      />
    ))}
  </div>
);

ReactDOM.render(<MainGameWindow />, document.getElementById("root"));

function getStylesForPlayerCard(index, length) {
  let leftPx = index * 50;
  if (length === 8) {
    leftPx = index * 30;
  }
  return {
    position: "relative",
    left: `-${leftPx}px`
  };
}
