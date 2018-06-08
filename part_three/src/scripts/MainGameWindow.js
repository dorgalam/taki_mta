import React from 'react';
import { Bot, MiddleSection, Player } from './sections';
import { utils, Card, enums } from './sections/cross';

const { createCardsArray, isSpecialCard, shuffleDeck } = utils;
const { PLAYER, BOT } = enums;

const getInitialState = () => ({
  deckCards: createCardsArray().map(item => new Card(item)),
  playerDeck: [],
  botDeck: [],
  pileCards: [],
  currentPlayer: PLAYER,
  cardIsActive: false,
  isTaki: false,
  playerHasMove: false,
  consecutiveBotTurn: 0,
  timerVar: 0,
  lstTime: 0,
  totalSeconds: 0,
  turnSwitched: 0,
  stats: {
    turns: 0,
    lastCard: 0
  },
  botStats: {
    turns: 0,
    lastCard: 0
  },
  history: [],
  winner: -1,
  takinNumber: 1,
  msg: ''
});

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

class MainGameWindow extends React.Component {
  constructor() {
    super();
    this.state = getInitialState();
    this.baseState = this.state;
    this.countTimer = this.countTimer.bind(this);
    this.setHasMove = this.setHasMove.bind(this);
    this.playCard = this.playCard.bind(this);
    this.setTaki = this.setTaki.bind(this);
    this.closeTaki = this.closeTaki.bind(this);
    this.takeCardFromMainDeck = this.takeCardFromMainDeck.bind(this);
    this.switchPlayer = this.switchPlayer.bind(this);
    this.selectColor = this.selectColor.bind(this);
    this.getBotProps = this.getBotProps.bind(this);
    this.getMiddleProps = this.getMiddleProps.bind(this);
    this.getPlayerProps = this.getPlayerProps.bind(this);
    this.buildNewMainDeck = this.buildNewMainDeck.bind(this);
    this.updateHistory = this.updateHistory.bind(this);
    this.setRewindIndex = this.setRewindIndex.bind(this);
    this.statsComp = React.createRef();
    this.setStats = this.setStats.bind(this);
    this.rewind = this.rewind.bind(this);
    this.gameOver = this.gameOver.bind(this);
    this.quit = this.quit.bind(this);
  }

  switchPlayer(toPlayer) {
    let {
      currentPlayer,
      cardIsActive,
      pileCards,
      isTaki,
      consecutiveBotTurn,
      lstTime,
      totalSeconds
    } = this.state;
    const lastPileCard = pileCards[pileCards.length - 1];
    let from = currentPlayer === -1 ? PLAYER : currentPlayer;
    if (from !== toPlayer && toPlayer !== -1) {
      this.setStats(currentPlayer);
      if (toPlayer === PLAYER) {
        this.setState({ lstTime: totalSeconds });
      } else {
        this.statsComp.current.setTurnTime(totalSeconds - lstTime); // player turn ends calculate his turn time
        this.setState({ msg: '' });
      }
      if (toPlayer === BOT) {
        this.setState({ msg: '' });
      }
    }

    this.setState({
      currentPlayer: toPlayer,
      playerHasMove: false
    });
  }

  componentDidMount() {
    this.setState(getInitialState());
    this.dealCardsToPlayers();
    this.timerVar = setInterval(this.countTimer, 1000);
    this.updateHistory();
  }

  getBotProps() {
    const {
      botDeck,
      pileCards,
      currentPlayer,
      cardIsActive,
      isTaki,
      inRewind
    } = this.state;
    return {
      cards: botDeck,
      myTurn: currentPlayer === BOT,
      playCard: currentPlayer === BOT ? this.playCard : '',
      switchPlayer: this.switchPlayer,
      lastPileCard: pileCards[pileCards.length - 1],
      isActive: cardIsActive,
      isTaki: isTaki,
      setTaki: this.setTaki,
      takeCard: this.takeCardFromMainDeck,
      inRewind: inRewind
    };
  }

  setRewindIndex(index) {
    const { history } = this.state;
    this.setState(history[index]);
    if (history[index]) {
      this.statsComp.current.overrideState(history[index].childStats);
    }
  }

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
      playerDeck,
      cardIsActive,
      isTaki,
      winner
    } = this.state;
    return {
      playCard: currentPlayer === PLAYER ? this.playCard : null,
      switchPlayer: this.switchPlayer,
      cards: playerDeck,
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
      <div id="wrapper" className={this.state.inRewind ? 'rewinding' : ''}>
        <Bot {...this.getBotProps()} />
        <button id="quit" className="btn" onClick={() => this.quit()}>
          Quit{' '}
        </button>
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
    );
  }
}

export default MainGameWindow;
