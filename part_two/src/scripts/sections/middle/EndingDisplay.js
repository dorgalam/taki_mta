import React from 'react';

const EndingDisplay = ({ isWinner, turns, lastOne }) => (
  <div id="ending" style={{ position: 'absolute', left: '30%', top: '20%' }}>
    <div id="celebrate" style={{ display: 'none' }}>
      <img src="../src/styles/assets/barney-celebrate.gif" alt="gif" />
    </div>
    <div id="loser" style={{ display: 'none' }}>
      <img src="../src/styles/assets/loser.gif" alt="gif" />
      <img src="../src/styles/assets/cry.gif" alt="gif" />
    </div>
    <div id="bot-stats" className="bot_stats" style={{ display: 'none' }}>
      <h1>Bot Stats:</h1>
      <h2>
        Turns played:
        <a id="bot_num_turns">{turns}</a>
      </h2>
      <h2 style={{ fontSize: '90%' }}>
        Last card declerations:
        <a id="bot_last_one">{lastOne}</a>
      </h2>
    </div>
  </div >
);

export default EndingDisplay;
