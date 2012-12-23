var listen = /forecast/;


function process(nick, to, cmd, topass) {
    var fetch = require('fetch').fetchUrl;
    var apikey = bot.api.wunderground;
    var url = 'http://api.wunderground.com/api/'+apikey+'/forecast/q/'+topass+'.json';
   fetch(url, function (error, meta, out) {
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
    });
}