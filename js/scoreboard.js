function descending(a, b) {
  return a.money < b.money ? 1 : -1;
}

function reposition() {
  var height = $("#leaderboard .header").height();
  var y = height;
  for (var i = 0; i < players.length; i++) {
    players[i].$item.css("top", y + "px");
    y += height;
  }
}

function updateBoard() {
  players.sort(descending);
  reposition();
}

function loadScoreboard() {
  var $list = $("#players");

  for (var i = 0; i < players.length; i++) {
    var $item = $(
      "<li class='player'>" +
        "<div class='image'><img src='images/avatars/" +
        players[i].avatar +
        ".png' alt='avatarImage' class='playerIcon'></div>" +
        "<div class='name'>" +
        players[i].name +
        "</div>" +
        "<div class='money'>" +
        players[i].money +
        "</div>" +
        "</li>"
    );
    players[i].$item = $item;
    $list.append($item);
  }

  updateBoard();
}
