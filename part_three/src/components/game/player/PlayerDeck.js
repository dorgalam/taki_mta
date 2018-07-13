import React from 'react';

import { CardComp, utils } from '../cross';

const { getStylesForPlayerCard, getPlayerClasses } = utils;

const PlayerDeck = ({
  cards,
  handleCardClick,
  lastCard,
  active,
  taki,
  isPlayableCard,
  isFacedUp
}) => (
  <div className="cards">
    {cards.map((card, index, { length }) => (
      <CardComp
        key={index}
        styles={getStylesForPlayerCard(index, length)}
        classes={
          getPlayerClasses(isFacedUp, card.name) +
          (isFacedUp && isPlayableCard(index) ? 'playable' : '')
        }
        handleCardClick={() =>
          isPlayableCard(index) ? handleCardClick(index) : null
        }
      />
    ))}
  </div>
);

export default PlayerDeck;
