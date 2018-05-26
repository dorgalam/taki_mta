import React from 'react';
import RewindUI from './RewindUI.js';
import { Player } from '../index.js';


const EndingDisplay = ({ stats, winner, rewindProps }) => (
  winner > -1 ?
    <div id="ending" className='popup' >
      <RewindUI {...rewindProps} winner={winner === -1} />
      <div id={winner === 0 ? 'celebrate' : 'hidden'}>
        <img src="../src/styles/assets/barney.gif" alt="gif" height="150" width="150" />
      </div>
      <div id={winner === 1 ? 'loser' : 'hidden'}>
        <img src="../src/styles/assets/loser2.gif" alt="gif" height="150" width="150" />
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
