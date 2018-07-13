import React from 'react';

const CardComp = ({ styles, classes, handleCardClick }) => (
  <div style={styles} className={`card ${classes}`} onClick={handleCardClick} />
);

export default CardComp;
