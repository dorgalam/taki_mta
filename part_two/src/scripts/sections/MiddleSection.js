import React from 'react';

import {
  EndingDisplay,
  MainDeck,
  Pile,
  TakiIdentifier,
  TurnIdentifier
} from './middle';

import { utils, Card, enums } from './cross';

const { createCardsArray } = utils;
const { PLAYER, BOT } = enums;

const MiddleSection = ({
  mainDeckCards,
  pileCards = [],
  player,
  takeCard,
  isTaki,
  closeTaki,
  selectColor,
  allowTake,
  stats
}) => (
  <div id="content">
    <StartGameButton />
    <Pile cards={pileCards} />
    <MainDeck
      cards={mainDeckCards}
      giveCardToPlayer={takeCard}
      allowTake={allowTake}
    />
    {JSON.stringify(stats, 0, 1)}
    <TurnIdentifier myTurn={player === PLAYER} />
    <TakiIdentifier
      openTaki={player === PLAYER && isTaki}
      closeTaki={closeTaki}
    />
    <Statistics {...stats} />
    <ColorPick
      choose={player === -1}
      selectColor={color => () => selectColor(color)}
    />
    <EndingDisplay />
  </div>
);

const ColorPick = ({ choose, selectColor }) =>
  choose ? (
    <div className="color_tooltip">
      <a>Choose Color:</a>
      <div onClick={selectColor('red')} className="color_tooltip_red" />
      <div onClick={selectColor('yellow')} className="color_tooltip_yellow" />
      <div onClick={selectColor('blue')} className="color_tooltip_blue" />
      <div onClick={selectColor('green')} className="color_tooltip_green" />
    </div>
  ) : null;

const StartGameButton = ({}) => (
  <button type="button" id="startGame" className="btn start-game-button">
    Start Game
  </button>
);

const Statistics = ({ turns, lastCard }) => (
  <div id="stats-section">
    <div id="p1-stats" className="stats">
      <h1>Your Stats:</h1>
      <Timer />
      <h2>
        Average turn time:
        <div id="avg_time">{turns}</div>
      </h2>
      <h2>
        Last card declerations:
        <div id="last_one">{lastCard}</div>
      </h2>
    </div>
  </div>
);

class Timer extends React.Component {
  constructor() {
    super();
    this.state = {
      elapsed: new Date()
    };
    this.getHours = this.getHours.bind(this);
    this.getMinutes = this.getMinutes.bind(this);
    this.getSeconds = this.getSeconds.bind(this);
  }
  componentDidMount() {
    this.setState({ start: new Date(), elapsed: 0 });
    setInterval(() => {
      this.setState({
        elapsed: new Date() - this.state.start
      });
    }, 100);
  }

  getHours() {
    return Math.floor(this.state.elapsed / (60 * 60 * 1000));
  }
  getMinutes() {
    return Math.floor(this.state.elapsed / (60 * 1000)) % 60;
  }
  getSeconds() {
    return Math.floor(this.state.elapsed / 1000) % 60;
  }

  render() {
    return (
      <h2>
        Clock
        <a id="timer">{`${this.getHours()}:${this.getMinutes()}:${this.getSeconds()}`}</a>
      </h2>
    );
  }
}

export default MiddleSection;
