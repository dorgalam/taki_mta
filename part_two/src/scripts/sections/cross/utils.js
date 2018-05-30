const randomMargin = () => Math.floor(Math.random() * 40);

const getPileStyles = () => ({
  transform: `rotate(${-60 + randomMargin() * 3}deg)`,
  margin: `${randomMargin()}px ${randomMargin()}px ${randomMargin()}px ${randomMargin()}px`,
  position: 'absolute'
});

const isSpecialCard = card =>
  card.number === 'taki' ||
  card.number === 'stop' ||
  card.number === 'plus' ||
  card.color === 'colorful';

const getPlayerClasses = (isFacedUp, card) =>
  `card ${isFacedUp ? `card_${card}` : 'card_back'} `;

const getStylesForPlayerCard = (index, length) => {
  const leftPx = index * (length / 2 - 15);
  return {
    position: 'relative',
    left: `${leftPx}px`
  };
};

const shuffleDeck = deck => {
  const times = 300 + Math.floor(Math.random() * 500);
  let copiedDeck = [...deck];
  for (let i = 0; i < times; ++i) {
    const cardsToRemove = Math.floor(Math.random() * copiedDeck.length / 2);
    const up = Math.floor(Math.random() * 2);
    const portions = [
      copiedDeck.slice(0, cardsToRemove / 2 + 1),
      copiedDeck.slice(
        cardsToRemove / 2 + 1,
        cardsToRemove / 2 + 1 + cardsToRemove
      ),
      copiedDeck.slice(cardsToRemove / 2 + cardsToRemove + 1)
    ];
    if (up) {
      copiedDeck = []
        .concat(portions[1])
        .concat(portions[0])
        .concat(portions[2]);
    } else {
      copiedDeck = []
        .concat(portions[0])
        .concat(portions[2])
        .concat(portions[1]);
    }
  }
  return copiedDeck;
};

const createCardsArray = () => {
  const cards = [
    '1',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    'taki',
    'stop',
    'plus',
    '2plus'
  ];
  const colors = ['red', 'blue', 'green', 'yellow'];
  const arr = [];
  let card;
  cards.forEach(number => {
    colors.forEach(color => {
      card = `${String(number)}_${color}`;
      arr.push(card);
      arr.push(card);
    });
  });
  colors.forEach(color => {
    arr.push('change_colorful');
  });
  arr.push('taki_colorful');
  arr.push('taki_colorful');
  return shuffleDeck(arr);
};

export default {
  getPileStyles,
  isSpecialCard,
  getPlayerClasses,
  getStylesForPlayerCard,
  createCardsArray,
  shuffleDeck
};
