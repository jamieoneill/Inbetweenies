// GAME //
function startGame() {
  $("#Home").hide();
  $("#Game").show();

  loadScoreboard();
  console.log(players);
}

//deal cards
$("#dealBtn").on("click", function () {
  //reset
  $("#cardHolder").empty();
  shuffleDeck();

  let card1 = deck[0];
  let card2 = deck[1];

  renderCard(card1);
  renderCard(card2);
});
