import React from 'react';

class Statistics extends React.Component {
  constructor() {
    super();
    this.state = {
      turnsTime: [],
      timeStarted: new Date(),
      elapsed: 0,
      average: 0
    };
    this.getHours = this.getHours.bind(this);
    this.getMinutes = this.getMinutes.bind(this);
    this.getSeconds = this.getSeconds.bind(this);
  }

  getHours(clock) {
    return Math.floor(clock / (60 * 60));
  }
  getMinutes(clock) {
    return Math.floor(clock / (60)) % 60;
  }
  getSeconds(clock) {
    return Math.floor(clock) % 60;
  }

  setTurnTime(date) {
    this.setState(
      {
        turnsTime: [...this.state.turnsTime, date]
      },
      () => this.state.turnsTime
    );
  }

  getAverage(turnsTime) {
    return (
      turnsTime.reduce((sum, item) => sum + item, 0) / turnsTime.length || 0
    ).toFixed(2);
  }

  getState() {
    return this.state;
  }

  render() {
    const { turnsTime, clock } = this.props;
    return (

      <div id="side-stats">
        <div id="p1-stats" className="stats">
          <h1>Your Stats:</h1>
          <h2>
            Clock
              <a id="timer">{` ${this.getHours(clock)}:${this.getMinutes(clock)}:${this.getSeconds(clock)}`}</a>
          </h2>
          <h2>
            Number of turns:
              <div id="turns">{this.props.turns}</div>
          </h2>
          <h2>
            Average turn time:
              <div id="avg_time">{this.getAverage(turnsTime)}</div>
          </h2>
          <h2>
            Last card declerations:
              <div id="last_one">{this.props.lastCard}</div>
          </h2>
        </div>
      </div>
    );
  }
}

export default Statistics;
