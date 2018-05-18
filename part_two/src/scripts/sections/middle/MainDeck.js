import React from 'react';
import { CardComp, enums } from '../cross';

const { PLAYER, BOT } = enums;

const MainDeck = ({ cards, giveCardToPlayer, allowTake }) => (
  <div id="deck">
    {cards.map((card, index, arr) => (
      <CardComp
        styles={{ left: `${index / 3}px`, position: 'absolute' }}
        key={index}
        name={card.name}
        classes={
          allowTake && index === cards.length - 1
            ? 'card_back playable'
            : index === cards.length - 1
              ? 'card_back notplayable'
              : ''
        }
        handleCardClick={() =>
          allowTake && index === cards.length - 1
            ? giveCardToPlayer('playerDeck', BOT)
            : null
        }
      />
    ))}
  </div>
);

export default MainDeck;
