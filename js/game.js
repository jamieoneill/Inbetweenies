// GAME //
var playerCards;
var aceCheckCard;
var aceSelected = false;

function startGame() {
  $("#Home").hide();
  $("#Game").show();

  initGame();
  startNewRound();
}

function initGame() {
  gameSettings.date = new Date().toLocaleString().split(", ")[0];
  gameSettings.time = new Date().toLocaleString().split(", ")[1];

  setCardFaces();
  loadScoreboard();
  gameData.currentAnte = gameSettings.startingAnte;

  $("#roundValue").text(1);
  $("#anteValue").text(gameData.currentAnte);
  $("#potValue").text(gameData.pot);
  $("#playerTurnValue").text(gameData.playerOrder[gameData.playerTurn]);
  $("#betValue").text(0);
  $("#betButtonsHolder").hide();
}

//deal cards
$("#dealBtn").on("click", function () {
  setBetValues();
  $("#dealBtn").hide();
  $("#playBtn").show();
  $("#foldBtn").show();
  $("#betButtonsHolder").show();

  //reset
  $("#cardHolder").empty();
  shuffleDeck();

  playerCards = [deck[0], deck[1]];

  //render first
  playerCards.forEach((card) => {
    renderCard(card);
  });

  //check cards for ace sequentially
  aceCheck(playerCards[0]).then(function (result) {
    playerCards[0] = result;

    aceCheck(playerCards[1]).then(function (result) {
      playerCards[1] = result;
    });
  });

  //set ante
  setAnte();
});

//play the hand
$("#playBtn").on("click", function () {
  var turnCard = deck[2];
  renderCard(turnCard);

  setWinOrLose(
    isInBetween(playerCards[0].value, playerCards[1].value, turnCard.value)
  );

  resetPlayButtons();
});

//fold the hand
$("#foldBtn").on("click", function () {
  //log and update scoreboard
  logToHistory(getCurrentPlayer().name + " folded");
  updateBoard(true, true);

  resetPlayButtons();
});

async function aceCheck(card) {
  if (card.face == "A") {
    //set value for ace
    $("#playButtonsHolder").hide();
    $("#betButtonsHolder").hide();
    $("#aceCheckHolder").show();

    aceCheckCard = Object.create(card);
    await waitForAceSelection().then(function (result) {
      aceCheckCard = result;
    });
  } else if (isNaN(card.value)) {
    //set value for face card
    aceCheckCard = Object.create(card);
    aceCheckCard.value == "10";
  } else {
    aceCheckCard = card;
  }

  return aceCheckCard;
}

$("#aceLowBtn, #aceHighBtn").on("click", function () {
  if (this.name == "low") {
    aceCheckCard.value = 1;
  } else {
    aceCheckCard.value = 14;
  }
  aceSelected = aceCheckCard;

  $("#playButtonsHolder").show();
  $("#betButtonsHolder").show();
  $("#aceCheckHolder").hide();
});

$(".betBtn").on("click", function () {
  let newbet = $(this).text();
  let currentPlayer = getCurrentPlayer();

  if (newbet == "Pot") {
    if (currentPlayer.money < parseFloat(gameData.pot)) {
      gameData.betAmount = parseFloat(currentPlayer.money); //cannot afford pot, bet all the player's money
    } else {
      gameData.betAmount = parseFloat(gameData.pot); //bet the pot value
    }
  } else if (
    parseFloat(gameData.betAmount) + parseFloat(newbet) >
    parseFloat(gameData.pot)
  ) {
    console.log("bet is above pot limit"); //cannot bet anymore
  } else {
    if (
      currentPlayer.money <
      parseFloat(gameData.betAmount) + parseFloat(newbet)
    ) {
      console.log("player cannot afford to add " + newbet + " to the bet"); //cannot bet anymore
    } else {
      gameData.betAmount = parseFloat(gameData.betAmount) + parseFloat(newbet); //bet by amount on button
    }
  }

  //ensure bet is fixed to only 2 decimals
  gameData.betAmount = parseFloat(gameData.betAmount).toFixed(2);

  $("#betValue").text(gameData.betAmount);
});

async function waitForAceSelection() {
  while (aceSelected === false) await timeout(50);
  const updatedCard = aceSelected;
  aceSelected = false;
  return updatedCard;
}

function isInBetween(a, b, c) {
  var min = Math.min.apply(Math, [a, b]),
    max = Math.max.apply(Math, [a, b]);
  return c > min && c < max;
}

