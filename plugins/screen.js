var listen = /screen(shot)?/i;
var validator = require('validator');
var webshot = require('webshot');
var imgur = require('imgur');
var sqlite = require('sqlite3');
var db = new sqlite.Database('mark.db');
var imgurAPI = bot.api.imgur;
imgur.setKey(imgurAPI);
function process(nick, to, cmd, topass) {
	if (validator.check(topass).isUrl()) {
		bot.say(to, 'Generating image for URL: ' + topass);
		var options = {
			phantomPath : '/home/nick/node_modules/phantomjs/lib/phantom/bin/phantomjs'
		}
		var fileName = 'image-' + Math.random().toString(36).substring(7);
		webshot(topass, 'images/'+fileName+'.png', options, function(err) {
			if (err) {
				bot.say(to, 'Error Creating Screenshot: ' + err);
				return;
			}
			imgur.upload('images/'+fileName+'.png', function(response){
				if (response.error) {
					bot.say(to, 'Error Uploading: ' + response.error);
				} else {
					bot.say(to, 'Your Screenshot: ' + response.links.original);
					addToDatabase(topass, fileName, response.links.original);
				}
			});
		});
	} else {
		bot.say(to, 'Invalid URL');
	}
}

function addToDatabase(url, filename, imgur) {
	db.serialize(function() {
		db.run('CREATE TABLE if not exists links (url TEXT, filename TEXT, imgur TEXT);');
		var stmt = db.prepare("INSERT INTO links VALUES (?, ?, ?);");
		stmt.run(url, filename, imgur);
		stmt.finalize();
	});
}