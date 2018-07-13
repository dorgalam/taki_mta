import React from 'react';

class SideBar extends React.Component {
  render() {
    return (
      <div id="side-bar">
        {/* <div id="stats-section">
          <div id="p1-stats" className="stats" style={{display: 'none'}}>
            <h2>
              Clock
              <a id="timer">0:0:0</a>
            </h2>
            <h1>Your Stats:</h1>
            <h2>
              Turns played:
              <a id="num_turns">0</a>
            </h2>
            <h2 style="font-size: 100%;">
              Average turn time:
              <a id="avg_time">0</a>
            </h2>
            <h2 style="font-size: 90%;">
              Last card declerations:
              <a id="last_one">0</a>
            </h2>
          </div>
        </div>
        <div id="actions-section">
          <button
            id="quit-button"
            disabled
            onClick="restart()"
            style="width: 50%; background-color: antiquewhite"
          >
            Restart
          </button>
        </div> */}
      </div>
    );
  }
}

export default SideBar;
