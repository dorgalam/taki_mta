const express = require('express');
const { Game } = require('./game.js');
const auth = require('./auth');

const gamesApi = express.Router();

let activeGames = [];


gamesApi.get('/', (req, res) => {
  res.json(activeGames);
});

gamesApi.post('/', auth.userAuthentication, (req, res) => {
  let error = "";
  if ((2 <= req.body.numberOfPlayers && req.body.numberOfPlayers <= 4)) {
    if (activeGames.length > 0 && activeGames.some(game => game.name === req.body.name)) {
      error = "name already exists";
    }
    else {
      activeGames.push(
        Object.assign({}, req.body, {
          status: 'waiting',
          players: [],
          id: activeGames.length
        })
      );
    }
  }
  else {
    error = "number of players must be 2-4";
  }
  res.send({ id: activeGames.length - 1, error: error });
});
/*
gamesApi.get('/:id/join', (req, res) => {
  const requestedGame = activeGames[req.params.id];
  requestedGame.players.push(req.cookies.user);
  if (requestedGame.players.length === requestedGame.numberOfPlayers) {
    requestedGame.status = 'in_progress';
    requestedGame.data = new Game(requestedGame.players);
  }
  res.send({ id: req.params.id });
});
*/
gamesApi.post('/:id/join', (req, res) => {
  const requestedGame = activeGames[req.params.id];
  requestedGame.players.push(req.params.name);
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
