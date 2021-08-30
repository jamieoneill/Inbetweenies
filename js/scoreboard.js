function descending(a, b) {
  return a.money < b.money ? 1 : -1;
}

function reposition() {
  var height = $("#leaderboard .header").height();
  var y = height;
  gameData.players.forEach((player) => {
    player.playerUI.css("top", y + "px");
    y += height;
  });
}

function updateBoard(moveToNextPlayer, resetBoard) {
  //update money on values on board
  getPlayersInGame().forEach((player) => {
    $(".name[value='" + player.name + "']")
      .parent()
      .find(".money")
      .text(parseFloat(player.money).toFixed(2));

    //if player has no money they are out
    if (parseFloat(player.money).toFixed(2) == 0.0) {
      removePlayerFromGame(player);
    }
  });

  sortBoard();

  if (moveToNextPlayer) {
    setNextPlayer();
  }

  if (resetBoard) {
    resetBetValues();
  }
}

function removePlayerFromGame(player) {
  logToHistory(player.name + " is out of the game");

  $(".name[value='" + player.name + "']")
    .parent()
    .addClass("out");

  //remove player from player order
  player.playing = false;
  gameData.playerOrder.splice(gameData.playerTurn, 1);

  if (gameData.playerTurn != 0) {
    gameData.playerTurn--;
  }
}

function setNextPlayer() {
  $(".name[value='" + getCurrentPlayer().name + "']")
    .parent()
    .removeClass("active");

  //get players still in game
  let playersInGame = getPlayersInGame();

  //set next active player
  if (gameData.playerTurn + 1 < playersInGame.length) {
    gameData.playerTurn++;
  } else if (playersInGame.length == 1) {
    endGame(playersInGame[0]);
    return;
  } else {
    //end of round
    gameData.playerTurn = 0;
    startNewRound();
  }

  $("#playerTurnValue").text(getCurrentPlayer().name);
  $(".name[value='" + getCurrentPlayer().name + "']")
    .parent()
    .addClass("active");
}

function sortBoard() {
  //sort
  gameData.players.sort(descending);
  reposition();
}

function resetBetValues() {
  //reset bet and pot values
  gameData.betAmount = gameData.currentAnte;
  $("#betValue").text(0);
  $("#potValue").text(parseFloat(gameData.pot).toFixed(2));
}

function loadScoreboard() {
  let list = $("#players");

  gameData.players.forEach((player) => {
    var playerUI = $(
      "<li>" +
        "<div class='image'><img src='images/avatars/" +
        player.avatar +
        ".png' alt='avatarImage' class='playerIcon'></div>" +
        "<div class='name' value='" +
        player.name +
        "' >" +
        player.name +
        "</div>" +
        "<div class='money'>" +
        player.money +
        "</div>" +
        "</li>"
    );

    player.playerUI = playerUI;
    list.append(playerUI);
  });

  //set player order if not already set
  if (gameData.playerOrder.length == 0) {
    gameData.players.forEach((player) => {
      gameData.playerOrder.push(player.name);
    });
  }

  sortBoard();
  $(".name[value='" + getCurrentPlayer().name + "']")
    .parent()
    .addClass("active");
}
