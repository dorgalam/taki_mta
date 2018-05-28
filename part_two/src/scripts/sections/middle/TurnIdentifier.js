import React from 'react';

const TurnIdentifier = ({ myTurn }) =>
  myTurn ? (
    <div id="turn" className="turn">
      <div id="turn-img" className="human-image" alt="turn" />
    </div>
  ) : (
    <div id="turn" className="turn">
      <div id="turn-img" className="bot-image" alt="turn" />
    </div>
  );

export default TurnIdentifier;
