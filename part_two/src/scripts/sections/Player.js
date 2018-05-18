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
    let card = this.props.cards[index];
    let name = card.name;
    const { number, color } = card;
    if (color === "colorful") {//handle colorful
      if (number === "taki") {
        this.props.setTaki(true);
        this.props.cards[index] = new Card(number + "_" + this.props.lastPileCard.color);
      }//set last unclickable - done auto
    }
    this.props.playCard(index, "playerDeck");
    if (isSpecialCard(card)) {
      if (number === "taki") {
        this.props.setTaki(true);
      }
    } else if (this.props.isTaki) {
      this.props.switchPlayer(PLAYER);
    } else if (number !== "") {
      this.props.switchPlayer(BOT);
      return;
    }
    if (card.name !== "change_colorful")
      this.props.switchPlayer(PLAYER);
  }

  isPlayableCard(index) {
    const { lastPileCard, cards, isActive, isTaki } = this.props;
    const currentCard = cards[index];
    let bool = false;
    if (isActive && isTaki) {
      return lastPileCard.color === currentCard.color ? this.props.hasMove() : false;
    }
    if (isActive && lastPileCard.number === "2plus") {
      return currentCard.number === "2plus" ? this.props.hasMove() : false;
    }
    return (
      lastPileCard.color === currentCard.color ||
        lastPileCard.number === currentCard.number ||
        currentCard.color === "colorful" ? this.props.hasMove() : false
    );
  }

  render() {
    return (
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
    );
  }
}

export default Player;
