import React from 'react';
import RewindUI from './RewindUI.js';
import { Player } from '../index.js';

function printWinners(player, place) {
  return (
    <tr>
      <td>{player}</td><td>{place}</td>
    </tr>
  );
};

const EndingDisplay = ({ stats, winner, playersFinished }) =>
  winner > -1 ? (
    <div id="ending" className="popup">
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
      <table><tbody>
        <tr><th>player name:</th><th>place:</th></tr>
        {playersFinished.map((player, index) => printWinners(player, index + 1))}
      </tbody></table>
    </div>
  ) : null;

export default EndingDisplay;