function setWinOrLose(winner) {
  let winText;
  let currentPlayer = getCurrentPlayer();

  //update pot & player money
  if (winner) {
    winText = "won";
    gameData.pot = parseFloat(gameData.pot) - parseFloat(gameData.betAmount);
    currentPlayer.money =
      parseFloat(currentPlayer.money) + parseFloat(gameData.betAmount);
    currentPlayer.money = parseFloat(currentPlayer.money).toFixed(2);
  } else {
    winText = "lost";
    gameData.pot = parseFloat(gameData.pot) + parseFloat(gameData.betAmount);
    currentPlayer.money =
      parseFloat(currentPlayer.money) - parseFloat(gameData.betAmount);
    currentPlayer.money = parseFloat(currentPlayer.money).toFixed(2);
  }

  //log and update scoreboard
  logToHistory(currentPlayer.name + " " + winText + ": " + gameData.betAmount);
  updateBoard(true, true);

  //new antes for empty pot
  if (parseFloat(gameData.pot).toFixed(2) == 0.0) {
    logToHistory("Pot emptied - All players add their ante");
    addAllAntes();
    updateBoard(false, false);
    $("#potValue").text(parseFloat(gameData.pot).toFixed(2));
  }
}

function setBetValues() {  
  $("#smallBetBtn").text(gameSettings.anteIncrement);
  $("#midBetBtn").text(getCurrentPlayer().money / 2);
}

function setAnte() {
  let currentPlayer = getCurrentPlayer();

  if(currentPlayer.money < gameData.currentAnte){
    logToHistory(currentPlayer.name + ": Cannot afford ante. They must play their remaining money");
    gameData.betAmount = currentPlayer.money;
    $("#foldBtn").hide();
  }else{
  currentPlayer.money = currentPlayer.money - gameData.currentAnte;
  currentPlayer.money = parseFloat(currentPlayer.money).toFixed(2);
  gameData.pot =
    parseFloat(gameData.pot) + parseFloat(gameData.currentAnte);
  gameData.betAmount = gameData.currentAnte;
  }

  gameData.betAmount = parseFloat(gameData.betAmount).toFixed(2);

  updateBoard(false, false);
  $("#betValue").text(gameData.betAmount);
  $("#potValue").text(parseFloat(gameData.pot).toFixed(2));
}

function getCurrentPlayer() {
  //get the current player
  return gameData.players.find((player) => {
    return player.name === gameData.playerOrder[gameData.playerTurn];
  });
}

function getPlayersInGame() {
  //get the current player
  return gameData.players.filter((player) => {
    return player.playing === true;
  });
}

function resetPlayButtons() {
  $("#dealBtn").show();
  $("#playBtn").hide();
  $("#foldBtn").hide();
  $("#betButtonsHolder").hide();
}

function startNewRound() {
  //save the game before the start of every round
  saveState();

  gameData.round++;
  logToHistory(
    "Starting round: " + gameData.round + " - All players add their ante"
  );

  //up the anteIncrement on incrementRound round
  if (
    gameData.round != 1 &&
    gameData.round % gameSettings.incrementRound === 0
  ) {
    gameData.currentAnte =
      parseFloat(gameData.currentAnte) +
      parseFloat(gameSettings.anteIncrement);

    gameData.currentAnte = parseFloat(gameData.currentAnte).toFixed(2);

    logToHistory("Increasing Ante:  New Ante - " + gameData.currentAnte);

    $("#roundValue").text(gameData.round);
    $("#anteValue").text(gameData.currentAnte);
  }

  //all players pay in on new round
  addAllAntes();
  updateBoard(false, true);
}

function addAllAntes() {
  getPlayersInGame().forEach((player) => {

    if(player.money < gameData.currentAnte){
      logToHistory(player.name + ": Cannot round afford ante. This will be their last hand if they lose");
    }else{
      player.money = player.money - gameData.currentAnte;
      player.money = parseFloat(player.money).toFixed(2);
      gameData.pot =
        parseFloat(gameData.pot) + parseFloat(gameData.currentAnte);
    }
  });
}

function endGame(winner) {
  logToHistory("Game Over");
  logToHistory("Winner: " + winner.name);
  gameData.winner = winner.name;

  $(".name[value='" + winner.name + "']")
    .parent()
    .addClass("winner");

  $("#playButtonsHolder").hide();

  saveFinishedGame();
  localStorage.removeItem("saveData");
}
