import React from 'react';

import {
  EndingDisplay,
  MainDeck,
  Pile,
  TakiIdentifier,
  TurnIdentifier,
  Statistics,
  RewindUI
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
  stats,
  botStats,
  statsRef,
  winner,
  rewindProps
}) => (
    <div id="content">

      <Pile cards={pileCards} />
      <RewindUI {...rewindProps} winner={winner === -1} />
      <MainDeck
        cards={mainDeckCards}
        giveCardToPlayer={takeCard}
        allowTake={allowTake}
      />
      <TurnIdentifier myTurn={player === PLAYER} />
      <TakiIdentifier
        openTaki={player === PLAYER && isTaki}
        closeTaki={closeTaki}
      />
      <ColorPick
        choose={player === -1}
        selectColor={color => () => selectColor(color)}
      />
      <EndingDisplay stats={botStats} rewindProps={rewindProps} winner={winner} />
      <Statistics ref={statsRef} gameOver={winner !== -1} {...stats} />
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

const StartGameButton = ({ }) => (
  <button type="button" id="startGame" className="btn start-game-button">
    Start Game
  </button>
);

export default MiddleSection;
