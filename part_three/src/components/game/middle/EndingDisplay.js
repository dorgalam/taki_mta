import React from 'react';
import RewindUI from './RewindUI.js';
import { Player } from '../index.js';

function printWinners(player, place, stats) {
  return (
    <tr>
      <td>{player}</td><td>{place}</td><td>{stats.turns}</td><td>{getAverage(stats.turnsTime)}</td><td>{stats.lastCard}</td>
    </tr>
  );
};

function getAverage(turnsTime) {
  return (
    turnsTime.reduce((sum, item) => sum + item, 0) / turnsTime.length || 0
  ).toFixed(2);
}

const EndingDisplay = ({ winner, playersFinished, allStats }) =>
  winner > -1 ? (
    <div id="ending" className="popup">
      <table><tbody>
        <tr><th>player name:</th><th>place:</th><th>player turns:</th>
          <th>player avg time:</th><th>player last card declaration:</th></tr>
        {playersFinished.map((player, index) => printWinners(player, index + 1, allStats[player]))}
      </tbody></table>
    </div>
  ) : null;

export default EndingDisplay;
