import React from 'react';
import { CardComp, utils } from '../cross';

const { getPileStyles } = utils;

const Pile = ({ cards }) => (
  <div id="pile">
    {cards.map((card, index, arr) => (
      <CardComp
        styles={getPileStyles()}
        key={index}
        name={card.name}
        classes={index >= arr.length - 15 ? `card_${card.name}` : ''}
      />
    ))}
  </div>
);

export default Pile;
