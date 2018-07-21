import React from 'react';
import ReactDOM from 'react-dom';
import LoginModal from './login-modal.jsx';
import ChatContaier from './chatContainer.jsx';
import { getGames, createGame, joinGame, getUsers, deleteGame } from '../api';
import Form from './Form.jsx';
import GamesTable from './GamesTable.jsx';
import UsersList from './UsersList.jsx';
import MainGameWindow from '../game/MainGameWindow';

export default class BaseContainer extends React.Component {
  constructor(args) {
    super(...args);
    this.state = {
      showLogin: true,
      currentUser: {
        name: ''
      },
      games: [],
      users: {}
    };

    this.handleSuccessedLogin = this.handleSuccessedLogin.bind(this);
    this.handleLoginError = this.handleLoginError.bind(this);

    this.fetchUserInfo = this.fetchUserInfo.bind(this);
    this.logoutHandler = this.logoutHandler.bind(this);
    this.pullGames = this.pullGames.bind(this);
    this.pullUsers = this.pullUsers.bind(this);
    this.handleJoinSubmit = this.handleJoinSubmit.bind(this);

    this.getUserName();
    this.pullGames();
    this.pullUsers();
  }

  render() {
    // return <MainGameWindow gameId={0} playerName="player1" />;

    if (this.state.showLogin) {
      return (
        <LoginModal
          loginSuccessHandler={this.handleSuccessedLogin}
          loginErrorHandler={this.handleLoginError}
        />
      );
    }
    return this.renderChatRoom();
  }

  handleSuccessedLogin() {
    this.setState(() => ({ showLogin: false }), this.getUserName);
  }

  handleLoginError() {
    console.error('login failed');
    this.setState(() => ({ showLogin: true }));
  }

  pullGames() {
    getGames().then(games => {
      this.setState({ games }, () => {
        setTimeout(this.pullGames, 200);
      });
    });
  }

  pullUsers() {
    getUsers().then(users => {
      this.setState({ users }, () => {
        setTimeout(this.pullUsers, 200);
      });
    });
  }

  handleJoinSubmit(id, name) {
    joinGame(id, name).then(res => {
      this.setState({ gameJoined: id });
    });
  }

  renderChatRoom() {
    const { games, gameJoined } = this.state;
    return (
      <div>
        {typeof gameJoined !== 'undefined' &&
        games[gameJoined].players.length ===
          games[gameJoined].numberOfPlayers ? (
          <MainGameWindow
            gameId={gameJoined}
            playerName={this.state.currentUser.name}
          />
        ) : (
          <div>
            <div className="chat-base-container">
              <div className="user-info-area">
                Hello {this.state.currentUser.name}
                <button className="logout btn" onClick={this.logoutHandler}>
                  Logout
                </button>
              </div>
              <ChatContaier />
            </div>
            <div>
              <Form
                fields={['name', 'numberOfPlayers']}
                gameSuccessHandler={this.handleSuccessedNewGame}
                gameErrorHandler={this.handleLoginError}
                onSubmit={newGame =>
                  createGame(newGame, this.state.currentUser.name).then(res => {
                    if (res.error !== '') alert(res.error);
                  })
                }
              />
              <GamesTable
                games={this.state.games}
                user={this.state.currentUser.name}
                onSubmit={this.handleJoinSubmit}
                deleteGame={deleteGame}
              />
              <UsersList users={this.state.users['users']} />
            </div>
          </div>
        )}
      </div>
    );
  }

  getUserName() {
    this.fetchUserInfo()
      .then(userInfo => {
        this.setState(() => ({ currentUser: userInfo, showLogin: false }));
      })
      .catch(err => {
        if (err.status === 401) {
          // incase we're getting 'unautorithed' as response
          this.setState(() => ({ showLogin: true }));
        } else {
          throw err; // in case we're getting an error
        }
      });
  }

  fetchUserInfo() {
    return fetch('/users', { method: 'GET', credentials: 'include' }).then(
      response => {
        if (!response.ok) {
          throw response;
        }
        return response.json();
      }
    );
  }

  logoutHandler() {
    fetch('/users/logout', { method: 'GET', credentials: 'include' }).then(
      response => {
        if (!response.ok) {
          console.log(
            `failed to logout user ${this.state.currentUser.name} `,
            response
          );
        } else {
          for (let i = 0; i < this.state.games.length; i++) {
            // when logout =>quit games i'm in
            if (
              this.state.games[i].players.indexOf(
                this.state.currentUser.name
              ) !== -1
            ) {
              joinGame(i, this.state.currentUser.name);
            }
          }
        }
        this.setState(() => ({ currentUser: { name: '' }, showLogin: true }));
      }
    );
  }
}
