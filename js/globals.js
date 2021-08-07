// Globals //
var gameSettings = {};
var players = [];
var numberOfAvatars = 16;
var pot;
const suits = ["spades", "diams", "clubs", "hearts"];
const values = ["A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K"];
const deck = suits.map((suit) => values.map((value) => ({ value, suit }))).flat(1);

function replaceOccurrence(string, regex, n, replace) {
    var i = 0;
    return string.replace(regex, function(match) {
         i+=1;
         if(i===n) return replace;
         return match;
     });
  }