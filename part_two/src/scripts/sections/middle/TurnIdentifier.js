import React from 'react';

const TurnIdentifier = ({ myTurn }) =>
  myTurn ? (
    <div id="turn" className="turn">
      <img id="turn-img" src="../src/styles/assets/human.png" alt="turn" />
    </div>
  ) : <div id="turn" className="turn">
      <img id="turn-img" src="../src/styles/assets/bot.png" alt="turn" />
    </div>;

export default TurnIdentifier;
