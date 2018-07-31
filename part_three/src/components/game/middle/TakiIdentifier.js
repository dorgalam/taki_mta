import React from 'react';

const TakiIdentifier = ({ openTaki, closeTaki }) =>
  openTaki ? (
    <div id="closeT" className="turn">
      <div onClick={closeTaki} id="closeTaki">
        Close taki
      </div>
    </div>
  ) : null;

export default TakiIdentifier;
