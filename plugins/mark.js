var listen = /(book)?mark/i;
var sqlite = require('sqlite3');
var db = new sqlite.Database('mark.db');
populateDatabase();
function process(nick, to, cmd, topass) {
	data = topass.split(' ');
	if (data.length < 2) {
		bot.say(to, 'I need ~bookmark [phrase] [bookmark]->');
	} else {
		var phrase = data.shift();
		data = data.join(' ');
		if (!isFunction(phrase)) {
			bot.bookmark[phrase] = data;
			addToDatabase(data, phrase);
			bot.say(to, "Bookmark added!");
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
		var rem = db.prepare("DELETE FROM bookmark WHERE key = ?");
		rem.run(key);
		rem.finalize();
		var stmt = db.prepare("INSERT INTO bookmark VALUES (?, ?);");
		stmt.run(key, phrase);
		stmt.finalize();
	});
}

function populateDatabase() {
	db.serialize(function() {
		db.run('CREATE TABLE if not exists bookmark (key TEXT, value TEXT);');
		db.each("SELECT * FROM bookmark;", function(err, row) {
			bot.bookmark[row.key] = row.value;
		});
	});
}