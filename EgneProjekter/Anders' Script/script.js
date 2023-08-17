// Connect to sheet
const ss = SpreadsheetApp.getActiveSpreadsheet();
const cardsSheet = ss.getSheetByName("Cards"); // Sheet with cards
const setupSheet = ss.getSheetByName("Setup"); // Sheet with settings for generating cards
const cardsSheetLastRow = cardsSheet.getLastRow() - 1; // Last row of cards, mostly used for deleting old cards before inserting new ones
const cardsRange = cardsSheet.getRange(2,1,cardsSheetLastRow,6); // All the cards as array
const effectsArray = setupSheet.getRange("B2:B").getValues().filter(String).flat(); // Get effects as array
const colorArray = setupSheet.getRange("A2:A").getValues().filter(String).flat(); // Get colors as array
const cardCopies = setupSheet.getRange("C2").getValue(); // Number of copies of each card
const starterCopies = setupSheet.getRange("D2").getValue(); // Number of starter cards for each color

function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Tryllestav')
      .addItem('Regenerate cards', 'generateCards')
      .addToUi();
}

// Make all dem cards
function generateCards() {
  let cardsArray = []; // Make an array we can populate
  let cardCount = 0; // Used for giving the cards IDs from 1 to total number of starter cards

  // Generate starter cards
  function createStarterCards(amountPerColor){
    let tempColorArray = colorArray; // Make a temporary color array we can sort
    // let tempEffectsArray = effectsArray; // Make a temporary color array we can sort
    colorArray.forEach(color => {
    //   let firstColor = color;
      tempColorArray.sort(function(x,y){ return x == color ? -1 : y == color ? 1 : 0; }); // Move the current color, to the front of the temporary color array
      let i = 0;
      while (i < amountPerColor) {
        let whichEffect = i + 1;
        if (whichEffect == amountPerColor) {
          whichEffect = 0;
        }
        cardCount++; // Add one to card counter before pushing card to array or we'll be on index 0
        cardsArray.push([cardCount,color,effectsArray[i],tempColorArray[i + 1],effectsArray[whichEffect],"yes"]); // Create one card per amountPerColor
        i++;
      }
    })
  }
  createStarterCards(starterCopies);

  // Generate all other cards
  function createAllOtherCards(numberOfCopiesPerColorPlusEffect){
    let tempColorArray = colorArray; // Make a temporary color array we can sort
    let tempEffectsArray = effectsArray; // Make a temporary color array we can sort
    colorArray.forEach(color => {
      let first = color;
      tempColorArray.sort(function(x,y){ return x == first ? -1 : y == first ? 1 : 0; }); // Move the current color, to the front of the temporary color array
      effectsArray.forEach(effect => {
        let first = effect;
        tempEffectsArray.sort(function(x,y){ return x == first ? -1 : y == first ? 1 : 0; }); // Move the current effect, to the front of the temporary effects array
        let n = 0;
        while (n < (colorArray.length - 1)) {
          let i = 0;
          while (i < numberOfCopiesPerColorPlusEffect) {
            let whichEffect = n + 1;
            if (whichEffect == colorArray.length) {
              whichEffect = 0;
            }
            cardCount++;
            cardsArray.push([cardCount,color,effect,tempColorArray[n + 1],effectsArray[whichEffect],"no"]);
            i++;
          }
          n++;
        }
      })
    })
  }
  createAllOtherCards(cardCopies);

  // Clear the existing cards in case our new generation makes fewer than last time :)
  cardsRange.clear();

  // Insert cards to sheet
  const newCardsRange = cardsSheet.getRange(2,1,cardsArray.length,6); // Where do we want to insert our values?
  newCardsRange.setValues(cardsArray);
}