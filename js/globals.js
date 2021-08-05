// Globals //
var gameSettings = {};
var players = [];
var numberOfAvatars = 16;

function replaceOccurrence(string, regex, n, replace) {
    var i = 0;
    return string.replace(regex, function(match) {
         i+=1;
         if(i===n) return replace;
         return match;
     });
  }