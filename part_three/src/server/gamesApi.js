const express = require('express');
const { Game } = require('./game.js');
const auth = require('./auth');

const gamesApi = express.Router();

let activeGames = [];

gamesApi.get('/', (req, res) => {
  res.json(activeGames);
});

gamesApi.post('/', auth.userAuthentication, (req, res) => {
  activeGames.push(
    Object.assign({}, req.body, {
      status: 'waiting',
      players: [res.locals.user]
    })
  );
  res.send({ id: activeGames.length - 1 });
});

gamesApi.get('/:id/join', (req, res) => {
  const requestedGame = activeGames[req.params.id];
  requestedGame.players.push(req.cookies.name);
  if (requestedGame.players.length === requestedGame.numberOfPlayers) {
    requestedGame.status = 'in_progress';
    requestedGame.data = new Game(requestedGame.players);
  }
  res.send({ id: req.params.id });
});

gamesApi.get('/:id', (req, res) => {
  const game = activeGames[req.params.id];
  if (game.status === 'waiting') {
    res.json({ waiting: true });
  } else {
    res.json({ state: game.data.members });
  }
});

module.exports = gamesApi;
