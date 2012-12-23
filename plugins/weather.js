var listen = /weather/;


function process(nick, to, cmd, topass) {
    var fetch = require('fetch').fetchUrl;
    var apikey = bot.api.wunderground;
    var url = 'http://api.wunderground.com/api/'+apikey+'/conditions/q/'+topass+'.json';
    fetch(url, function (error, meta, out) {
        try {
            var json = JSON.parse(out);
            console.log(json);
            if (json.response.error) {
                bot.say(to, 'err decoding: ' + json.response.error.description);
            } else {
                bot.say(to, json.current_observation.observation_location.full + ' is: ' + json.current_observation.weather + ' - ' + json.current_observation.temperature_string + ' with ' + json.current_observation.relative_humidity + ' humidity. Winds ' + json.current_observation.wind_string + ' (' + json.current_observation.wind_kph + ' kph gusting to ' + json.current_observation.wind_gust_kph + ' kph). '+ json.current_observation.precip_today_string + ' precip. today');
            }
        } catch (err) {
            bot.say(to, 'err fetching: ' + err);
        }
    });

}