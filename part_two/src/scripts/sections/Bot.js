import React from 'react';

import { PlayerDeck } from './player/index.js';
import { enums, utils, Card } from './cross';
const { isSpecialCard } = utils;

const { PLAYER, BOT } = enums;

class Bot extends React.Component {
  getCardIndex(card) {
    let res = -1;
    if (card === false) return -1;
    this.props.cards.forEach((element, index) => {
      if (element.color === card.color && element.number === card.number) {
        res = index;
      }
    });
    return res;
  }

  chooseCard(active, isTaki) {
    //the bot well aware of the cards he has (this.cards)
    const { lastPileCard } = this.props;
    let number = lastPileCard.number;
    let color = lastPileCard.color;
    if (isTaki) {
      return this.selectColorCard(color);
    }
    if (active && number === '2plus') return this.has2plus(); // options: card name, false (take a card from the pile)
    if (active && isSpecialCard(lastPileCard)) {
      return this.handleSpecial(color, number);
    }
    let colorCount = this.getColorCount(color); // count number of cards with this color
    let numberCount = this.getNumberCount(number); // count number of cards with this number
    let plus = this.getSpecialTypeColor(color, 'plus');
    let stop = this.getSpecialTypeColor(color, 'stop');
    let taki = this.getSpecialTypeColor(color, 'taki'); //check for taki in this color
    if (taki && colorCount > 1) return taki;
    if (plus && (colorCount > 1 || this.getTypeOtherColor('plus'))) return plus;
    if (stop && (colorCount > 1 || this.getTypeOtherColor('stop'))) return stop;
    if (colorCount > 0) return this.selectColorCard(color); //select the best card with my color (has two of the same number)
    if (numberCount > 0) return this.selectNumberCard(number); //select the best card with my number (has two of the same color)
    return this.hasChangeColor(); // true = best color for me , false = take a card from the pile
  }

  getColorCount(color) {
    let count = 0;
    this.props.cards.forEach(element => {
      if (element.color === color) {
        count++;
      }
    });
    return count;
  }

  getNumberCount(number) {
    let count = 0;
    this.props.cards.forEach(element => {
      if (element.number === number) {
        count++;
      }
    });
    return count;
  }

  getSpecialTypeColor(color, specialType) {
    let special = false;
    this.props.cards.forEach(function(element) {
      if (element.color === color && element.number === specialType) {
        special = element;
      }
    });
    return special;
  }

  has2plus() {
    let elem = false;
    this.props.cards.forEach(function(element) {
      if (element.number === '2plus') {
        elem = element;
      }
    });
    return elem;
  }

  hasChangeColor() {
    const deck = this.props.cards;
    for (let i = 0; i < deck.length; i++) {
      if (deck[i].color === 'colorful') return deck[i];
    }
    return false;
  }

  selectColorCard(color) {
    let numbersArr = {
      '1': 0,
      '3': 0,
      '4': 0,
      '5': 0,
      '6': 0,
      '7': 0,
      '8': 0,
      '9': 0,
      plus: 0,
      stop: 0,
      taki: 0,
      '2plus': 0
    };
    const deck = this.props.cards;
    for (let i = 0; i < deck.length; i++) {
      if (deck[i].color === color) numbersArr[deck[i].number]++;
    }
    let max = Object.keys(numbersArr).reduce(function(a, b) {
      return numbersArr[a] > numbersArr[b] ? a : b;
    });
    if (numbersArr[max] === 0) return false;
    for (let i = 0; i < deck.length; i++) {
      if (deck[i].color === color && deck[i].number === max) return deck[i];
    }
  }

  selectNumberCard(number) {
    let colorsArr = {
      red: 0,
      blue: 0,
      green: 0,
      yellow: 0
    };
    const deck = this.props.cards;
    for (let i = 0; i < deck.length; i++) {
      if (deck[i].number === number) colorsArr[deck[i].color]++;
    }
    let max = Object.keys(colorsArr).reduce(function(a, b) {
      return colorsArr[a] > colorsArr[b] ? a : b;
    });
    if (colorsArr[max] === 0) return false;
    for (let i = 0; i < deck.length; i++) {
      if (deck[i].number === number && deck[i].color === max) return deck[i];
    }
  }

  handleSpecial(color, type) {
    let colorCount = this.getColorCount(color); // count number of cards with this color
    if (type === 'taki') {
      // handle taki
      if (colorCount >= 1) {
        return this.selectColorCard(color);
      }
      return false;
    }
    let res = this.hasSameCard(color, type);
    if (res) return res;
    let otherType = this.getTypeOtherColor(type);
    if (otherType && this.getColorCount(otherType.color) > 1) return otherType;
    if (colorCount > 0) {
      return this.selectColorCard(color);
    }
    return otherType; //can be false
  }

  getTypeOtherColor(type) {
    const deck = this.props.cards;
    for (let i = 0; i < deck.length; i++) {
      if (deck[i].number === type) return deck[i];
    }
    return false;
  }

  hasSameCard(color, type) {
    const deck = this.props.cards;
    for (let i = 0; i < deck.length; i++) {
      if (deck[i].number === type && deck[i].color === color) return deck[i];
    }
    return false;
  }

  botPickColor() {
    let colorsArr = {
      red: 0,
      blue: 0,
      yellow: 0,
      green: 0,
      colorful: -20
    };
    this.props.cards.forEach(element => {
      colorsArr[element.color]++;
    });
    return Object.keys(colorsArr).reduce(function(a, b) {
      return colorsArr[a] > colorsArr[b] ? a : b;
    });
  }

  handleColorful(card) {
    let res;
    if (card.number === 'taki') {
      res = new Card(
        card.number + '_' + this.props.lastPileCard.color,
        card.card
      );
    } else {
      res = new Card('_' + this.botPickColor(), card.card);
    }
    return res;
  }

  handleHaveNoCard(card) {
    if (!this.props.isTaki) {
      this.props.takeCard('botDeck', PLAYER);
      return;
    } else {
      //finish my taki turn
      this.props.setTaki(false);
      if (
        isSpecialCard(this.props.lastPileCard) &&
        this.props.lastPileCard.number !== 'taki'
      ) {
        this.props.switchPlayer(BOT); // check if last card was "stop" or "plus" need to get another turn
        return;
      }
    }
    this.props.switchPlayer(PLAYER);
    return;
  }

  componentDidUpdate() {
    if (this.props.myTurn) {
      let card = this.chooseCard(this.props.isActive, this.props.isTaki);
      let index = this.getCardIndex(card);
      if (index === -1) {
        this.handleHaveNoCard(card, index);
        return;
      } else {
        if (card.color === 'colorful') {
          //handle colorful
          card = this.props.cards[index] = this.handleColorful(card);
        }
        this.props.playCard(index, 'botDeck');
        if (isSpecialCard(card)) {
          // do again bot turn(plus,stop,taki)
          if (card.number === 'taki') {
            this.props.setTaki(true); // taki flag on
          }
          this.props.switchPlayer(BOT);
          return;
        } else if (this.props.isTaki) {
          // regular card but on taki - need to do bot turns until no card in this color
          this.props.switchPlayer(BOT);
          return;
        }
        this.props.switchPlayer(PLAYER);
      }
    }
  }

  render() {
    return (
      <div id="bot">
        <PlayerDeck
          cards={this.props.cards}
          lastCard={this.props.lastPileCard}
          active={this.props.isActive}
          taki={this.props.isTaki}
          isFacedUp={false}
          isPlayableCard={null}
        />
      </div>
    );
  }
}

export default Bot;
