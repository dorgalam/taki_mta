const express = require('express');
const { Game } = require('./game.js');
const auth = require('./auth');

const gamesApi = express.Router();

let activeGames = [];

gamesApi.get('/', (req, res) => {
  res.json(activeGames);
});

gamesApi.post('/cleanGame', (req, res) => {
  const requestedGameIndex = indexOfGames(activeGames, req.params.id);
  if (requestedGameIndex === -1) {
    res.send({ id: -1, requestedGameIndex, err: 'game not found' });
    return;
  }
  const requestedGame = activeGames[requestedGameIndex];
  requestedGame.status = 'waiting';
  requestedGame.players = [];
  res.json(activeGames);
});

gamesApi.post('/', auth.userAuthentication, (req, res) => {
  let error = '';
  if (2 <= req.body.numberOfPlayers && req.body.numberOfPlayers <= 4) {
    if (activeGames.length > 0 && activeGames.some(game => game.name === req.body.name)) {
      error = 'name already exists';
    } else if (!req.body.name) {
      error = 'you must give name to your game';
    }
    else {
      activeGames.push(
        Object.assign({}, req.body, {
          status: 'waiting',
          players: [],
          creator: req.body.user,
        })
      );
    }
  } else {
    error = 'number of players must be 2-4';
  }
  res.send({ id: activeGames.length - 1, error: error });
});
/*
gamesApi.post('/:id/join', (req, res) => {
  const requestedGame = activeGames[req.params.id];
  const index = requestedGame.players.indexOf(req.body.name);
  if (index === -1) {
    requestedGame.players.push(req.body.name);
    if (requestedGame.players.length === requestedGame.numberOfPlayers) {
      requestedGame.status = 'in_progress';
      const game = new Game(requestedGame.players);
      game.dealCardsToPlayers();
      requestedGame.data = game;
    }
  } else {
    requestedGame.players.splice(index, 1);
  }
  res.send({ id: req.params.id, index });
});
*/

function indexOfGames(games, name) {
  for (let i = 0; i < games.length; i++) {
    if (games[i].name === name) {
      return i;
    }
  }
  return -1;
}

gamesApi.post('/:id/join', (req, res) => {
  const requestedGameIndex = indexOfGames(activeGames, req.params.id);
  if (requestedGameIndex === -1) {
    res.send({ id: -1, requestedGameIndex, err: 'game not found' });
    return;
  }
  const requestedGame = activeGames[requestedGameIndex];
  const index = requestedGame.players.indexOf(req.body.name);
  if (index === -1) {
    requestedGame.players.push(req.body.name);
    if (requestedGame.players.length === requestedGame.numberOfPlayers) {
      requestedGame.status = 'in_progress';
      const game = new Game(requestedGame.players);
      game.dealCardsToPlayers();
      requestedGame.data = game;
    }
  } else {
    requestedGame.players.splice(index, 1);
    requestedGame.status = 'waiting';
  }
  res.send({ id: requestedGameIndex, index });
});

gamesApi.post('/:id/join', (req, res) => {
  const requestedGameIndex = indexOfGames(activeGames, req.params.id);
  if (requestedGameIndex === -1) {
    res.send({ id: -1, requestedGameIndex, err: 'game not found' });
    return;
  }
  const requestedGame = activeGames[requestedGameIndex];
  const index = requestedGame.players.indexOf(req.body.name);
  if (index === -1) {
    requestedGame.players.push(req.body.name);
    if (requestedGame.players.length === requestedGame.numberOfPlayers) {
      requestedGame.status = 'in_progress';
      const game = new Game(requestedGame.players);
      game.dealCardsToPlayers();
      requestedGame.data = game;
    }
  } else {
    requestedGame.players.splice(index, 1);
    requestedGame.status = 'waiting';
  }
  res.send({ id: requestedGameIndex, index });
});

gamesApi.put('/:id', auth.userAuthentication, (req, res) => {
  const requestedGame = activeGames[req.params.id];
  requestedGame.data[req.body.action](...req.body.args, res.locals.user);
  res.json({ ok: true });
});

gamesApi.post('/:id/delete', (req, res) => {
  const requestedGame = activeGames[req.params.id];
  let index = activeGames.indexOf(requestedGame);
  activeGames.splice(index, 1);

  res.send({ index });
});

gamesApi.get('/:id', (req, res) => {
  const requestedGameIndex = indexOfGames(activeGames, req.params.id);
  if (requestedGameIndex === -1) {
    res.send({ id: req.params.id, requestedGameIndex, err: 'game not found' });
    return;
  }
  const game = activeGames[requestedGameIndex];
  if (game.status === 'waiting') {
    res.json({ waiting: true });
  } else {
    res.json({ state: game.data.members });
  }
});

gamesApi.get('/logout', (req, res) => {
  const name = req.body.userName;
  activeGames.map(game => {
    let index = game.players.indexOf(name);
    if (index != -1) {
      game.players.splice(index, 1);
    }
  });
  res.send(name);
});

module.exports = gamesApi;
