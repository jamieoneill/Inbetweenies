function shuffleDeck() {
  // for 1000 turns
  // switch the values of two random cards
  for (var i = 0; i < 1000; i++) {
    var location1 = Math.floor(Math.random() * deck.length);
    var location2 = Math.floor(Math.random() * deck.length);
    var tmp = deck[location1];

    deck[location1] = deck[location2];
    deck[location2] = tmp;
  }
}

function renderCard(card) {
  var cardUI = "";
  var cardColor = "";
  var cardImage = "";

  switch (card.suit) {
    case "hearts":
      cardColor = "red";
      break;
    case "diams":
      cardColor = "red";
      break;
    default:
      break;
  }

  //is a face card, add image
  if (isNaN(card.value)) {

    if(card.value == "A"){
        cardImage = '<div class="ace">&'+card.suit +';</div>'
    }else{
        cardImage = '<img class="face" src="images/cards/'+card.value+'.gif" alt="" width="80" height="130" />';
    }
  }

  cardUI = $(
    `<div class="playingCard">
        <div class="front ` + cardColor + `">
        <div class="cardIndex cardIndexT">` +card.value +`<br>&` +card.suit +`;</div>
        `+ cardImage + mapCardSpots(card.value,card.suit) +`
        <div class="cardIndex cardIndexB">` +card.value +`<br>&` +card.suit +`;</div>
        </div>
    </div>`
  );

  $("#cardHolder").append(cardUI);
}

function mapCardSpots(value, suit){

    let spots = "";

    switch (value) {
        case 2:
            spots = `
            <div class="spotB1">&`+suit+`;</div>
            <div class="spotB5">&`+suit+`;</div>
            `
            break;
        case 3:
            spots = `
            <div class="spotB1">&`+suit+`;</div>
            <div class="spotB3">&`+suit+`;</div>
            <div class="spotB5">&`+suit+`;</div>
            `
            break;
        case 4:
            spots = `
            <div class="spotA1">&`+suit+`;</div>
            <div class="spotA5">&`+suit+`;</div>
            <div class="spotC1">&`+suit+`;</div>
            <div class="spotC5">&`+suit+`;</div>
            `
            break;
        case 5:
            spots = `
            <div class="spotA1">&`+suit+`;</div>
            <div class="spotA5">&`+suit+`;</div>
            <div class="spotB3">&`+suit+`;</div>
            <div class="spotC1">&`+suit+`;</div>
            <div class="spotC5">&`+suit+`;</div>
            `
            break;
        case 6:
            spots = `
            <div class="spotA1">&`+suit+`;</div>
            <div class="spotA3">&`+suit+`;</div>
            <div class="spotA5">&`+suit+`;</div>
            <div class="spotC1">&`+suit+`;</div>
            <div class="spotC3">&`+suit+`;</div>
            <div class="spotC5">&`+suit+`;</div>
            `
            break;
        case 7:
            spots = `
            <div class="spotA1">&`+suit+`;</div>
            <div class="spotA3">&`+suit+`;</div>
            <div class="spotA5">&`+suit+`;</div>
            <div class="spotB2">&`+suit+`;</div>
            <div class="spotC1">&`+suit+`;</div>
            <div class="spotC3">&`+suit+`;</div>
            <div class="spotC5">&`+suit+`;</div>
            `
            break;
        case 8:
            spots = `
            <div class="spotA1">&`+suit+`;</div>
            <div class="spotA3">&`+suit+`;</div>
            <div class="spotA5">&`+suit+`;</div>
            <div class="spotB2">&`+suit+`;</div>
            <div class="spotB4">&`+suit+`;</div>
            <div class="spotC1">&`+suit+`;</div>
            <div class="spotC3">&`+suit+`;</div>
            <div class="spotC5">&`+suit+`;</div>
            `
            break;
        case 9:
            spots = `
            <div class="spotA1">&`+suit+`;</div>
            <div class="spotA2">&`+suit+`;</div>
            <div class="spotA4">&`+suit+`;</div>
            <div class="spotA5">&`+suit+`;</div>
            <div class="spotB3">&`+suit+`;</div>
            <div class="spotC1">&`+suit+`;</div>
            <div class="spotC2">&`+suit+`;</div>
            <div class="spotC4">&`+suit+`;</div>
            <div class="spotC5">&`+suit+`;</div>
            `
            break;
        case 10:
            spots = `
            <div class="spotA1">&`+suit+`;</div>
            <div class="spotA2">&`+suit+`;</div>
            <div class="spotA4">&`+suit+`;</div>
            <div class="spotA5">&`+suit+`;</div>
            <div class="spotB2">&`+suit+`;</div>
            <div class="spotB4">&`+suit+`;</div>
            <div class="spotC1">&`+suit+`;</div>
            <div class="spotC2">&`+suit+`;</div>
            <div class="spotC4">&`+suit+`;</div>
            <div class="spotC5">&`+suit+`;</div>
            `
            break;
        case "A":
            break;
        default:
            spots = `
            <div class="spotA1">&`+suit+`;</div>
            <div class="spotC5">&`+suit+`;</div>
            `
            break;
    }

    return spots;
}