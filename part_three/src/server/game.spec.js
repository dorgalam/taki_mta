const { Game } = require('./game');

describe('Game', () => {
  let game;
  let players;

  beforeEach(() => {
    players = ['player1', 'player2', 'player3', 'player4'];
    game = new Game(players);
    game.dealCardsToPlayers();
  });

  it('create a deck for 4 players when 4 players have joined', () => {
    expect(game.members.playerDecks).toHaveLength(4);
    game.members.playerDecks.forEach(playerArr => {
      expect(playerArr).toHaveLength(8);
    });

    expect(game.members.pileCards).toHaveLength(1);
  });

  it('should play a card', () => {
    game.playCard(2, 'player2');
    expect(game.members.pileCards).toHaveLength(2);
    expect(game.members.playerDecks[1]).toHaveLength(7);
  });

  it('should not change player when a colorful card was played', () => {
    game.members.playerDecks[0];
    game.playCard(7, 'player1');
  });

  it('should set correct stats for given player', () => {
    game.setStats('player3');
    game.setStats('player3');
    game.setStats('player3');

    expect(game.members.stats['player3']).toEqual({
      turns: 3,
      lastCard: 0
    });
  });
});
