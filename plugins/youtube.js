var listen = /youtube/;

//todo: remove dependency on youtube-feeds
function process(nick, to, cmd, topass) {
	var youtube = require('youtube-feeds');
	youtube.video( topass, function (data, err) {
		if (err instanceof Error) {
			bot.say(to, err);
		} else {
			try {
				var views = data.viewCount.toString();
				bot.say(to, data.title + ' | Duration: ' + reload.secToTime(data.duration) + ' | Views: ' + views.replace(/\B(?=(\d{3})+(?!\d))/g, ","));
			} catch (err) {
				bot.say(to, err);
			}
		}

	});
}
