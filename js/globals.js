// Globals //
var gameSettings = {};
var numberOfAvatars = 16;
var gameData = { pot: 0.00, round: 0, players: [], playerOrder: [], playerTurn: 0, betAmount: 0.00}
const suits = ["spades", "diams", "clubs", "hearts"];
const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
const deck = suits.map((suit) => values.map((value) => ({ value, suit }))).flat(1);

// this is an async timeout util
const timeout = async ms => new Promise(res => setTimeout(res, ms));

function replaceOccurrence(string, regex, n, replace) {
    var i = 0;
    return string.replace(regex, function(match) {
         i+=1;
         if(i===n) return replace;
         return match;
     });
  }