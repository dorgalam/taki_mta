import React from 'react';

import { PlayerDeck } from './player/index.js';
import { enums, utils, Card } from './cross';
const { isSpecialCard } = utils;

const { PLAYER, BOT } = enums;

class AnotherPlayer extends React.Component {
  render() {
    return (
      <div id="bot">
        <PlayerDeck
          cards={this.props.cards}
          lastCard={false}
          active={false}
          taki={false}
          isFacedUp={false}
          isPlayableCard={null}
        />
      </div>
    );
  }
}

export default AnotherPlayer;
