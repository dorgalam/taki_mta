const base = 'http://localhost:3000/_api';

const request = (relative, method, body) =>
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

export const getName = () => request('/name', 'GET');

export const setName = name => request('/name', 'POST', { name });

export const getUsers = () => request('/users', 'GET');

export const getGames = () => request('/games', 'GET');

export const createGame = ({ numberOfPlayers, name }) =>
  request('/games', 'POST', { numberOfPlayers: Number(numberOfPlayers), name });

export const joinGame = id => request(`/games/${id}/join`, 'GET');
