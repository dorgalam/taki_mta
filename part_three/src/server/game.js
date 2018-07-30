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

let timerVar;

class Game {
  constructor(players) {
    this.players = players;
    this.members = this.getInitialState();
    this.dealCardsToPlayers();
    this.countTimer = this.countTimer.bind(this);
    timerVar = setInterval(this.countTimer, 500);
  }
  getInitialState() {
    const stats = this.players.reduce((agr, cur) => {
      agr[cur] = {
        turns: 0,
        lastCard: 0,
        turnsTime: []
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
      isChangeColor: false,
      playerHasMove: false,
      lstTime: 0,
      totalSeconds: 0,
      turnSwitched: 0,
      stats,
      winner: -1,
      takinNumber: 1,
      msg: '',
      playersFinished: []
    };
  }
  /*
    getNextPlayer() {
      const { currentPlayer } = this.members;
      const currentPlayerIndex = this.players.indexOf(currentPlayer);
      const nextIndex = this.players.indexOf(nextPlayer);
      while (playersFinished.indexOf(nextPlayer) !== -1) {
        nextPlayer = this.players[(nextIndex + 1) % this.players.length];
      }
      return nextPlayer;
    }
  */

  nextPlayer(anotherTurn, closeTaki = false) {
    let {
      currentPlayer,
      cardIsActive,
      pileCards,
      isTaki,
      consecutiveBotTurn,
      lstTime,
      totalSeconds,
      playersFinished
    } = this.members;

    const currentPlayerIndex = this.players.indexOf(currentPlayer);

    let nextPlayer = this.players[(currentPlayerIndex + 1) % this.players.length];

    if (anotherTurn) {
      nextPlayer = this.players[currentPlayerIndex];
    }
    if (closeTaki) {
      nextPlayer = this.closeTaki();
    }

    if (this.gameOver()) {//move to end display
      this.setMembers({ winner: true });
      return;
    }

    const nextIndex = this.players.indexOf(nextPlayer);
    while (playersFinished.indexOf(nextPlayer) !== -1) {
      nextPlayer = this.players[(nextIndex + 1) % this.players.length];
    }

    if (!anotherTurn) {
      this.setStats(currentPlayer);
      this.setMembers({ lstTime: totalSeconds });
    }

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
    const { stats, totalSeconds, lstTime } = this.members;
    let lastCard = stats[player].lastCard;
    if (this.members.playerDecks[player].length === 1) {
      lastCard++;
    }
    const turns = [...stats[player].turnsTime, totalSeconds - lstTime];
    this.setMembers({
      stats: {
        ...stats,
        [player]: {
          turns: stats[player].turns + 1,
          lastCard: lastCard,
          turnsTime: turns
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
      playerDecks,
      pileCards
    } = this.members;
    if (currentPlayer !== playerName) {
      return;
    }
    this.setMembers({ msg: '' });
    const copiedDeck = [...playerDecks[playerName]];
    const lastPileCard = pileCards[pileCards.length - 1];
    let anotherTurn = false;

    let cardToPlay = copiedDeck.popIndex(index);
    let takeCount = takinNumber;
    if (cardToPlay.number === '2plus' && !isTaki) {
      this.setMembers({ msg: 'must use 2plus' });
      takeCount = takeCount === 1 ? 0 : takeCount;
      takeCount += 2;
    }
    if (isTaki) {
      anotherTurn = true;
    }
    else {
      if (cardToPlay.number === 'taki') {
        this.setTaki(true);
        anotherTurn = true;
        if (cardToPlay.color === 'colorful') {
          cardToPlay = new Card('taki_' + lastPileCard.color, 'taki_colorful');
        }
      }
      if (cardToPlay.number === 'plus') {
        anotherTurn = true;
      }
      if (cardToPlay.color === 'colorful') {
        this.setMembers({ msg: currentPlayer + ' need to pick a color', isChangeColor: true });
        anotherTurn = true;
      }
    }
    if (!isTaki && (cardToPlay.number === 'plus')) {
      this.setMembers({ msg: cardToPlay.number + currentPlayer + '- have another turn' });
      this.setStats(currentPlayer);
      this.setMembers({ lstTime: totalSeconds });
    }
    const newPile = [...this.members.pileCards, cardToPlay];
    this.setMembers({
      playerDecks: {
        ...playerDecks,
        [playerName]: copiedDeck
      },
      pileCards: newPile,
      cardIsActive: true,
      takinNumber: takeCount
    });

    this.nextPlayer(anotherTurn);
    if (cardToPlay.number === 'stop' && !isTaki) {
      this.setMembers({ msg: cardToPlay.number + '- skip on ' + this.members.currentPlayer });
      this.nextPlayer(anotherTurn);
    }
  }

  gameOver() {
    const lastPileCard = this.members.pileCards[
      this.members.pileCards.length - 1
    ];
    const { cardIsActive, playersFinished, isTaki, isChangeColor } = this.members;
    this.players.forEach((playerName) => {
      if (playersFinished.indexOf(playerName) === -1) {
        if (this.members.playerDecks[playerName].length === 0) {
          if (!cardIsActive || lastPileCard.number !== 'plus' && lastPileCard.number !== '2plus'
            && !isTaki && !isChangeColor) {
            playersFinished.push(playerName);
          }
        }
      }
    });
    let end = playersFinished.length + 1 >= this.players.length;
    if (end) {///put the last player at the players finished list
      this.players.forEach((playerName) => {
        if (playersFinished.indexOf(playerName) === -1) {
          playersFinished.push(playerName);
        }
      });
    }
    return end;
    //if all the players finished then game is over
  }

  takeCardFromMainDeck(player) {
    if (this.members.currentPlayer !== player) {
      return;
    }
    this.setMembers({ msg: '' });
    let cards = [];
    let copiedDeck = [...this.members.deckCards];
    for (let i = 0; i < this.members.takinNumber; i++) {
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
    this.nextPlayer(false, false);
  }

  closeTaki() {
    let lastcard = this.members.pileCards[this.members.pileCards.length - 1];
    this.setTaki(false);
    const currentPlayerIndex = this.players.indexOf(this.members.currentPlayer);
    let nextPlayer = this.players[
      (currentPlayerIndex + 1) % this.players.length
    ];
    if (lastcard.number === 'plus') {
      nextPlayer = this.players[currentPlayerIndex];
      this.setMembers({ msg: lastcard.number + nextPlayer + ' - have another turn' });
      this.setStats(this.members.currentPlayer);
      this.setMembers({ lstTime: totalSeconds });
    }
    let takeCount = this.members.takinNumber;
    if (lastcard.number === '2plus') {
      takeCount = takeCount === 1 ? 0 : takeCount;
      takeCount += 2;
      this.setMembers({
        takinNumber: takeCount,
        msg: nextPlayer + ' must use 2plus'
      });
    }
    if (lastcard.number === 'stop') {
      this.setMembers({ msg: lastcard.number + ' - skip on ' + nextPlayer + ' turn' });
      nextPlayer = this.players[
        (currentPlayerIndex + 2) % this.players.length
      ];
    }
    return nextPlayer;
  }

  setTaki(setTo) {
    if (setTo) {
      this.setMembers({ msg: this.members.currentPlayer + ' used taki and can put all the cards of this color' });
    }
    this.setMembers({
      isTaki: setTo
    });
  }

  selectColor(color) {
    let copiedDeck = [...this.members.pileCards];
    let card = copiedDeck.pop();
    card = new Card('_' + color, 'change_colorful');
    copiedDeck.push(card);
    this.nextPlayer(false, false);
    this.setMembers({
      pileCards: copiedDeck,
      isChangeColor: false,
      msg: '',
    });

  }

  countTimer() {
    let newTime = this.members.totalSeconds + 0.5;
    this.setMembers({ totalSeconds: newTime });
  }
}

Array.prototype.popIndex = function (index) {
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
