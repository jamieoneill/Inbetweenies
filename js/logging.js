function logToHistory(message) {
  var formattedMessage = $(
    '<div class="historyMessage">' + "<p>" + message + "</p>" + "</div>"
  );

  $("#historyLog").append(formattedMessage);
  $('#historyLog').scrollTop($('#historyLog')[0].scrollHeight);
}
