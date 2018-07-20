const { isSpecialCard } = require('./utils');

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
  constructor(players) {
    this.players = players;
    this.members = this.getInitialState();
  }
  getInitialState() {
    const stats = this.players.reduce((agr, cur) => {
      agr[cur] = {
        turns: 0,
        lastCard: 0
      };
      return agr;
    }, {});
    return {
      deckCards: createCardsArray().map(item => new Card(item)),
      playerDecks: {},
      pileCards: [],
      currentPlayer: this.players[0],
      cardIsActive: false,
      isTaki: false,
      playerHasMove: false,
      consecutiveBotTurn: 0,
      timerVar: 0,
      lstTime: 0,
      totalSeconds: 0,
      turnSwitched: 0,
      stats,
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
  nextPlayer(anotherTurn) {
    let {
      currentPlayer,
      cardIsActive,
      pileCards,
      isTaki,
      consecutiveBotTurn,
      lstTime,
      totalSeconds
    } = this.members;

    const currentPlayerIndex = this.players.indexOf(this.members.currentPlayer);

    let nextPlayer = this.players[
      (currentPlayerIndex + 1) % this.players.length
    ];

    if (anotherTurn) {
      nextPlayer = this.players[currentPlayerIndex];
    }

    // const lastPileCard = pileCards[pileCards.length - 1];
    // let from = currentPlayer === -1 ? PLAYER : currentPlayer;
    // if (from !== toPlayer && toPlayer !== -1) {
    //   this.setStats(currentPlayer);
    //   if (toPlayer === PLAYER) {
    //     this.setMembers({ lstTime: totalSeconds });
    //   } else {
    //     // this.statsComp.current.setTurnTime(totalSeconds - lstTime); // player turn ends calculate his turn time
    //     this.setMembers({ msg: '' });
    //   }
    // }

    this.setMembers({
      currentPlayer: nextPlayer,
      playerHasMove: false
    });
  }

  setMembers(newMembers) {
    this.members = Object.assign({}, this.members, newMembers);
  }

  quit(player) {
    const copiedDecks = { ...this.members.playerDecks };
    delete copiedDecks[player];
    this.setMembers({
      playerDecks: copiedDecks
    });
  }

  setStats(player) {
    const { stats } = this.members;
    this.setMembers({
      stats: {
        ...stats,
        [player]: {
          turns: stats[player].turns + 1,
          lastCard: stats[player].lastCard
        }
      }
    });
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

  // componentDidUpdate(prevProps, prevState) {
  //   const { playerDeck, botDeck } = this.members;
  //   const prevPlayerDeck = prevState.playerDeck;
  //   const prevBotDeck = prevState.botDeck;
  //   if (playerDeck.length === 1 && prevPlayerDeck.length !== 1) {
  //     const { stats } = this.members;
  //     stats.lastCard++;
  //     this.setMembers({
  //       stats
  //     });
  //   } else if (botDeck.length === 1 && prevBotDeck.length !== 1) {
  //     const { botStats } = this.members;
  //     botStats.lastCard++;
  //     this.setMembers({
  //       botStats
  //     });
  //   }
  //   if (this.members.winner === -1) {
  //     let winner = this.gameOver();
  //     if (winner >= 0 && !this.members.inRewind) {
  //       this.setMembers({
  //         winner: winner,
  //         currentPlayer: -2
  //       });
  //     }
  //   }
  // }

  updateHistory() {
    const { inRewind, winner } = this.members;
    if (!inRewind && this.statsComp) {
      const stateSnapshot = Object.assign({}, this.members, {
        // childStats: this.statsComp.current.getState()
      });
      delete stateSnapshot.history;
      this.setMembers({ history: [...this.members.history, stateSnapshot] });
    }
  }

  rewind() {
    this.rewindIndex = 0;
    this.setMembers({ inRewind: true });
  }

  dealCardsToPlayers() {
    const cardsInDeck = [...this.members.deckCards],
      playerDecks = {},
      pileCards = [];

    for (let i = 0; i < 8; ++i) {
      this.players.forEach((name, id) => {
        if (typeof playerDecks[name] !== 'object') {
          playerDecks[name] = [cardsInDeck.pop()];
        } else {
          playerDecks[name].push(cardsInDeck.pop());
        }
      });
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
      playerDecks,
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

  playCard(index, playerName) {
    const {
      stats,
      isTaki,
      currentPlayer,
      lstTime,
      totalSeconds,
      takinNumber,
      playerDecks
    } = this.members;

    const copiedDeck = [...playerDecks[playerName]];

    let anotherTurn = false;

    const cardToPlay = copiedDeck.popIndex(index);
    const newPile = [...this.members.pileCards, cardToPlay];
    let takeCount = takinNumber;
    if (cardToPlay.number === '2plus' && !isTaki) {
      takeCount = takeCount === 1 ? 0 : takeCount;
      takeCount += 2;
      // if (currentPlayer === BOT) {
      //   this.setMembers({
      //     msg: 'your opponent used 2plus, play with 2plus or take card'
      //   });
      // }
    }
    if (cardToPlay.color === 'colorful') {
      this.setMembers({ msg: 'pick a color' });
      anotherTurn = true;
    }
    if (
      !isTaki &&
      (cardToPlay.number === 'plus' || cardToPlay.number === 'stop')
    ) {
      this.setMembers({ msg: cardToPlay.number + '- you have another turn' });
      this.setStats(currentPlayer);
      // this.statsComp.current.setTurnTime(totalSeconds - lstTime);
      this.setMembers({ lstTime: totalSeconds });
    } else if (
      !isTaki &&
      (cardToPlay.number === 'plus' || cardToPlay.number === 'stop')
    ) {
      this.setStats(currentPlayer);
    }
    this.setMembers({
      playerDecks: {
        ...playerDecks,
        [playerName]: copiedDeck
      },
      pileCards: newPile,
      cardIsActive: true,
      takinNumber: takeCount
    });
    this.updateHistory();
    this.nextPlayer(anotherTurn);
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

  takeCardFromMainDeck(player, numberOfCardsToTake = 1) {
    let cards = [];
    let copiedDeck = [...this.members.deckCards];
    for (let i = 0; i < numberOfCardsToTake; i++) {
      cards.push(copiedDeck.pop());
      if (copiedDeck.length === 1) copiedDeck = this.buildNewMainDeck();
    }
    const newPlayerDeck = [...this.members.playerDecks[player], ...cards];

    this.setMembers({
      deckCards: copiedDeck,
      playerDecks: {
        ...this.members.playerDecks,
        [player]: newPlayerDeck
      },
      cardIsActive: false,
      takinNumber: 1
    });
    this.updateHistory();
    this.nextPlayer(player);
  }

  closeTaki() {
    let lastcard = this.members.pileCards[this.members.pileCards.length - 1];
    this.setTaki(false);
    if (lastcard.number === 'plus' || lastcard.number === 'stop') {
      this.setMembers({ msg: lastcard.number + '- you have another turn' });
      this.setStats(PLAYER);
      // this.statsComp.current.setTurnTime(
      //   this.members.totalSeconds - this.members.lstTime
      // );
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
      this.nextPlayer(PLAYER);
    else {
      this.setMembers({ msg: '' });
      this.nextPlayer(BOT);
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
    this.nextPlayer(false);
  }

  countTimer() {
    let newTime = this.members.totalSeconds + 1;
    this.setMembers({ totalSeconds: newTime });
  }
}

Array.prototype.popIndex = function(index) {
  if (index < 0 || index >= this.length) {
    throw new Error();
  }
  let item = this[index];
  let write = 0;
  for (let i = 0; i < this.length; i++) {
    if (index !== i) {
      this[write++] = this[i];
    }
  }
  this.length--;
  return item;
};

module.exports = { Game, Card };
