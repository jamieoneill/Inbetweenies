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

  switch (card.suit) {
    case "♥":
      cardColor = "playingCard--red";
      break;
    case "♦":
      cardColor = "playingCard--red";
      break;
    default:
      break;
  }

  cardUI = $( 
    `<div class="playingCard playingCard--margin playingCard--small ` + cardColor + `">
      <div class="playingCard__tab">
      ` +card.face + ` <span class="playingCard__tab__symbol">` + card.suit +`</span>
      </div>
      <div class="playingCard__tab playingCard__tab--bottom">
      ` +card.face+ ` <span class="playingCard__tab__symbol">` + card.suit +`</span>
      </div>
      <div class="playingCard__graphic">
      `+ mapCardGraphic(card.face, card.suit) +`
      </div>
    </div>`
  );

  $("#cardHolder").append(cardUI);
}

function setCardFaces(){
  deck.forEach((card) => {
    switch (card.value) {
      case 1:
        card.face = "A";
        break;
      case 11:
        card.face = "J";
        break;
      case 12:
        card.face = "Q";
        break;
      case 13:
        card.face = "K";
        break;
      default:
        card.face = card.value;
        break;
    }
  });
}

function mapCardGraphic(face, suit){
  let graphics = "";

  if (isNaN(face)) {

    if(face == "A"){
      graphics = '<span class="element">' + face +'</span>';
    } else{
      graphics = '<img class="element" src="images/cards/'+ face +'.gif" alt=""/>';
    }

  }else{
    for (let i = 0; i < face; i++) {
      graphics += '<span class="element">' + suit +'</span>';
    }
  }

  return graphics;
}
