import React from "react";
import "./styles/style.css";
import "./styles/cards.css";

import ReactDOM from "react-dom";
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

ReactDOM.render(<MainGameWindow />, document.getElementById("root"));