import React from 'react';
import ReactDOM from 'react-dom';
import LoginModal from './login-modal.jsx';
import ChatContaier from './chatContainer.jsx';
import { getGames, createGame } from '../api';
import Form from './Form.jsx';

export default class BaseContainer extends React.Component {
  constructor(args) {
    super(...args);
    this.state = {
      showLogin: true,
      currentUser: {
        name: ''
      },
      games: []
    };

    this.handleSuccessedLogin = this.handleSuccessedLogin.bind(this);
    this.handleLoginError = this.handleLoginError.bind(this);
    this.fetchUserInfo = this.fetchUserInfo.bind(this);
    this.logoutHandler = this.logoutHandler.bind(this);
    this.pullGames = this.pullGames.bind(this);

    this.getUserName();
    this.pullGames();
  }

  render() {
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

  renderChatRoom() {
    return (
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
            onSubmit={newGame => createGame(newGame).then(console.log)}
          />
          <pre>{JSON.stringify(this.state.games, 0, 1)}</pre>
        </div>
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
        }
        this.setState(() => ({ currentUser: { name: '' }, showLogin: true }));
      }
    );
  }
}
