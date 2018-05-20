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
      <div>
        <h3>Turn nunber: {this.state.rewindIndex + 1}</h3>
        <button
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
        <button
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
      </div>
    ) : (
      <button
        className="btn"
        disabled={this.props.numberOfTurns < 1}
        onClick={this.props.rewind}
      >
        Rerun
      </button>
    );
  }
}

export default RewindUI;
