import React from 'react';
import { CardComp, utils } from '../cross';

const { getPileStyles } = utils;

class Pile extends React.Component {
  constructor() {
    super();
    const styleArray = Array(110);
    for (let i = 0; i < 110; i++) {
      styleArray[i] = getPileStyles();
    }
    this.state = { styleArray };
  }
  render() {
    const { cards } = this.props;
    return (
      <div id="pile">
        {cards.map((card, index, arr) => (
          <CardComp
            styles={this.state.styleArray[index]}
            key={index}
            name={card.name}
            classes={index >= arr.length - 5 ? `card_${card.name}` : ''}
          />
        ))}
      </div>
    );
  }
}

export default Pile;
