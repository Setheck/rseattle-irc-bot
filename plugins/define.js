listen = /define/i;
var apikey = bot.api.wordnik;
function process(nick, to, cmd, topass) {
	var fetch = require('fetch').fetchUrl;
	var url = "http://api.wordnik.com/v4/word.json/"+topass+"/definitions?includeRelated=false&api_key="+apikey+"&includeTags=false&limit=1&useCanonical=true";
	fetch(url, function (error, meta, body){
		var data = JSON.parse(body.toString());
		if (data == "") {
			bot.say(to, "Word doesn't exist");
		}
		else if(data[0].hasOwnProperty('word')) {
			bot.say(to, data[0].word+": "+ data[0].text);
		}
	});
}