const express = require('express');
const router = express.Router();
const auth = require('./auth');
const chatManagement = require('./chat');

const userManagement = express.Router();

userManagement.get('/', auth.userAuthentication, (req, res) => {
	const userName = auth.getUserInfo(req.session.id).name;
	res.json({ name: userName });
});


userManagement.get('/allUsers', auth.userAuthentication, (req, res) => {
	const users = auth.allUsers();
	res.json(users);
});

userManagement.post('/addUser', auth.addUserToAuthList, (req, res) => {
	res.sendStatus(200);
});

userManagement.post('/addGame', (req, res) => {
	const gameinfo = auth.addGame(req.body.gameName, req.session.id);
	res.json({ gameinfo });
});

userManagement.post('/deleteGame', (req, res) => {
	const gameinfo = auth.deleteGame(req.session.id);
	res.json({ gameinfo });
});

userManagement.post('/getGame', (req, res) => {
	const gameinfo = auth.getGame(req.session.id);
	res.json({ gameinfo });
});

userManagement.post('/isEmptyGame', (req, res) => {
	const empty = auth.isEmptyGame(req.body.gameName);
	res.json({ empty });
});

userManagement.get('/logout', [
	(req, res, next) => {
		const userinfo = auth.getUserInfo(req.session.id);
		chatManagement.appendUserLogoutMessage(userinfo);
		next();
	},
	auth.removeUserFromAuthList,
	(req, res) => {
		res.sendStatus(200);
	}]
);


module.exports = userManagement;