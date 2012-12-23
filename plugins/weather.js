var listen = /weather/;


function process(nick, to, cmd, topass) {
    var weather = require('./WunderNodeClient.js');
    var apikey = 'd3985ecec9c19265';
    var debug = false;
    var wunder = new weather(apikey, debug);
    wunder.conditions(function (err, out) {
        try {
            var json = JSON.parse(out);
            console.log(json);
            if (json.response.error) {
                bot.say(to, json.response.error.description);
            } else {
                bot.say(to, json.current_observation.observation_location.full + ' is: ' + json.current_observation.weather + ' - ' + json.current_observation.temperature_string + ' with ' + json.current_observation.relative_humidity + ' humidity. Winds ' + json.current_observation.wind_string + ' (' + json.current_observation.wind_kph + ' kph gusting to ' + json.current_observation.wind_gust_kph + ' kph). '+ json.current_observation.precip_today_string + ' precip. today');
            }
        } catch (err) {
            bot.say(to, 'err: ' + err);
        }
    }, topass);
}