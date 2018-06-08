const { Game } = require('../game.js');

module.exports = app => {
  let games = [];

  app.get('/_api/games', (req, res) => {
    res.json(games);
  });

  app.post('/_api/games', (req, res) => {
    games.push(
      Object.assign({}, req.body, {
        status: 'waiting',
        players: [req.cookies.name]
      })
    );
    res.send({ id: games.length - 1 });
  });

  app.get('/_api/games/:id/join', (req, res) => {
    const requestedGame = games[req.params.id];
    requestedGame.players.push(req.cookies.name);
    if (requestedGame.players.length === requestedGame.numberOfPlayers) {
      requestedGame.status = 'in_progress';
      requestedGame.data = new Game(requestedGame.players);
    }
    res.send({ id });
  });
  return app;
};
