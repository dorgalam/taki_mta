const PLAYER = 0;

const shuffleDeck = deck => {
  const times = 300 + Math.floor(Math.random() * 500);
  let copiedDeck = [...deck];
  for (let i = 0; i < times; ++i) {
    const cardsToRemove = Math.floor((Math.random() * copiedDeck.length) / 2);
    const up = Math.floor(Math.random() * 2);
    const portions = [
      copiedDeck.slice(0, cardsToRemove / 2 + 1),
      copiedDeck.slice(
        cardsToRemove / 2 + 1,
        cardsToRemove / 2 + 1 + cardsToRemove
      ),
      copiedDeck.slice(cardsToRemove / 2 + cardsToRemove + 1)
    ];
    if (up) {
      copiedDeck = []
        .concat(portions[1])
        .concat(portions[0])
        .concat(portions[2]);
    } else {
      copiedDeck = []
        .concat(portions[0])
        .concat(portions[2])
        .concat(portions[1]);
    }
  }
  return copiedDeck;
};

const createCardsArray = () => {
  const cards = [
    '1',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    'taki',
    'stop',
    'plus',
    '2plus'
  ];
  const colors = ['red', 'blue', 'green', 'yellow'];
  const arr = [];
  let card;
  cards.forEach(number => {
    colors.forEach(color => {
      card = `${String(number)}_${color}`;
      arr.push(card);
      arr.push(card);
    });
  });
  colors.forEach(color => {
    arr.push('change_colorful');
  });
  arr.push('taki_colorful');
  arr.push('taki_colorful');
  return shuffleDeck(arr);
};

class Card {
  constructor(card, orig = '') {
    this.name = card;
    const [number, color] = card.split('_');
    this.number = number;
    this.color = color;
    this.card = orig === '' ? JSON.stringify(card) : JSON.stringify(orig);
    this.card = JSON.parse(this.card);
  }
}

class Game {
  constructor() {
    this.members = this.getInitialState();
  }
  getInitialState() {
    return {
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
    };
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
    } = this.members;

