import React from 'react';

const TakiIdentifier = ({ openTaki, closeTaki }) =>
  openTaki ? (
    <div id="closeT" className="turn">
      <button className="btn" onClick={closeTaki} id="closeTaki">
        Close taki
      </button>
    </div>
  ) : null;

export default TakiIdentifier;
