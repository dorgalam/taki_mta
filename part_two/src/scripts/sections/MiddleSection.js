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
      <ColorPick choose={player === -1} selectColor={color => () => selectColor(color)} />
      <EndingDisplay />
    </div>
  );



const ColorPick = ({ choose, selectColor }) =>
  choose ? (
    <div className="color_tooltip"><a>Choose Color:</a>
      <div onClick={selectColor('red')} className="color_tooltip_red"></div>
      <div onClick={selectColor('yellow')} className="color_tooltip_yellow"></div>
      <div onClick={selectColor('blue')} className="color_tooltip_blue"></div>
      <div onClick={selectColor('green')} className="color_tooltip_green"></div>
    </div>
  ) : null;

const StartGameButton = ({ }) => (
  <button type="button" id="startGame" className="btn start-game-button">
    Start Game
  </button>
);

export default MiddleSection;
