listen = /define/i;
var apikey = bot.api.wordnik;

function process(nick, to, cmd, topass) {
    var fetch = require('fetch').fetchUrl;
    var onlyLetters = /^[a-zA-Z]*$/.test(topass);
    if (!onlyLetters) {
        bot.say(to, "Invalid Word");
        return;
    }
    var url = "http://api.wordnik.com/v4/word.json/" + topass + "/definitions?includeRelated=false&api_key=" + apikey + "&includeTags=false&limit=1&useCanonical=true";
    fetch(url, function (error, meta, body) {
        try {
            var data = JSON.parse(body.toString());
            if (!data.hasOwnProperty(0)) {
                bot.say(to, "Word doesn't exist");
            } else if (data[0].hasOwnProperty('word')) {
                bot.say(to, data[0].word + ": " + data[0].text);
            } else {
                bot.say(to, "Word doesn't exist");
            }
        } catch (err) {
            bot.say(to, err);
        }
    });
}