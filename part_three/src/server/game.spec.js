const { Game, Card } = require('./game');

describe('Game', () => {
  let game;
  let players;

  beforeEach(() => {
    players = ['player1', 'player2', 'player3', 'player4'];
    game = new Game(players);
  });

  it('create a deck for 4 players when 4 players have joined', () => {
    expect(Object.keys(game.members.playerDecks)).toHaveLength(4);
    players.forEach(playerName => {
      expect(game.members.playerDecks[playerName]).toHaveLength(8);
    });

    expect(game.members.pileCards).toHaveLength(1);
  });

  it('should play a card', () => {
    game.members.playerDecks['player1'][7] = new Card('3_red');
    game.playCard(7, 'player1');
    expect(game.members.pileCards).toHaveLength(2);
    expect(game.members.playerDecks['player1']).toHaveLength(7);
    expect(game.members.currentPlayer).toBe('player2');
  });

  it('should not change player when a colorful card was played', () => {
    game.members.playerDecks['player1'][7] = new Card('change_colorful');
    game.playCard(7, 'player1');
    expect(game.members.pileCards).toHaveLength(2);
    expect(game.members.playerDecks['player1']).toHaveLength(7);
    expect(game.members.currentPlayer).toBe('player1');
  });

  it('should not change player when a taki card was played', () => {
    game.members.playerDecks['player1'][7] = new Card('taki_red');
    game.playCard(7, 'player1');
    expect(game.members.pileCards).toHaveLength(2);
    expect(game.members.playerDecks['player1']).toHaveLength(7);
    expect(game.members.currentPlayer).toBe('player1');
  });

  it('should set correct stats for given player', () => {
    game.setStats('player3');
    game.setStats('player3');
    game.setStats('player3');

    expect(game.members.stats['player3']).toEqual({
      turns: 3,
      lastCard: 0,
      turnsTime: [0, 0, 0]
    });
  });

  it('should leave current player the same', () => {
    const current = game.members.currentPlayer;
    game.nextPlayer(true);
    expect(game.members.currentPlayer).toBe(current);
  });

  it('should allow taking a card from the main deck', () => {
    game.takeCardFromMainDeck('player1');
    expect(game.members.playerDecks['player1']).toHaveLength(9);
    expect(game.members.deckCards).toHaveLength(101 - (4 * 8 + 1));
  });

  it('should allow quitting the game', () => {
    game.quit('player1');
    expect(game.players).toHaveLength(4);
    expect(Object.keys(game.members.playerDecks)).toHaveLength(3);
  });

  it('should put taki_red', () => {
    let lastPileCard = new Card('2_red');
    let cardToPlay = new Card('taki_' + lastPileCard.color, 'taki_colorful');
    expect(cardToPlay.color).toBe('red');
    expect(cardToPlay.number).toBe('taki');
  });

  it('should add time of the turn', () => {
    game.setStats('player3');
    game.setStats('player3');
    game.setStats('player3');

    expect(game.members.stats['player3']).toEqual({
      turns: 3,
      lastCard: 0,
      turnsTime: [0, 0, 0]
    });
  });

  it('should allow sending a new message to chat', () => {
    game.sendMessage('first message sent', 'player1');

    expect(game.members.chat).toContainEqual({
      sender: 'player1',
      message: 'first message sent'
    });

    game.sendMessage('second message sent', 'player2');

    expect(game.members.chat).toEqual([
      {
        sender: 'player1',
        message: 'first message sent'
      },
      {
        sender: 'player2',
        message: 'second message sent'
      }
    ]);
  });
  it(' next player check', () => {
    game.nextPlayer(false, false);
    game.members.playersFinished.push('player3');
    game.members.playersFinished.push('player1');
    game.nextPlayer(false, false);
    expect(game.members.currentPlayer).toEqual('player4');
    game.nextPlayer(false, false);
    expect(game.members.currentPlayer).toEqual('player2');
    game.nextPlayer(false, false);
    expect(game.members.currentPlayer).toEqual('player4');
  });
});