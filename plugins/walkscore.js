var listen = /walkscore/i;

function process(nick, to, cmd, topass) {
    var fetch = require('fetch').fetchUrl;
    var url = 'http://maps.googleapis.com/maps/api/geocode/json?address=' + encodeURIComponent(topass) + '&sensor=false';
    fetch(url, function (error, meta, body) {
        try {
            data = JSON.parse(body.toString());
            var walkurl = 'http://api.walkscore.com/score?format=json&address=' + data.results[0].formatted_address + '&lat= ' + data.results[0].geometry.location.lat + '&lon=' + data.results[0].geometry.location.lng + '&wsapikey=0c1df580a54e0b25dd7b1f910c142363';
            fetch(walkurl, function (error, meta, body) {
                try {
                    walk = JSON.parse(body.toString());
                    bot.say(to, data.results[0].formatted_address + ' is a ' + walk.description + ' with a walkscore of ' + walk.walkscore);
                } catch (err) {
                    console.log(err);
                }
            });
        } catch (err) {
            bot.say(to, 'err: ' + err);
        }
    });
}