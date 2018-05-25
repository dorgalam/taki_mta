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
  playerTurnEnds: 0,
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
  msg: ""
});

const StartGameButton = ({ }) => (
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
    this.hasMove = this.hasMove.bind(this);
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

  quit() {
    this.setState({
      winner: BOT,
      currentPlayer: -2
    });
  }

  setStats(player) {
    if (player === PLAYER) {
      const { stats } = this.state;
      this.setState({
        stats: {
          turns: stats.turns + 1,
          lastCard: stats.lastCard
        },
        playerTurnEnds: true
      });
    } else if (player === BOT) {
      const { botStats } = this.state;
      this.setState({
        botStats: {
          turns: botStats.turns + 1,
          lastCard: botStats.lastCard
        },
        playerTurnEnds: true
      });
    }
  }

  componentDidMount() {
    this.setState(getInitialState());
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
        this.setState({ lstTime: totalSeconds, msg: "" });
      } else {
        this.statsComp.current.setTurnTime(totalSeconds - lstTime); // player turn ends calculate his turn time
      }
    }

    this.setState({
      currentPlayer: toPlayer,
      playerHasMove: false
    });
  }

  hasMove() {
    if (this.state.playerHasMove === true) return true;
    this.setState({
      playerHasMove: true
    });
    return true;
  }

  componentWillUnmount() {
    clearInterval(this.timerVar);
  }

  componentDidUpdate(prevProps, prevState) {
    const { playerDeck, botDeck } = this.state;
    const prevPlayerDeck = prevState.playerDeck;
    const prevBotDeck = prevState.botDeck;
    if (playerDeck.length === 1 && prevPlayerDeck.length !== 1) {
      const { stats } = this.state;
      stats.lastCard++;
      this.setState({
        stats
      });
    } else if (botDeck.length === 1 && prevBotDeck.length !== 1) {
      const { botStats } = this.state;
      botStats.lastCard++;
      this.setState({
        botStats
      });
    }
    if (this.state.winner === -1) {
      let winner = this.gameOver();
      if (winner >= 0 && !this.state.inRewind) {
        this.setState({
          winner: winner,
          currentPlayer: -2
        });
      }
    }
  }

  updateHistory() {
    const { inRewind, winner } = this.state;
    if (!inRewind && this.statsComp) {
      const stateSnapshot = Object.assign({}, this.state, {
        childStats: this.statsComp.current.getState()
      });
      delete stateSnapshot.history;
      this.setState({ history: [...this.state.history, stateSnapshot] });
    }
  }

  rewind() {
    this.rewindIndex = 0;
    this.setState({ inRewind: true });
    console.log(this.state.inRewind);
  }

  dealCardsToPlayers() {
    const cardsInDeck = [...this.state.deckCards],
      playerDeck = [],
      botDeck = [],
      pileCards = [];
    for (let i = 0; i < 8; ++i) {
      playerDeck.push(cardsInDeck.pop());
      botDeck.push(cardsInDeck.pop());
    }
    let card;
    while ((card = cardsInDeck.pop())) {
      if (!isSpecialCard(card) && card.number !== '2plus') {
        pileCards.push(card);
        break;
      }
      cardsInDeck.unshift(card);
    }
    this.setState({
      deckCards: cardsInDeck,
      playerDeck,
      botDeck,
      pileCards
    });
  }

  buildNewMainDeck() {
    const copiedDeck = [...this.state.pileCards];
    const lastPileCard = [];
    lastPileCard.push(copiedDeck.pop());
    let newDeck = this.state.deckCards;
    copiedDeck.forEach((element, index) => {
      newDeck.push(new Card(element.card, element.card));
    });
    newDeck = shuffleDeck(newDeck);

    this.setState({
      deckCards: copiedDeck,
      pileCards: lastPileCard
    });
    return newDeck;
  }

  playCard(index, deckName) {
    const {
      stats,
      isTaki,
      currentPlayer,
      lstTime,
      totalSeconds,
      takinNumber
    } = this.state;
    const copiedDeck = [...this.state[deckName]];
    const cardToPlay = copiedDeck.popIndex(index);
    const newPile = [...this.state.pileCards, cardToPlay];
    let takeCount = takinNumber;
    if (cardToPlay.number === '2plus' && !isTaki) {
      takeCount = takeCount === 1 ? 0 : takeCount;
      takeCount += 2;
    }
    if (cardToPlay.color === 'colorful') {
      this.setState({ msg: "pick a color" });
      this.switchPlayer(-1);
    }
    if (
      currentPlayer === PLAYER &&
      !isTaki &&
      (cardToPlay.number === 'plus' || cardToPlay.number === 'stop')
    ) {
      this.setState({ msg: cardToPlay.number + '- you have another turn' });
      this.setStats(currentPlayer);
      this.statsComp.current.setTurnTime(totalSeconds - lstTime);
      this.setState({ lstTime: totalSeconds });
    }
    this.setState({
      [deckName]: copiedDeck,
      pileCards: newPile,
      cardIsActive: true,
      takinNumber: takeCount,
    });
    this.updateHistory();
  }

  gameOver() {
    const lastPileCard = this.state.pileCards[this.state.pileCards.length - 1];
    const { playerDeck, botDeck } = this.state;
    let winner = -1;
    if (playerDeck.length === 0) {
      if (!this.state.cardIsActive) {
        winner = PLAYER;
      } else if (
        lastPileCard.number !== 'plus' &&
        lastPileCard.number !== '2plus'
      ) {
        winner = PLAYER;
      }
    }
    if (botDeck.length === 0) {
      if (!this.state.cardIsActive) {
        winner = BOT;
      } else if (
        lastPileCard.number !== 'plus' &&
        lastPileCard.number !== '2plus'
      ) {
        winner = BOT;
      }
    }
    return winner;
  }

  takeCardFromMainDeck(deckName, player) {
    let cards = [];
    let copiedDeck = [...this.state.deckCards];
    for (let i = 0; i < this.state.takinNumber; i++) {
      cards.push(copiedDeck.pop());
      if (copiedDeck.length === 1) copiedDeck = this.buildNewMainDeck();
    }
    const newPile = [...this.state[deckName], ...cards];

    this.setState({
      deckCards: copiedDeck,
      [deckName]: newPile,
      cardIsActive: false,
      takinNumber: 1
    });
    this.updateHistory();
    this.switchPlayer(player);
  }

  closeTaki() {
    let lastcard = this.state.pileCards[this.state.pileCards.length - 1];
    this.setTaki(false);
    if (lastcard.number === 'plus' || lastcard.number === 'stop') {
      this.setState({ msg: lastcard.number + '- you have another turn' });
      this.setStats(PLAYER);
      this.statsComp.current.setTurnTime(
        this.state.totalSeconds - this.state.lstTime
      );
    }
    let takeCount = this.state.takinNumber;
    if (lastcard.number === '2plus') {
      takeCount = takeCount === 1 ? 0 : takeCount;
      takeCount += 2;
      this.setState({
        takinNumber: takeCount
      });
    }
    if (isSpecialCard(lastcard) && lastcard.number !== 'taki')
      this.switchPlayer(PLAYER);
    else {
      this.setState({ msg: "" });
      this.switchPlayer(BOT);
    }
  }

  setTaki(bool) {
    if (bool === true && this.state.currentPlayer === PLAYER) {
      this.setState({ msg: 'taki you can put all the cards off this color' });
    }
    this.setState({
      isTaki: bool
    });
  }

  selectColor(color) {
    let copiedDeck = [...this.state.pileCards];
    let card = copiedDeck.pop();
    card = new Card('_' + color, 'change_colorful');
    copiedDeck.push(card);
    this.setState({
      pileCards: copiedDeck,
      msg: ""
    });
    this.setStats(PLAYER);
    this.switchPlayer(BOT);
  }

  componentDidMount() {
    this.dealCardsToPlayers();
    this.timerVar = setInterval(this.countTimer, 1000);
    this.updateHistory();
  }

  countTimer() {
    let newTime = this.state.totalSeconds + 1;
    this.setState({ totalSeconds: newTime });
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
      allowTake: playerHasMove === false && currentPlayer === PLAYER,
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
      hasMove: this.hasMove,
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
