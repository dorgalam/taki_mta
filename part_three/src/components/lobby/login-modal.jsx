import React from 'react';
import ReactDOM from 'react-dom';

export default class LoginModal extends React.Component {
  constructor(args) {
    super(...args);
    this.state = {
      errMessage: ''
    };

    this.handleLogin = this.handleLogin.bind(this);
  }

  render() {
    return (
      <div>
        <div className="welcome">
          <h1>welcome to lior and dor's taki game</h1>
          <h2>Please enter a unique user name:</h2>
          <img className="welcome_taki" width="420" height="180" />
        </div>
        <div className="login-page-wrapper">
          <form onSubmit={this.handleLogin}>
            <label className="username-label" htmlFor="userName">
              {' '}
              username:{' '}
            </label>
            <input className="username-input" name="userName" />
            <input className="submit-btn btn" type="submit" value="Login" />
          </form>
          {this.renderErrorMessage()}
        </div>
      </div>
    );
  }

  renderErrorMessage() {
    if (this.state.errMessage) {
      return <div className="login-error-message">{this.state.errMessage}</div>;
    }
    return null;
  }

  handleLogin(e) {
    e.preventDefault();
    const userName = e.target.elements.userName.value;
    fetch('/users/addUser', {
      method: 'POST',
      body: userName,
      credentials: 'include'
    }).then(response => {
      if (response.ok) {
        this.setState(() => ({ errMessage: '' }));
        this.props.loginSuccessHandler();
      } else {
        if (response.status === 403) {
          this.setState(() => ({
            errMessage: 'User name already exist, please try another one'
          }));
        }
        else if (response.status === 402) {
          this.setState(() => ({
            errMessage: 'User name empty is illegal, please try another one'
          }));
        }
        this.props.loginErrorHandler();
      }
    });
    return false;
  }
}
