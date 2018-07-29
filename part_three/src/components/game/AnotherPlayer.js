import React from 'react';

import { PlayerDeck } from './player/index.js';
import { enums, utils, Card } from './cross';

class AnotherPlayer extends React.Component {
  render() {
    return (
      <div class="rival">
        <a>{this.props.name} deck:</a>
        <div id={this.props.name}>
          <PlayerDeck
            cards={this.props.cards}
            lastCard={false}
            active={false}
            taki={false}
            isFacedUp={false}
            isPlayableCard={null}
          />
        </div>
      </div>
    );
  }
}

export default AnotherPlayer;
