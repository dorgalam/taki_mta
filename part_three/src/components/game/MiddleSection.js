import React from 'react';

import {
  EndingDisplay,
  MainDeck,
  Pile,
  TakiIdentifier,
  TurnIdentifier,
  Statistics
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
  statsRef,
  winner,
  msg,
  takiIdentifier,
  colorIdentifier,
  playersFinished,
  allStats
}) => (
    <div id="content">
      <Pile cards={pileCards} />
      <MainDeck
        cards={mainDeckCards}
        giveCardToPlayer={takeCard}
        allowTake={allowTake}
      />
      <TurnIdentifier player={player} />
      <a id="msg">{msg}</a>
      <TakiIdentifier
        openTaki={takiIdentifier}
        closeTaki={closeTaki}
      />
      <ColorPick
        choose={colorIdentifier}
        selectColor={color => () => selectColor(color)}
      />
      <EndingDisplay stats={stats} allStats={allStats} winner={winner} playersFinished={playersFinished} />
      <Statistics ref={statsRef} curPlayer={player} gameOver={winner !== -1} {...stats} />
    </div>
  );

const ColorPick = ({ choose, selectColor }) =>
  choose ? (
    <div className="color_tooltip">
      <div onClick={selectColor('blue')} className="color_tooltip_blue" />
      <div onClick={selectColor('green')} className="color_tooltip_green" />
      <div onClick={selectColor('red')} className="color_tooltip_red" />
      <div onClick={selectColor('yellow')} className="color_tooltip_yellow" />
    </div>
  ) : null;

export default MiddleSection;
