var listen = /(book)?mark/i;
var sqlite = require('sqlite3');
var db = new sqlite.Database('mark.db');
populateDatabase();
function process(nick, to, cmd, topass) {
	data = topass.split(' ');
	if (data.length < 2 || data[0].length < 2) {
		var addlString;
		if (bot.config.bookPort != '0') {
			addlString = 'Bookmarks can be found at http://' + bot.config.bookAddr + ':' + bot.config.bookPort;
		}
		bot.say(to, 'I need ~bookmark [phrase] [bookmark]-> OR ~bookmark remove [phrase] '+addlString);
	} else {
		var key = data.shift().toLowerCase();
		data = data.join(' ');
		if (key.match(/remove/i)) {
			if (bot.bookmark.hasOwnProperty(data)) {
				delete bot.bookmark[data];
				bot.say(to, 'Bookmark ' + data + ' deleted');
				removeBookmark(data);
			}
		}
		else if (!isFunction(key)) {
			if (bot.bookmark.hasOwnProperty(key)) {
				bot.say(to, 'Bookmark ' + key + ' already exists');
			} else {
				bot.bookmark[key] = data;
				addToDatabase(data, key);
				bot.say(to, "Bookmark added!");
			}
		}
	}
}
function isFunction(phrase) {
	for (var i = 0; i < bot.commandList.length; i++) {
		if (phrase.match(bot.commandList[i])) {
			return true;
		}
	}
	return false;
}
function addToDatabase(phrase, key) {
	db.serialize(function() {
		var rem = db.prepare("DELETE FROM bookmark WHERE key = ?;");
		rem.run(key);
		rem.finalize();
		var stmt = db.prepare("INSERT INTO bookmark VALUES (?, ?);");
		stmt.run(key, phrase);
		stmt.finalize();
	});
}
function removeBookmark(data) {
	db.serialize(function() {
		var rem = db.prepare("DELETE FROM bookmark WHERE key = ?;");
		rem.run(data);
		rem.finalize();
	});
}
function populateDatabase() {
	db.serialize(function() {
		db.run('CREATE TABLE if not exists bookmark (key TEXT, value TEXT);');
		db.each("SELECT * FROM bookmark;", function(err, row) {
			bot.bookmark[row.key.toLowerCase()] = row.value;
		});
	});
}
function writeResponse(req, res) {
	res.writeHead(200, {'Content-Type': 'text/plain'});
	Object.keys(bot.bookmark).forEach(function(element, key) {
		res.write(element+ ' : ' + bot.bookmark[element] + '\n');
	});
	res.end();
}
if (bot.config.bookPort != '0') {
	if (bot.hasOwnProperty('bookServer')){
		bot.bookServer.close();
	}
	var http = require('http');
	bot.bookServer = http.createServer(writeResponse).listen(bot.config.bookPort, bot.config.bookAddr);
	console.log('Bookmark list running at http://'+ bot.config.bookAddr+':'+bot.config.bookPort);
}
