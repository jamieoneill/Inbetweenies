function logToHistory(message) {
  var formattedMessage = $(
    '<div class="historyMessage">' + "<p>" + message + "</p>" + "</div>"
  );

  $("#historyLog").append(formattedMessage);
  $("#historyLog").scrollTop($("#historyLog")[0].scrollHeight);

  if (!gameHistory.includes(message)) {
    gameHistory.push(message);
  }
}

function saveState() {
  //save current game
  const saveData = {
    gameSettings: gameSettings,
    gameData: gameData,
    gameHistory: gameHistory,
  };
  localStorage["saveData"] = JSON.stringify(saveData);
}

function loadState() {
  //load last game
  let saveData = localStorage["saveData"];

  if (saveData) {
    saveData = JSON.parse(saveData);

    gameSettings = saveData.gameSettings;
    gameData = saveData.gameData;
    gameHistory = saveData.gameHistory;

    gameHistory.forEach((input) => {
      logToHistory(input);
    });
  } else {
    throw new Error("No save data");
  }
}

function saveFinishedGame() {
  let allGameHistory = localStorage["allGameHistory"];

  //add game to history list
  if (allGameHistory) {
    allGameHistory = JSON.parse(allGameHistory);
    allGameHistory.push({
      gameSettings: gameSettings,
      gameData: gameData,
      gameHistory: gameHistory,
    });
  } else {
    //no list, create it
    allGameHistory = [gameHistory];
    allGameHistory = [
      {
        gameSettings: gameSettings,
        gameData: gameData,
        gameHistory: gameHistory,
      },
    ];
  }

  localStorage["allGameHistory"] = JSON.stringify(allGameHistory);
}

function loadHistory() {
  //load history
  let allHistory = localStorage["allGameHistory"];
  let render = "";

  if (allHistory) {
    allHistory = JSON.parse(allHistory);

    render += `
    <table class="table table-striped table-bordered">   
    <thead>
    <tr>
      <th scope="col">Winner</th>
      <th scope="col">Date</th>
      <th scope="col">Time</th>
    </tr>
    </thead>`;

    allHistory.reverse().forEach((game, i) => {
      console.log(game);
      var prettyLogEntry = syntaxHighlight(JSON.stringify(game));

      render +=
        `  
      <tr data-bs-toggle="collapse" data-bs-target="#historyAccordion` +
        i +
        `" class="clickable">
        <th scope="row">` +
        game.gameData.winner +
        `</th>
        <td>` +
        game.gameSettings.date +
        `</td>
        <td>` +
        game.gameSettings.time +
        `</td>
      </tr>
      <tr>
        <td colspan="3" class="no-margin"><pre id="historyAccordion` +
        i +
        `" class="collapse">` +
        prettyLogEntry +
        `</pre></td>
      </tr>
      `;
    });

    render += "</table>";
  } else {
    render = "No games have been played";
  }

  return render;
}

function syntaxHighlight(jsonstring) {
  json = JSON.stringify(JSON.parse(jsonstring), null, 2);

  json = json
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    function (match) {
      var cls = "number";
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = "key";
        } else {
          cls = "string";
        }
      } else if (/true|false/.test(match)) {
        cls = "boolean";
      } else if (/null/.test(match)) {
        cls = "null";
      }
      return '<span class="' + cls + '">' + match + "</span>";
    }
  );
}
