import React from 'react';
import RewindUI from './RewindUI.js';


const EndingDisplay = ({ stats, winner, rewindProps }) => (
  winner > -1 ?
    <div id="ending" className='popup' >
      <RewindUI {...rewindProps} winner={winner === -1} />
      <div id="celebrate" >
        <img src="../src/styles/assets/barney-celebrate.gif" alt="gif" />
      </div>
      <div id="loser" >
        <img src="../src/styles/assets/loser.gif" alt="gif" />
      </div>
      <div id="bot-stats" className="bot_stats">
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
