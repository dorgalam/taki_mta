import React from 'react';

const EndingDisplay = ({ stats, winner }) => (
  winner > -1 ?
    <div id="ending" style={{ position: 'absolute', left: '30%', top: '20%' }}>
      <div id="celebrate" style={{ display: 'none' }}>
        <img src="../src/styles/assets/barney-celebrate.gif" alt="gif" />
      </div>
      <div id="loser" style={{ display: 'none' }}>
        <img src="../src/styles/assets/loser.gif" alt="gif" />
        <img src="../src/styles/assets/cry.gif" alt="gif" />
      </div>
      <div id="bot-stats" className="bot_stats" style={{ display: 'block' }}>
        <h1>Bot Stats:</h1>
        <h2>
          Turns played:
        <a id="bot_num_turns">{stats.turns}</a>
        </h2>
        <h2 style={{ fontSize: '90%' }}>
          Last card declerations:
        <a id="bot_last_one">{stats.lastCard}</a>
        </h2>
      </div>
    </div >
    : null
);

export default EndingDisplay;
