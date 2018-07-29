import React from 'react';

export default class WaitingRoom extends React.Component {
    constructor() {
        super();
        this.state = {};
    }
    render() {
        return (
            <form
                onSubmit={e => {
                    e.preventDefault();
                    this.props.onSubmit(this.props.game.name, this.props.user);
                }}
            >
                <fieldset className="game">
                    <h1>hello {this.props.playerName}</h1>
                    <h2>walcome to the game {this.props.game.name}</h2>
                    <h3>number of players required: {this.props.game.numberOfPlayers}</h3>
                    <h3>players waiting:</h3>
                    {this.props.game.players.map((player, index) => (
                        <div key={index}>
                            <a>
                                <label htmlFor={player}>
                                    {player}
                                </label>
                            </a>
                        </div>))}
                    <input type="submit" className="addGame" value="quit game" />
                </fieldset>
            </form>
        );
    }
}
