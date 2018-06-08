const base = 'http://localhost:3000/_api';

const request = (relative, method, body) => {
  return fetch(`${base}${relative}`, {
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
};

export const getName = () => {
  return request('/name', 'GET');
};

export const setName = name => {
  return request('/name', 'POST', { name });
};

export const getUsers = () => {
  return request('/users', 'GET');
};

export const getGames = () => {
  return request('/games', 'GET');
};

export const createGame = game => {
  return request('/games', 'POST', { game });
};
