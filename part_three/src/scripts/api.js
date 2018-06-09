const base = 'http://localhost:3000/_api';

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

export const getUsers = () => request('/users');

export const getGames = () => request('/games');

export const createGame = ({ numberOfPlayers, name }) =>
  request('/games', 'POST', { numberOfPlayers: Number(numberOfPlayers), name });

export const joinGame = id => request(`/games/${id}/join`);

export const getGame = id => request(`/games/${id}`);
