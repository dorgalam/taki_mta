const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');

const { lobbyRoutes, gameRoutes } = require('./src/scripts/server/routes');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(cookieParser());

gameRoutes(app);
lobbyRoutes(app);

app.get('/_api/users', (req, res) => res.send('hi'));

app.listen(3000);
