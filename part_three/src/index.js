import React from 'react';
import './styles/style.css';
import './styles/cards.css';

import ReactDOM from 'react-dom';
import {
  setName,
  getUsers,
  getGames,
  createGame,
  joinGame
} from './scripts/api.js';
import MainGameWindow from './scripts/MainGameWindow.js';

Array.prototype.popIndex = function(index) {
  if (index < 0 || index >= this.length) {
    throw new Error();
  }
  let item = this[index];
  let write = 0;
  for (let i = 0; i < this.length; i++) {
    if (index !== i) {
      this[write++] = this[i];
    }
  }
  this.length--;
  return item;
};

class Root extends React.Component {
  constructor() {
    super();
    this.state = {
      inGameNum: -1
    };
  }

  render() {
    return this.state.inGameNum === -1 ? (
      <Lobby
        joinGame={num => {
          console.log(num);
          this.setState({ inGameNum: num });
        }}
      />
    ) : (
      <MainGameWindow gameId={this.state.inGameNum} />
    );
  }
}

const getNiceCookie = () =>
  document.cookie
    .split(';')
    .map(item => item.split('='))
    .reduce((agr, [key, val]) => {
      agr[key] = val;
      return agr;
    }, {});

class Lobby extends React.Component {
  constructor() {
    super();
    this.state = {
      users: [],
      games: []
    };
  }

  componentDidMount() {
    const { name } = getNiceCookie();
    if (name) {
      this.setState({ name });
    }
    this.pullUsers = setInterval(() => {
      getUsers().then(users => this.setState({ users }));
    }, 1000);
    this.pullGames = setInterval(() => {
      getGames().then(games => this.setState({ games }));
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.pullUsers);
    clearInterval(this.pullGames);
  }

  render() {
    return (
      <div>
        {this.state.name ? (
          <div>
            users: <pre>{JSON.stringify(this.state.users, 0, 1)}</pre>
            <Form
              fields={['name', 'numberOfPlayers']}
              onSubmit={newGame =>
                createGame(newGame).then(({ id }) => this.props.joinGame(id))
              }
            />
            games:{' '}
            {this.state.games.map((game, i) => (
              <pre>
                {JSON.stringify(game, 0, 1)}
                <button
                  onClick={() => {
                    console.log(i);
                    this.props.joinGame(i);
                    joinGame(i);
                  }}
                >
                  JOIN
                </button>
              </pre>
            ))}
          </div>
        ) : (
          <Form
            fields={['name']}
            onSubmit={({ name }) =>
              setName(name).then(() => this.setState({ name }))
            }
          />
        )}
      </div>
    );
  }
}

class Form extends React.Component {
  constructor() {
    super();
    this.state = {};
  }
  render() {
    return (
      <form
        onSubmit={e => {
          e.preventDefault();
          this.props.onSubmit(this.state);
        }}
      >
        <fieldset>
          <legend>formname</legend>
          {this.props.fields.map(field => (
            <p key={field}>
              <label htmlFor={field}>
                {field}:{' '}
                <input
                  name={field}
                  onChange={e => this.setState({ [field]: e.target.value })}
                />
              </label>
            </p>
          ))}
        </fieldset>
        <input type="submit" />
      </form>
    );
  }
}

ReactDOM.render(<Root />, document.getElementById('root'));
