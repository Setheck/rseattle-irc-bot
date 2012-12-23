var listen = /google/i;


function process(nick, to, cmd, topass) {
    var GoogleSearchAPIKey = bot.api.gSearch;
    var numGoogleResults = 1; // maximum is 8.
    var fetch = require('fetch').fetchUrl;
    var googleurl = "https://ajax.googleapis.com/ajax/services/search/web?v=1.0&rsz=8&q=" + encodeURIComponent(topass) + "&key=" + GoogleSearchAPIKey;
    var output = '';
    var ent = require('ent');
    fetch(googleurl, function (error, meta, body) {
        try {
            data = JSON.parse(body.toString());
            output = 'Google Result: ' + data.responseData.results[0]['title'].replace(/<(?:.|\n)*?>/gm, '') + ' - ' + data.responseData.results[0]['url'];
            bot.say(to, ent.decode(output));
        } catch (err) {
            bot.say(to, 'err: ' + err);
        }
    });
}