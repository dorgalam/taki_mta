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
  allowTake
}) => (
  <div id="content">
    <StartGameButton />
    <Pile cards={pileCards} />
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
    <EndingDisplay />
  </div>
);

const StartGameButton = ({}) => (
  <button type="button" id="startGame" className="btn start-game-button">
    Start Game
  </button>
);

export default MiddleSection;
