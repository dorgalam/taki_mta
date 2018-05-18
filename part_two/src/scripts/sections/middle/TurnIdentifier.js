import React from 'react';

const TurnIdentifier = ({ myTurn }) =>
  myTurn ? (
    <div id="turn" className="turn">
      <img id="turn-img" src="../src/styles/assets/yourturn.png" alt="turn" />
    </div>
  ) : null;

export default TurnIdentifier;
