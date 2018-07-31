import React from 'react';
import ReactDOM from 'react-dom';
import LoginModal from './login-modal.jsx';
import ChatContaier from './chatContainer.jsx';
import {
  getGames, createGame, joinGame, getUsers, deleteGame, getUserGame, addGameToUser, deleteGameFromUser
  , isEmptyGame, cleanGame, getUserID
} from '../api';
import Form from './Form.jsx';
import GamesTable from './GamesTable.jsx';
import UsersList from './UsersList.jsx';
import MainGameWindow from '../game/MainGameWindow';
import WaitingRoom from '../game/WaitingRoom.jsx';

export default class BaseContainer extends React.Component {
  constructor(args) {
    super(...args);
    this.state = {
      showLogin: true,
      currentUser: {
        name: ''
      },
      games: [],
      users: {},
      userID: ''
    };

    this.handleSuccessedLogin = this.handleSuccessedLogin.bind(this);
    this.handleLoginError = this.handleLoginError.bind(this);

    this.fetchUserInfo = this.fetchUserInfo.bind(this);
    this.logoutHandler = this.logoutHandler.bind(this);
    this.pullGames = this.pullGames.bind(this);
    this.pullUsers = this.pullUsers.bind(this);
    this.pullUserGame = this.pullUserGame.bind(this);
    this.handleJoinSubmit = this.handleJoinSubmit.bind(this);
    this.handleQuitSubmit = this.handleQuitSubmit.bind(this);
    this.handleQuitInGame = this.handleQuitInGame.bind(this);
    this.getUserId = this.getUserId.bind(this);


    this.getUserName();
    this.pullGames();
    this.pullUsers();
    this.pullUserGame();
    this.getUserId();
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
        setTimeout(this.pullGames, 300);
      });
    });
  }

  pullUserGame() {
    getUserGame().then(res => {
      let game = res ? res.gameinfo.game : undefined;
      this.setState({ userGame: decodeURI(game) }, () => {
        setTimeout(this.pullUserGame, 300);
      });
    });
  }

  pullUsers() {
    getUsers().then(users => {
      this.setState({ users }, () => {
        setTimeout(this.pullUsers, 300);
      });
    });
  }

  handleJoinSubmit(id, name) {
    joinGame(id, name).then(res => {
      this.setState({ gameJoined: res.id });
      addGameToUser(id, name).then(res => this.setState({ userGame: decodeURI(res.gameinfo.game) }));
    });
  }

  handleQuitSubmit(id, name) {
    joinGame(id, name).then(res => {
      this.setState({ gameJoined: undefined });
      deleteGameFromUser(id, name).then(res => this.setState({ userGame: undefined }));
    });
  }

  handleQuitInGame(id, name) {
    deleteGameFromUser(id, name).then(res => {
      this.setState({ userGame: undefined });
      isEmptyGame(id).then(res => {
        console.log(res.empty);
        if (res.empty) {
          cleanGame(id).then(res => console.log(res));
        }
      }); //check if no user on this game and if not then empty game from players
    });
  }

  inGame(games, name) {
    for (let i = 0; i < games.length; i++) {
      if (games[i].name === name) {
        return i;
      }
    }
    return -1;
    /*old inGame by games not by user
    for (let i = 0; i < games.length; i++) {
      if (games[i].players.indexOf(this.state.currentUser.name) !== -1) {
        return i;
      }
    }
    return -1;*/
  }

  getUserId() {
    getUserID().then(res => this.setState({ userID: res.id }));
  }

  renderChatRoom() {
    const { games, userGame } = this.state;
    const gameJoined = this.inGame(games, userGame);
    return (
      <div>
        {gameJoined !== -1 &&
          games[gameJoined].players.length === games[gameJoined].numberOfPlayers ? (
            <MainGameWindow
              quitGame={this.handleQuitInGame}
              gameId={gameJoined}
              gameName={games[gameJoined].name}
              playerName={this.state.currentUser.name}
            />
          ) : gameJoined !== -1 ? (<WaitingRoom user={this.state.currentUser.name} playerName={this.state.currentUser.name}
            game={games[gameJoined]} gameId={gameJoined} onSubmit={this.handleQuitSubmit} />) : (
              <div>
                <div className="chat-base-container">
                  <div className="user-info-area">
                    Hello {this.state.currentUser.name}
                    <button className="logout btn" onClick={this.logoutHandler}>
                      Logout
                </button>
                  </div>
                </div>
                <div>
                  <Form
                    fields={['name', 'numberOfPlayers']}
                    gameSuccessHandler={this.handleSuccessedNewGame}
                    gameErrorHandler={this.handleLoginError}
                    onSubmit={newGame =>
                      createGame(newGame, this.state.currentUser.name).then(res => {
                        if (res.error !== '') alert(res.error);
                        console.log(encodeURI(newGame.name));
                      })
                    }
                  />
                  <GamesTable
                    games={this.state.games}
                    userID={this.state.userID}
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
