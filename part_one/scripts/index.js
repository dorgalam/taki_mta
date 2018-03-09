// window.onload = function () {
//   var hand = new Hand();
//   hand.render();
//   document.removeCard = function (index) {
//     hand.removeCard(index);
//     hand.render();
//   }
// }

// function Hand() {
//   var currentCards = [1, 2, 3];
//   return {
//     getCards: function () {
//       return currentCards.map(function (item, index) {
//         return `<div class="card" onClick="removeCard(${index})"></div>`
//       }).join('\n');
//     },
//     removeCard: function (index) {
//       currentCards = (currentCards.slice(0, index)).concat(currentCards.slice(index + 1))
//     },
//     render: function () {
//       document.getElementById('cards').innerHTML = this.getCards();
//     }
//   }
// }

// var cardsComponent = function (cards) {
//   return ``;
// }