import React from 'react';
import { Bot, MiddleSection, Player } from './sections';
import { utils, Card, enums } from './sections/cross';

const { createCardsArray, isSpecialCard } = utils;
const { PLAYER, BOT } = enums;

class MainGameWindow extends React.Component {
  constructor() {
    super();
    this.state = {
      deckCards: createCardsArray().map(item => new Card(item)),
      playerDeck: [],
      botDeck: [],
      pileCards: [],
      currentPlayer: PLAYER,
      cardIsActive: false,
      isTaki: false,
      hasMove: false
    };
    this.takinNumber = 1;
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
  }

  switchPlayer(toPlayer) {
    this.setState({
      currentPlayer: toPlayer,
      hasMove: false
    });
  }

  hasMove(bool) {
    this.setState({
      hasMove: bool
    });
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
  }

  getBotProps() {
    const {
      botDeck,
      pileCards,
      currentPlayer,
      cardIsActive,
      isTaki,
      hasMove
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

  getMiddleProps() {
    const {
      deckCards,
      pileCards,
      currentPlayer,
      cardIsActive,
      isTaki,
      hasMove
    } = this.state;
    return {
      mainDeckCards: deckCards,
      pileCards: pileCards,
      player: currentPlayer, ///who's turn
      takeCard: currentPlayer === PLAYER ? this.takeCardFromMainDeck : null,
      isTaki: isTaki,
      closeTaki: this.closeTaki,
      selectColor: this.selectColor,
      allowTake: hasMove === false && currentPlayer === PLAYER //need to add has move
    };
  }

  getPlayerProps() {
    const {
      pileCards,
      currentPlayer,
      playerDeck,
      cardIsActive,
      isTaki,
      hasMove
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
      <div id="wrapper">
        <Bot {...this.getBotProps()} />
        <MiddleSection {...this.getMiddleProps()} />
        <Player {...this.getPlayerProps()} />
      </div>
    );
  }
}

export default MainGameWindow;
