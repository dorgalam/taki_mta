import React from 'react';
import { PlayerDeck } from './player/index.js';
import { enums, Card, utils } from './cross';

const { isSpecialCard } = utils;
const { PLAYER, BOT } = enums;

class Player extends React.Component {
  constructor() {
    super();

    this.handleCardClick = this.handleCardClick.bind(this);
    this.isPlayableCard = this.isPlayableCard.bind(this);
  }

  handleCardClick(index) {
    if (!this.isPlayableCard(index)) {
      return;
    }
    this.props.playCard(index);
  }

  isPlayableCard(index) {
    const { lastPileCard, cards, isActive, isTaki } = this.props;
    const currentCard = cards[index];
    if (isActive && isTaki) {
      return this.props.playCard !== null && lastPileCard.color === currentCard.color;
    }
    if (isActive && lastPileCard.number === '2plus') {
      return this.props.playCard !== null && currentCard.number === '2plus';
    }
    return (
      this.props.playCard !== null &&
      (lastPileCard.color === currentCard.color ||
        lastPileCard.number === currentCard.number ||
        currentCard.color === 'colorful')
    );
  }

  componentDidUpdate() {
    let hasMove = false;
    this.props.cards.forEach((element, index) => {
      if (this.isPlayableCard(index)) {
        hasMove = true;
      }
    });
    this.props.hasMove(hasMove);
  }

  render() {
    return !this.props.gameOver ? (
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
    ) : null;
  }
}

export default Player;
