const base = 'http://localhost:3000';

const request = (relative, method = 'GET', body = undefined) =>
  fetch(`${base}${relative}`, {
    method,
    body: JSON.stringify(body),
    credentials: 'include',
    headers: {
      'content-type': 'application/json'
    }
  }).then(resp => {
    if (resp.ok) {
      return resp.json();
    } else {
      return false;
    }
  });

export const getName = () => request('/name');

export const setName = name => request('/name', 'POST', { name });

export const getUsers = () => request('/users/allUsers', 'get');

export const getGames = () => request('/games');

export const deleteGame = id => request(`/games/${id}/delete`, 'post');

export const createGame = (game, user) =>
  request('/games', 'POST', {
    numberOfPlayers: Number(game.numberOfPlayers),
    name: game.name,
    user
  });

export const joinGame = (id, name) =>
  request(`/games/${id}/join`, 'post', { name });

export const addGameToUser = (gameName, name) =>
  request(`/users/addGame`, 'post', { gameName, name });

export const deleteGameFromUser = (gameName, name) =>
  request(`/users/deleteGame`, 'post', { gameName, name });

export const getUserGame = () =>
  request(`/users/getGame`, 'post');

export const isEmptyGame = (gameName) =>
  request(`/users/isEmptyGame`, 'post', { gameName });


export const cleanGame = (id) =>
  request(`/games/cleanGame`, 'post', { id });//while in play

export const quitGame = (id, name) =>
  request(`/games/${id}/join`, 'post', { name });//while in play

export const getGame = id => request(`/games/${id}`);

export const playGameWithId = (id, body) =>
  request(`/games/${id}`, 'put', body);
