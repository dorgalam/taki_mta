import React from 'react';
import './styles/style.css';
import './styles/cards.css';

import ReactDOM from 'react-dom';
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
      start: true
    };
    this.restart = this.restart.bind(this);
  }
  restart() {
    this.setState({ start: false }, () => this.setState({ start: true }));
  }
  render() {
    return this.state.start ? <MainGameWindow restart={this.restart} /> : null;
  }
}

ReactDOM.render(<Root />, document.getElementById('root'));
