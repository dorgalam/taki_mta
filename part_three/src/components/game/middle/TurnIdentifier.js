import React from 'react';

const TurnIdentifier = ({ player }) => (
  <div id="turn" className="turn">
    <div>It's {player}'s turn</div>
  </div>
);

export default TurnIdentifier;
