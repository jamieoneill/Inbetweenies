// HOME //
$("#newGameBtn").on("click", function () {

  let menuBody = `
  <div class="mb-3 row">
    <label for="playersNumber" class="col-sm-6 col-form-label" centered>No. of Players:</label>
    <div class="col-sm-4">
      <select class="form-select" aria-label="No. of Players" id="playersNumber">
        <option selected value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
      </select>
    </div>
  </div>
  <div class="mb-3 row">
    <label for="betSize" class="col-sm-6 col-form-label">Buy in Price:</label>
    <div class="col-sm-4">
      <input type="number" min="1" step="0.2" class="form-control" id="betSize" value="5.0" >
    </div>
  </div>
  <div class="mb-3 row">
    <label for="startingAnte" class="col-sm-6 col-form-label">Starting Ante</label>
    <div class="col-sm-4">
      <input type="number" min="0.10" step="0.10" class="form-control" id="startingAnte" value="0.2" >
    </div>
  </div>
  <div class="mb-3 row">
    <label for="anteIncrement" class="col-sm-6 col-form-label">Ante Increment:</label>
    <div class="col-sm-4">
      <input type="number" min="0.10" step="0.10" class="form-control" id="anteIncrement" value="0.2" >
    </div>
  </div>
  <div class="mb-3 row">
    <label for="incrementRound" class="col-sm-6 col-form-label">Increase Ante After Round:</label>
    <div class="col-sm-4">
      <input type="number" min="1" step="1" class="form-control" id="incrementRound" value="1" >
    </div>
  </div>
  `;

  displayModal("New Game", menuBody, "Confirm", "enterSettings");
});

$("#loadGameBtn").on("click", function () {
  //load game
  displayModal("Load", "Body...", null);
});

$("#historyBtn").on("click", function () {
  //show history
  displayModal("History", "Body...", null);
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

    modal.hide();

    switch (confirmAction) {
      //add the game settings
      case "enterSettings":

        $("#modalBody").find('input,select').each(function(i, obj) {
          gameSettings[$(obj).attr("id")] = $(obj).val();
        });

        enterPlayers();
        break;

      //add the players
      case "enterPlayers":

        $("#modalBody").find('.playerValues').each(function(i, obj) {

          userName =  $(obj).find('input[type=text]').val();
          userMoney = $(obj).find('input[type=number]').val();
          userAvatar = $("#avatarCarousel"+ i).find(".active").find("img").attr("name");
          players.push({ name: userName, money: userMoney, avatar:  userAvatar});
        });
        
        startGame();
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
    avatarImages += `          
    <div class="carousel-item">
      <img src="images/avatars/avatar`+i+`.png" name="avatar`+i+`" alt="avatarImage">
    </div>
    `;
  }

  let avatarHolder = `
  <div class="d-flex mb-3">

    <div class="p-2">
      <div id="avatarCarousel" class="carousel slide carouselMaster" data-bs-ride="carousel" data-bs-interval="false">
        <div class="carousel-inner">
        `+ avatarImages +`
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

    <div class="flex-grow-1 p-2 align-items-center playerValues">
        <div class="mb-3 row">
          <input type="text" class="form-control" placeholder="Player" >
        </div>

        <div class="mb-3 row">
          <input type="number" class="form-control" value="`+gameSettings.betSize+`" >
        </div>
    </div>

  </div>
  `;

  let bodyHolder = "";

  //add an avatar placeholder for each placer
  for (let i = 0; i < parseInt(gameSettings.playersNumber); i++) {

    //hold avatarHolder and set an active image for each player
    let tempHolder = replaceOccurrence(avatarHolder, /carousel-item/g, i + 1, 'carousel-item active')

    if (i % 2 == 0) {
      bodyHolder += '<div class="d-flex flex-wrap justify-content-center mb-3">';
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
}
