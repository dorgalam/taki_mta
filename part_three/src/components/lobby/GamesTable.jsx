import React from 'react';

export default class GamesTable extends React.Component {
  constructor() {
    super();
    this.state = {};
  }
  render() {
    return (
      <form>
        <fieldset>
          <legend>games</legend>
          <table>
            <tbody>
              <tr><th>game name</th><th>required number of players</th><th>number of players in game</th><th>status</th><th>join/quit</th></tr>
              {this.props.games ? this.props.games.map((game, index) => (
                <tr key={game.id}>
                  <td>
                    <label htmlFor={game.name}>
                      {game.name}
                    </label>
                  </td>
                  <td>
                    <label htmlFor={game.numberOfPlayers}>
                      {game.numberOfPlayers}
                    </label>
                  </td>
                  <td>
                    <label htmlFor={game.players.length}>
                      {game.players.length}
                    </label>
                  </td>
                  <td>
                    <label htmlFor={game.status}>
                      {game.status}
                    </label>
                  </td>

                  <td><button onClick={e => {
                    e.preventDefault();
                    this.props.onSubmit(game.id);
                  }}>{game.players.some(player => player === this.props.user) ? "quit" : "join"}</button></td>
                </tr>
              )) : ""}
            </tbody>
          </table>
        </fieldset>
      </form>
    );
  }
}
