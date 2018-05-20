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

  componentDidMount() {
    this.timerInterval = setInterval(() => {
      this.setState({
        elapsed: new Date() - this.state.timeStarted
      });
    }, 100);
  }

  getHours() {
    return Math.floor(this.state.elapsed / (60 * 60 * 1000));
  }
  getMinutes() {
    return Math.floor(this.state.elapsed / (60 * 1000)) % 60;
  }
  getSeconds() {
    return Math.floor(this.state.elapsed / 1000) % 60;
  }

  setTurnTime(date) {
    this.setState(
      {
        turnsTime: [...this.state.turnsTime, date]
      },
      () => this.state.turnsTime
    );
  }

  getAverage() {
    const { turnsTime } = this.state;
    return (
      turnsTime.reduce((sum, item) => sum + item, 0) / turnsTime.length || 0
    ).toFixed(2);
  }

  getState() {
    return this.state;
  }

  overrideState(newState) {
    clearInterval(this.timerInterval);
    this.setState(newState);
  }

  render() {
    return (
      <div id="stats-section">
        <div id="p1-stats" className="stats">
          <h1>Your Stats:</h1>
          <h2>
            Clock
            <a id="timer">{`${this.getHours()}:${this.getMinutes()}:${this.getSeconds()}`}</a>
          </h2>
          <h2>
            Number of turns:
            <div id="turns">{this.props.turns}</div>
          </h2>
          <h2>
            Average turn time:
            <div id="avg_time">{this.getAverage()}</div>
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
