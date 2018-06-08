const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();

app.use(express.static('public'));

app.use(bodyParser.json());
app.use(cookieParser());

let loggedInUsers = [];
let games = [];

setInterval(() => {
  loggedInUsers = [];
}, 5000);

app.post('/_api/name', (req, res) => {
  const name = req.body.name;
  loggedInUsers.push(name);
  res.cookie('name', name);
  res.json({});
});

app.get('/_api/name', (req, res) => {
  if (req.cookies.name) {
    res.json({ name: req.cookies.name });
  } else {
    res.status(404).send('unregisterd');
  }
});

app.delete('/_api/name', (req, res) => {
  const name = req.body.name;
  loggedInUsers = loggedInUsers.filter(loggedInUser => loggedInUser !== name);
  res.json({});
});

app.get('/_api/users', (req, res) => {
  const name = req.cookies.name;
  if (!loggedInUsers.includes(name)) {
    loggedInUsers.push(req.cookies.name);
  }
  res.json(loggedInUsers);
});

app.get('/_api/games', (req, res) => {
  res.json(games);
});

app.post('/_api/games', (req, res) => {
  games.push(req.body.game);
  res.send({ id: games.length - 1 });
});

app.listen(3000);
