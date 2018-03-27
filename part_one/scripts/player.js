
class Player {
  constructor(deck,isFacedUp) {
    this.playableIndexes = [];
    this.deck = new Deck(deck, isFacedUp);
  }

  getPlayableIndexes(card,active,taki) {
    this.playableIndexes = this.deck.getPlayableIndexes(card,active,taki);
  }

  playCard(index) {
    if (this.playableIndexes.includes(index)) {
      const card = this.deck.getCard(index);
      this.deck.deck = this.deck.removeCard(index);
      this.playableIndexes = this.playableIndexes.filter((item, i) => i !== index);
      return card;
    } 
    return false;
  }

  addCard(card,index,orig) {
    this.deck.addCard(card,index,orig);
  }

  removeCardByCard(card){
    let index;
    this.deck.getDeck().forEach((element,i) => {
      if(element === card)
         index = i;
    });
    this.deck.deck = this.deck.removeCard(index); 
  }

  getHtml() {
    return this.deck.getDeckHtml();
  }

  setCardsClickable(){
    this.deck.getDeck().forEach((element,index) => {
      if(this.playableIndexes.includes(index))
        element.setClickable(index);
    });
  }

  removeCardsClickable(){
    this.deck.getDeck().forEach((element) => {
        element.removeClickable();
    });
  }

  getColorCount(color){
    let count = 0;
    this.deck.getDeck().forEach((element) => {
      if(element.color === color){
        count++;
      }
    });
    return count;
  }

  getNumberCount(number){
    let count = 0;
    this.deck.getDeck().forEach((element) => {
      if(element.number === number){
        count++;
      }
    });
    return count;
  }

  getSpecialTypeColor(color,specialType){
    let special = false;
    this.deck.getDeck().forEach(function(element) {
      if(element.color === color && element.number === specialType){
        special = element;
      }
    });
    return special;
  }

  has2plus(){
    let elem = false;
    this.deck.getDeck().forEach(function(element) {
      console.log(element)
      if(element.number === "2plus"){
        elem = element;
      }
    });
    return elem;
  }

  specialCard(card){
    if(card.number === "taki" || card.number === "stop" || card.number === "plus" || card.color == "colorful"){
      return true;
    }
    return false;
  }

  chooseCard(card,active = true) { //the bot well aware of the cards he has (this.cards)
    let number = card.number;
    let color = card.color;
    if (active && number === "2plus")
      return this.has2plus(); // options: card name, false (take a card from the pile)
    if (active && this.specialCard(card)){
      return this.handleSpecial(color, number);
    }
    let colorCount = this.getColorCount(color); // count number of cards with this color
    let numberCount = this.getNumberCount(number); // count number of cards with this number
    let plus = this.getSpecialTypeColor(color,"plus");
    let stop = this.getSpecialTypeColor(color,"stop");
    let taki = this.getSpecialTypeColor(color,"taki"); //check for taki in this color
    if (taki && colorCount > 1)
      return taki;
    if (stop && (colorCount > 1 || this.getTypeOtherColor("stop")))
      return stop;
    if (plus && (colorCount > 1 || this.getTypeOtherColor("plus")))
      return plus;
    if (colorCount > 0)
      return this.selectColorCard(color); //select the best card with my color (has two of the same number)
    if (numberCount > 0)
      return this.selectNumberCard(number); //select the best card with my number (has two of the same color)
    return this.hasChangeColor(); // true = best color for me , false = take a card from the pile
  }

  hasChangeColor(){
    const deck = this.deck.getDeck();
    for(let i=0;i<deck.length;i++){
      if(deck[i].color === "colorful")
        return deck[i];
    }
    return false;
  }

  selectColorCard(color){
    let numbersArr = {"1": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0, "8": 0, "9": 0,
     "plus": 0,"stop": 0, "taki": 0,"2plus": 0};
    const deck = this.deck.getDeck();
    for(let i=0;i<deck.length;i++){
      if(deck[i].color === color)
        numbersArr[deck[i].number]++;
    }
    let max = Object.keys(numbersArr).reduce(function(a, b){ return numbersArr[a] > numbersArr[b] ? a : b });
    if(numbersArr[max] === 0)
      return false;
    for(let i=0;i<deck.length;i++){
      if(deck[i].color === color && deck[i].number === max)
        return deck[i];
    } 
    
  }

  selectNumberCard(number){
    let colorsArr = {"red": 0,"blue": 0,"green": 0,"yellow": 0};
    const deck = this.deck.getDeck();
    for(let i = 0;i < deck.length;i++){
      if(deck[i].number === number)
      colorsArr[deck[i].color]++;
    }
    let max = Object.keys(colorsArr).reduce(function(a, b){ return colorsArr[a] > colorsArr[b] ? a : b });
    if(colorsArr[max] === 0)
      return false;
    for(let i = 0;i < deck.length;i++){
      if(deck[i].number === number && deck[i].color === max)
        return deck[i];
    }
  }
  
  handleSpecial(color, type) {
    let colorCount = this.getColorCount(color); // count number of cards with this color
    if (type === "taki") { // handle taki
      if (colorCount >= 1) {
        return this.selectColorCard(color);
      }
      return false;
    }
    let res = this.hasSameCard(color, type);
    if (res)
      return res;
    let otherType = this.getTypeOtherColor(type);
    if (otherType && this.getColorCount(otherType.color) > 1)
      return otherType;
    if (colorCount > 0) {
      return this.selectColorCard(color);
    }
    return otherType; //can be false
  }

  getTypeOtherColor(type){
    const deck = this.deck.getDeck();
    for(let i=0;i<deck.length;i++){
      if(deck[i].number === type)
        return deck[i];
    }
    return false;
  }

  hasSameCard(color,type){
    const deck = this.deck.getDeck();
    for(let i=0;i<deck.length;i++){
      if(deck[i].number === type && deck[i].color === color)
        return deck[i];
    }
    return false;
  }

  clearPlayable(){
    this.playableIndexes = [];
  }
  
  won(){
    return this.deck.getDeck().length === 0; 
  }
}