import React from 'react';
import { Bot, MiddleSection, Player } from './sections';
import { utils, Card, enums } from './sections/cross';

const { createCardsArray, isSpecialCard } = utils;
const { PLAYER, BOT } = enums;

const initalState = {
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
  history: []
};

class MainGameWindow extends React.Component {
  constructor() {
    super();
    this.state = initalState;
    this.takinNumber = 1;
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
    this.statsComp = {};
    this.rewind = this.rewind.bind(this);
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
    currentPlayer = currentPlayer === -1 ? PLAYER : currentPlayer;
    this.updateHistory();
    if (currentPlayer !== toPlayer) {
      // this.state.turnSwitched = true;
      if (toPlayer === PLAYER) {
        this.setState({ lstTime: totalSeconds });
      } else {
        const { stats } = this.state;
        this.setState({
          stats: {
            turns: stats.turns + 1,
            lastCard: stats.lastCard
          },
          playerTurnEnds: true
        });
        this.statsComp.setTurnTime(totalSeconds - lstTime); // player turn ends calculate his turn time
      }
      //auto --- set stats
      // if (!(cardIsActive && lastPileCard.number === '2plus')) {
      //   if (gameOver())
      //     //check if game over
      //     return;
      // }
    } else if (
      !isTaki &&
      (lastPileCard.number === 'plus' || lastPileCard.number === 'stop')
    ) {
      //auto  --  set stats
      // this.state.turnSwitched = true;
      // if (lastPileCard.number === 'stop') {
      //   if (gameOver())
      //     //check if game over
      //     return;
      // }
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

  componentDidUpdate(prevProps, prevState) {
    const { playerDeck, botDeck } = this.state;
    const prevPlayerDeck = prevState.playerDeck;
    const prevBotDeck = prevState.botDeck;
    if (
      (playerDeck.length === 1 && prevPlayerDeck.length !== 1) ||
      (botDeck.length === 1 && prevBotDeck.length !== 1)
    ) {
      const { stats } = this.state;
      stats.lastCard++;
      this.setState({
        stats
      });
    }
  }

  updateHistory() {
    const { inRewind } = this.state;
    if (!inRewind && this.statsComp) {
      const stateSnapshot = Object.assign({}, this.state, {
        childStats: this.statsComp.getState()
      });
      delete stateSnapshot.history;
      this.setState({ history: [...this.state.history, stateSnapshot] });
    }
  }

  rewind() {
    const { history } = this.state;
    this.rewindIndex = 0;
    this.setState({ inRewind: true });
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
    const copiedDeck = [...this.state[deckName]];
    const cardToPlay = copiedDeck.popIndex(index);
    const newPile = [...this.state.pileCards, cardToPlay];
    if (cardToPlay.number === '2plus') {
      this.takinNumber = this.takinNumber === 1 ? 0 : this.takinNumber;
      this.takinNumber += 2;
    }
    if (cardToPlay.color === 'colorful') {
      this.switchPlayer(-1);
    }

    this.setState({
      [deckName]: copiedDeck,
      pileCards: newPile,
      cardIsActive: true
    });
  }

  takeCardFromMainDeck(deckName, player) {
    let cards = [];
    let copiedDeck = [...this.state.deckCards];
    for (let i = 0; i < this.takinNumber; i++) {
      cards.push(copiedDeck.pop());
      if (copiedDeck.length === 1) copiedDeck = this.buildNewMainDeck();
    }
    this.takinNumber = 1;
    const newPile = [...this.state[deckName], ...cards];

    this.setState({
      deckCards: copiedDeck,
      [deckName]: newPile,
      cardIsActive: false
    });
    this.switchPlayer(player);
  }

  closeTaki() {
    let lastcard = this.state.pileCards[this.state.pileCards.length - 1];
    this.setTaki(false);
    if (isSpecialCard(lastcard) && lastcard.number !== 'taki')
      this.switchPlayer(PLAYER);
    else {
      this.switchPlayer(BOT);
    }
  }

  setTaki(bool) {
    this.setState({
      isTaki: bool
    });
  }

  selectColor(color) {
    this.state.pileCards[this.state.pileCards.length - 1] = new Card(
      '_' + color
    );
    this.switchPlayer(BOT);
  }

  componentDidMount() {
    this.dealCardsToPlayers();
    this.timerVar = setInterval(this.countTimer, 1000);
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
      isTaki
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
      takeCard: this.takeCardFromMainDeck
    };
  }

  setRewindIndex(index) {
    const { history } = this.state;
    this.setState(history[index]);
    this.statsComp.overrideState(history[index].childStats);
  }

  getMiddleProps() {
    const {
      deckCards,
      pileCards,
      currentPlayer,
      cardIsActive,
      isTaki,
      playerHasMove,
      stats
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
      statsRef: ref => (this.statsComp = ref),
      allowTake: playerHasMove === false && currentPlayer === PLAYER, //need to add has move,
      rewindProps: {
        inRewind: this.state.inRewind,
        setRewindIndex: this.setRewindIndex,
        numberOfTurns: this.state.history.length,
        rewind: this.rewind
      }
    };
  }

  getPlayerProps() {
    const {
      pileCards,
      currentPlayer,
      playerDeck,
      cardIsActive,
      isTaki
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
      buildDeck: this.buildNewMainDeck
    };
  }

  render() {
    return (
      <div id="wrapper" className={this.state.inRewind ? 'rewinding' : ''}>
        <Bot {...this.getBotProps()} />
        <MiddleSection {...this.getMiddleProps()} />
        <Player {...this.getPlayerProps()} />
      </div>
    );
  }
}

export default MainGameWindow;
