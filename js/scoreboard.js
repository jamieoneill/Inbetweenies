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
  gameData.players.forEach((player) => {
    $(".name[value='" + player.name + "']")
      .parent()
      .find(".money")
      .text(parseFloat(player.money).toFixed(2));
  });

  sortBoard();

  if (moveToNextPlayer) {
    setNextPlayer();
  }

  if (resetBoard) {
    resetBetValues();
  }
}

function setNextPlayer() {
  $(".name[value='" + gameData.playerOrder[gameData.playerTurn] + "']")
    .parent()
    .removeClass("active");

  //set next active player
  if (gameData.playerTurn + 1 < gameData.players.length) {
    gameData.playerTurn++;
  } else {
    //end of round
    gameData.playerTurn = 0;
    startNewRound();
  }

  $("#playerTurnValue").text(gameData.playerOrder[gameData.playerTurn]);
  $(".name[value='" + gameData.playerOrder[gameData.playerTurn] + "']")
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

  gameData.players.forEach((player) => {
    gameData.playerOrder.push(player.name);
  });

  sortBoard();
  $(".name[value='" + gameData.playerOrder[gameData.playerTurn] + "']")
    .parent()
    .addClass("active");
}
