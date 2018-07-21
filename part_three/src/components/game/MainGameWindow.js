import React from 'react';
import { AnotherPlayer, MiddleSection, Player } from '.';
import { utils, Card, enums } from './cross';

import { getGame, playGameWithId } from '../api';

const { createCardsArray, isSpecialCard, shuffleDeck } = utils;
const { PLAYER, BOT } = enums;

const StartGameButton = ({}) => (
  <button
    type="button"
    id="startGame"
    className="btn start-game-button"
    onClick={() => this.startGame()}
  >
    Start Game
  </button>
);

let playFunc;
let getGameInterval;

class MainGameWindow extends React.Component {
  constructor(props) {
    super(props);
    this.baseState = this.state;
    this.countTimer = this.countTimer.bind(this);
    this.setHasMove = this.setHasMove.bind(this);
    this.playCard = this.playCard.bind(this);
    this.setTaki = this.setTaki.bind(this);
    this.closeTaki = this.closeTaki.bind(this);
    this.takeCardFromMainDeck = this.takeCardFromMainDeck.bind(this);
    this.selectColor = this.selectColor.bind(this);
    this.getMiddleProps = this.getMiddleProps.bind(this);
    this.getPlayerProps = this.getPlayerProps.bind(this);
    this.setRewindIndex = this.setRewindIndex.bind(this);
    this.statsComp = React.createRef();
    this.setStats = this.setStats.bind(this);
    this.rewind = this.rewind.bind(this);
    this.gameOver = this.gameOver.bind(this);
    this.quit = this.quit.bind(this);
    this.state = {};
    playFunc = body =>
      playGameWithId(props.gameId, Object.assign({ args: [] }, body));
  }

  quit() {
    playFunc({
      action: 'quit'
    });
  }

  setStats(player) {}

  setHasMove(bool) {}

  rewind() {}

  playCard(index) {
    playFunc({
      action: 'playCard',
      args: [index]
    });
  }

  gameOver() {}

  takeCardFromMainDeck(deckName, player) {}

  closeTaki() {}

  selectColor(color) {
    playFunc({
      action: 'selectColor',
      args: [index]
    });
  }

  componentDidMount() {
    setInterval(() => {
      getGame(this.props.gameId).then(game => {
        this.setState(Object.assign(game.state, { render: true }));
      });
    }, 200);
  }

  setTaki() {}

  countTimer() {}

  setRewindIndex(index) {}

  getMiddleProps() {
    const {
      deckCards,
      pileCards,
      currentPlayer,
      cardIsActive,
      isTaki,
      playerHasMove,
      stats,
      botStats,
      winner,
      msg
    } = this.state;
    return {
      mainDeckCards: deckCards,
      pileCards: pileCards,
      player: currentPlayer, ///who's turn
      takeCard: currentPlayer === PLAYER ? this.takeCardFromMainDeck : null,
      isTaki: isTaki,
      stats: stats,
      closeTaki: this.closeTaki,
      selectColor: this.selectColor,
      statsRef: this.statsComp,
      allowTake: playerHasMove === false && currentPlayer === PLAYER && !isTaki,
      rewindProps: {
        inRewind: this.state.inRewind,
        setRewindIndex: this.setRewindIndex,
        numberOfTurns: this.state.history.length,
        rewind: this.rewind
      },
      botStats: botStats,
      winner: winner,
      msg: msg
    };
  }

  getPlayerProps() {
    const {
      pileCards,
      currentPlayer,
      playerDecks,
      cardIsActive,
      isTaki,
      winner
    } = this.state;
    return {
      playCard: currentPlayer === this.props.playerName ? this.playCard : null,
      switchPlayer: this.switchPlayer,
      cards: playerDecks[this.props.playerName],
      isActive: cardIsActive,
      lastPileCard: pileCards[pileCards.length - 1],
      isTaki: isTaki,
      setTaki: this.setTaki,
      hasMove: this.setHasMove,
      buildDeck: this.buildNewMainDeck,
      gameOver: winner !== -1
    };
  }

  render() {
    return (
      <div>
        {this.state.render ? (
          <div id="wrapper" className={this.state.inRewind ? 'rewinding' : ''}>
            <button id="quit" className="btn" onClick={() => this.quit()}>
              Quit{' '}
            </button>
            {Object.keys(this.state.playerDecks)
              .filter(name => name !== this.props.playerName)
              .map(player => (
                <AnotherPlayer cards={this.state.playerDecks[player]} />
              ))}
            <button
              type="button"
              id="restart"
              className="clickable btn"
              onClick={this.props.restart}
              disabled={!this.state.inRewind}
              hidden={!this.state.inRewind}
            >
              Restart
            </button>
            <MiddleSection {...this.getMiddleProps()} />
            <Player {...this.getPlayerProps()} />
          </div>
        ) : null}
      </div>
    );
  }
}

export default MainGameWindow;