    const lastPileCard = pileCards[pileCards.length - 1];
    let from = currentPlayer === -1 ? PLAYER : currentPlayer;
    if (from !== toPlayer && toPlayer !== -1) {
      this.setStats(currentPlayer);
      if (toPlayer === PLAYER) {
        this.setMembers({ lstTime: totalSeconds });
      } else {
        this.statsComp.current.setTurnTime(totalSeconds - lstTime); // player turn ends calculate his turn time
        this.setMembers({ msg: '' });
      }
      if (toPlayer === BOT) {
        this.setMembers({ msg: '' });
      }
    }
  }
  setMembers(newMembers) {
    this.members = Object.assign({}, this.members, newMembers);
  }

  quit() {
    this.setMembers({
      winner: BOT,
      currentPlayer: -2
    });
  }

  setStats(player) {
    if (player === PLAYER) {
      const { stats } = this.members;
      this.setMembers({
        stats: {
          turns: stats.turns + 1,
          lastCard: stats.lastCard
        }
      });
    } else if (player === BOT) {
      const { botStats } = this.members;
      this.setMembers({
        botStats: {
          turns: botStats.turns + 1,
          lastCard: botStats.lastCard
        }
      });
    }
  }
  setHasMove(bool) {
    if (this.members.playerHasMove === bool) return;
    this.setMembers({
      playerHasMove: bool
    });
  }

  componentWillUnmount() {
    clearInterval(this.timerVar);
  }

  componentDidUpdate(prevProps, prevState) {
    const { playerDeck, botDeck } = this.members;
    const prevPlayerDeck = prevState.playerDeck;
    const prevBotDeck = prevState.botDeck;
    if (playerDeck.length === 1 && prevPlayerDeck.length !== 1) {
      const { stats } = this.members;
      stats.lastCard++;
      this.setMembers({
        stats
      });
    } else if (botDeck.length === 1 && prevBotDeck.length !== 1) {
      const { botStats } = this.members;
      botStats.lastCard++;
      this.setMembers({
        botStats
      });
    }
    if (this.members.winner === -1) {
      let winner = this.gameOver();
      if (winner >= 0 && !this.members.inRewind) {
        this.setMembers({
          winner: winner,
          currentPlayer: -2
        });
      }
    }
  }

  updateHistory() {
    const { inRewind, winner } = this.members;
    if (!inRewind && this.statsComp) {
      const stateSnapshot = Object.assign({}, this.members, {
        childStats: this.statsComp.current.getState()
      });
      delete stateSnapshot.history;
      this.setMembers({ history: [...this.members.history, stateSnapshot] });
    }
  }

  rewind() {
    this.rewindIndex = 0;
    this.setMembers({ inRewind: true });
    console.log(this.members.inRewind);
  }

  dealCardsToPlayers() {
    const cardsInDeck = [...this.members.deckCards],
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
    this.setMembers({
      deckCards: cardsInDeck,
      playerDeck,
      botDeck,
      pileCards
    });
  }

  buildNewMainDeck() {
    const copiedDeck = [...this.members.pileCards];
    const lastPileCard = [];
    lastPileCard.push(copiedDeck.pop());
    let newDeck = this.members.deckCards;
    copiedDeck.forEach((element, index) => {
      newDeck.push(new Card(element.card, element.card));
    });
    newDeck = shuffleDeck(newDeck);

    this.setMembers({
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
    } = this.members;
    const copiedDeck = [...this.members[deckName]];
    const cardToPlay = copiedDeck.popIndex(index);
    const newPile = [...this.members.pileCards, cardToPlay];
    let takeCount = takinNumber;
    if (cardToPlay.number === '2plus' && !isTaki) {
      takeCount = takeCount === 1 ? 0 : takeCount;
      takeCount += 2;
      if (currentPlayer === BOT) {
        this.setMembers({
          msg: 'your opponent used 2plus, play with 2plus or take card'
        });
      }
    }
    if (cardToPlay.color === 'colorful') {
      this.setMembers({ msg: 'pick a color' });
      this.switchPlayer(-1);
    }
    if (
      currentPlayer === PLAYER &&
      !isTaki &&
      (cardToPlay.number === 'plus' || cardToPlay.number === 'stop')
    ) {
      this.setMembers({ msg: cardToPlay.number + '- you have another turn' });
      this.setStats(currentPlayer);
      this.statsComp.current.setTurnTime(totalSeconds - lstTime);
      this.setMembers({ lstTime: totalSeconds });
    } else if (
      !isTaki &&
      (cardToPlay.number === 'plus' || cardToPlay.number === 'stop')
    ) {
      this.setStats(currentPlayer);
    }
    this.setMembers({
      [deckName]: copiedDeck,
      pileCards: newPile,
      cardIsActive: true,
      takinNumber: takeCount
    });
    this.updateHistory();
  }

  gameOver() {
    const lastPileCard = this.members.pileCards[
      this.members.pileCards.length - 1
    ];
    const { playerDeck, botDeck } = this.members;
    let winner = -1;
    if (playerDeck.length === 0) {
      if (!this.members.cardIsActive) {
        winner = PLAYER;
      } else if (
        lastPileCard.number !== 'plus' &&
        lastPileCard.number !== '2plus'
      ) {
        winner = PLAYER;
      }
    }
    if (botDeck.length === 0) {
      if (!this.members.cardIsActive) {
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
    let copiedDeck = [...this.members.deckCards];
    for (let i = 0; i < this.members.takinNumber; i++) {
      cards.push(copiedDeck.pop());
      if (copiedDeck.length === 1) copiedDeck = this.buildNewMainDeck();
    }
    const newPile = [...this.members[deckName], ...cards];

    this.setMembers({
      deckCards: copiedDeck,
      [deckName]: newPile,
      cardIsActive: false,
      takinNumber: 1
    });
    this.updateHistory();
    this.switchPlayer(player);
  }

  closeTaki() {
    let lastcard = this.members.pileCards[this.members.pileCards.length - 1];
    this.setTaki(false);
    if (lastcard.number === 'plus' || lastcard.number === 'stop') {
      this.setMembers({ msg: lastcard.number + '- you have another turn' });
      this.setStats(PLAYER);
      this.statsComp.current.setTurnTime(
        this.members.totalSeconds - this.members.lstTime
      );
    }
    let takeCount = this.members.takinNumber;
    if (lastcard.number === '2plus') {
      takeCount = takeCount === 1 ? 0 : takeCount;
      takeCount += 2;
      this.setMembers({
        takinNumber: takeCount
      });
    }
    if (isSpecialCard(lastcard) && lastcard.number !== 'taki')
      this.switchPlayer(PLAYER);
    else {
      this.setMembers({ msg: '' });
      this.switchPlayer(BOT);
    }
  }

  setTaki(bool) {
    if (bool === true && this.members.currentPlayer === PLAYER) {
      this.setMembers({ msg: 'taki you can put all the cards off this color' });
    }
    this.setMembers({
      isTaki: bool
    });
  }

  selectColor(color) {
    let copiedDeck = [...this.members.pileCards];
    let card = copiedDeck.pop();
    card = new Card('_' + color, 'change_colorful');
    copiedDeck.push(card);
    this.setMembers({
      pileCards: copiedDeck,
      msg: ''
    });
    this.setStats(PLAYER);
    this.switchPlayer(BOT);
  }

  countTimer() {
    let newTime = this.members.totalSeconds + 1;
    this.setMembers({ totalSeconds: newTime });
  }
}

module.exports = { Game };
