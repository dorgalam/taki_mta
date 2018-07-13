import React from 'react';

class RewindUI extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  componentDidUpdate(prevProps) {
    if (prevProps.inRewind !== this.props.inRewind && this.props.inRewind) {
      this.setState({ rewindIndex: 0 }, () => {
        this.props.setRewindIndex(this.state.rewindIndex);
      });
    }
  }

  render() {
    return this.props.inRewind ? (
      <div id="rewind1">
        <h3>replay move number: {this.state.rewindIndex + 1 || "rewind ended"}</h3>
        <button id="prev"
          disabled={this.state.rewindIndex === 0}
          className="clickable btn"
          onClick={() => {
            this.setState({ rewindIndex: this.state.rewindIndex - 1 }, () => {
              this.props.setRewindIndex(this.state.rewindIndex);
            });
          }}
        >
          PREV
        </button>
        <button id="next"
          disabled={this.state.rewindIndex === this.props.numberOfTurns - 1}
          className="clickable btn"
          onClick={() => {
            this.setState({ rewindIndex: this.state.rewindIndex + 1 }, () => {
              this.props.setRewindIndex(this.state.rewindIndex);
            });
          }}
        >
          NEXT
        </button>
      </div >
    ) : (
        <button id="rewind"
          className="btn"
          disabled={this.props.winner}
          onClick={this.props.rewind}
          hidden={this.props.winner}
        >
          Replay
      </button>
      );
  }
}

export default RewindUI;
