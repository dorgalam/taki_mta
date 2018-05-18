import React from 'react';

const ColorPick = ({ choose, selectColor }) =>
  choose ? (
    <div className="color_tooltip">
      <div>Choose Color:</div>
      <div onClick={selectColor('red')} className="color_tooltip_red" />
      <div onClick={selectColor('yellow')} className="color_tooltip_yellow" />
      <div onClick={selectColor('blue')} className="color_tooltip_blue" />
      <div onClick={selectColor('green')} className="color_tooltip_green" />
    </div>
  ) : null;

export default ColorPick;
