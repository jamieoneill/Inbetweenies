// HOME //
$("#newGameBtn").on("click", function () {
  let menuBody = `
  <div class="input-container mt-4">
    <select class="input form-control" aria-label="No. of Players" id="playersNumber">
      <option selected value="2">2</option>
      <option value="3">3</option>
      <option value="4">4</option>
    </select>
    <div class="cut cut-long"></div>
    <label for="playersNumber" class="labelholder">No. of Players</label>
  </div>

  <div class="input-container mt-4">
    <input type="number" min="1" step="0.2" class="input form-control" id="betSize" value="5.0" >
    <div class="cut cut-long"></div>
    <label for="betSize" class="labelholder">Buy in Price</label>
  </div>

  <div class="input-container mt-4">
    <input type="number" min="0.10" step="0.10" class="input form-control" id="currentAnte" value="0.2" >
    <div class="cut cut-long"></div>
    <label for="currentAnte" class="labelholder">Starting Ante</label>
  </div>

  <div class="input-container mt-4">
    <input type="number" min="0.10" step="0.10" class="input form-control" id="anteIncrement" value="0.2" >
    <div class="cut cut-long"></div>
    <label for="anteIncrement" class="labelholder">Ante Increment</label>
  </div>

  <div class="input-container mt-4">
    <input type="number" min="1" step="1" class="input form-control" id="incrementRound" value="1" >
    <div class="cut cut-xl"></div>
    <label for="incrementRound" class="labelholder">Increase Ante After Round</label>
  </div>
  `;

  displayModal("New Game", menuBody, "Confirm", "enterSettings");
});

$("#loadGameBtn").on("click", function () {
  //load game
  try {
    loadState();
    startGame();
  } catch (error) {
    alert ("No save data found")
  }

});

$("#historyBtn").on("click", function () {
  //show history
  displayModal("History", loadHistory(), null);
});

//show a menu in a modal
function displayModal(title, body, confirm, confirmAction) {
  let modal = new bootstrap.Modal(document.getElementById("overlayModal"), {
    backdrop: "static",
  });

  //clear old modal
  modal.hide();
  $("#modalClose").show();
  $("#modalConfirm").show();
  $("#modalConfirm").prop("onclick", null).off("click");

  //set values
  $("#modalTitle").text(title);
  $("#modalBody").html(body);

  if (confirm) {
    $("#modalConfirm").text(confirm);
  } else {
    $("#modalConfirm").hide();
  }

  modal.show();

  $("#modalConfirm").on("click", function () {
    switch (confirmAction) {
      //add the game settings
      case "enterSettings":
        modal.hide();

        $("#modalBody")
          .find("input,select")
          .each(function (i, obj) {
            gameSettings[$(obj).attr("id")] = parseFloat($(obj).val());
          });

        enterPlayers();
        break;

      //add the players
      case "enterPlayers":
        //validate player names first
        let allValid = true;
        let inputs = document.querySelectorAll("form");
        inputs.forEach(function (form) {
          if (!form.reportValidity()) {
            allValid = false;
          }
        });

        if (allValid) {
          modal.hide();

          $("#modalBody")
            .find(".playerValues")
            .each(function (i, obj) {
              userName = $(obj).find("input[type=text]").val();
              userMoney = parseFloat($(obj).find("input[type=number]").val());
              userAvatar = $("#avatarCarousel" + i)
                .find(".active")
                .find("img")
                .attr("name");

              gameData.players.push({
                name: userName,
                money: userMoney,
                avatar: userAvatar,
                playing: true,
              });
            });

          startGame();
        }
        break;

      default:
        break;
    }
  });
}

function enterPlayers() {
  // add all avatar images to placeholder
  let avatarImages = ``;
  for (let i = 0; i < numberOfAvatars; i++) {
    avatarImages +=
      `          
    <div class="carousel-item">
      <img src="images/avatars/avatar` +
      i +
      `.png" name="avatar` +
      i +
      `" alt="avatarImage">
    </div>
    `;
  }

  let avatarHolder =
    `
  <div class="d-flex mb-3">

    <div class="p-2">
      <div id="avatarCarousel" class="carousel slide carouselMaster" data-bs-ride="carousel" data-bs-interval="false">
        <div class="carousel-inner">
        ` +
    avatarImages +
    `
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#avatarCarousel" data-bs-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#avatarCarousel" data-bs-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Next</span>
        </button>
      </div>
    </div>

  <form class="p-2 playerValues">
      <div class="input-container">
        <input type="text" class="input form-control player-names" minlength="2" maxlength="15" placeholder=" " required>
        <div class="cut"></div>
        <label class="labelholder">Player</label>
      </div>

      <div class="input-container mt-4">
        <input type="number" class="input form-control" placeholder=" " value="` +
    gameSettings.betSize +
    `" >
        <div class="cut"></div>
        <label class="labelholder">Money</label>
      </div>
    </div>
  </form>
  `;

  let bodyHolder = "";

  //add an avatar placeholder for each placer
  for (let i = 0; i < parseInt(gameSettings.playersNumber); i++) {
    //hold avatarHolder and set an active image for each player
    let tempHolder = replaceOccurrence(
      avatarHolder,
      /carousel-item/g,
      i + 1,
      "carousel-item active"
    );

    if (i % 2 == 0) {
      bodyHolder +=
        '<div class="d-flex flex-wrap justify-content-center mb-3">';
      bodyHolder +=
        '<div class="p-2">' +
        tempHolder.replaceAll("avatarCarousel", "avatarCarousel" + i) +
        "</div>";
    } else {
      bodyHolder +=
        '<div class="p-2">' +
        tempHolder.replaceAll("avatarCarousel", "avatarCarousel" + i) +
        "</div>";
      bodyHolder += "</div>";
    }
  }

  displayModal("Players", bodyHolder, "Start", "enterPlayers");

  //ensure unique player names
  $(".player-names").keyup(function () {
    let names = $(".player-names");
    let uniques = new Set(names.map((i, el) => el.value).get());

    if (uniques.size < names.length) {
      $(this)[0].setCustomValidity("All names must be unique");
    }else{
      $(this)[0].setCustomValidity("");
    }
  });
}
