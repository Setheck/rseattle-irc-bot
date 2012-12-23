var listen = /forecast/;


function process(nick, to, cmd, topass) {
    var weather = require('./WunderNodeClient.js');
    var apikey = 'd3985ecec9c19265';
    var debug = false;
    var wunder = new weather(apikey, debug);
    wunder.forecast(function (err, out) {
        try {
            var json = JSON.parse(out);
            if (json.response.error) {
                bot.say(to, json.response.error.description);
            } else {
                var dates = json.forecast.simpleforecast.forecastday;
                var output = [];
                for (var i = 1; i < dates.length; i++) {
                    var util = require('util');
                    var out = [];
                    out.push(util.format('[%s]', dates[i].date.weekday_short));
                    out.push(util.format('High: %s F (%s C) - Low: %s F (%s C).', dates[i].high.fahrenheit, dates[i].high.celsius, dates[i].low.fahrenheit, dates[i].low.celsius));
                    out.push(util.format('Conditions: %s (%s% precip) with %s mph winds ', dates[i].conditions, dates[i].pop, dates[i].avewind.mph));
                    output.push(out.join(' '));
                }
                bot.say(to, output.join('| '));
            }
        } catch (err) {
            bot.say(to, 'err: ' + err);
        }
    }, topass);
}