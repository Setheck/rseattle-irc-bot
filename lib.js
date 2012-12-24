var vm = require('vm');
var fs = require('fs');
module.exports = {
	addPlugins: function (bot, me) {
		eventList = [];
		var plugins = fs.readdirSync('plugins');
		for (i = 0; i < plugins.length; i++) {
			var sandbox = {
				bot: bot,
				vm: vm,
				console: console,
				eventList: eventList,
				fs: fs,
				reload: me,
				require: require
			};
			try {
				vm.runInNewContext(fs.readFileSync('plugins/' + plugins[i]), sandbox);
				eventList.push(Array(sandbox.listen, sandbox.process));
				bot.commandList.push(sandbox.listen);
				console.log('Added Script %s', plugins[i]);
			} catch (err) {
				console.log("error in script: %s", err);
			}
		}
		return eventList;
	},
	secToTime: function (sec) {
		var hr = Math.floor(sec / 3600);
		var min = Math.floor((sec - (hr * 3600))/60);
		sec -= ((hr * 3600) + (min * 60));
		sec += ''; min += '';
		while (min.length < 2) {min = '0' + min;}
		while (sec.length < 2) {sec = '0' + sec;}
		hr = (hr)?hr+':':'';
		return hr + min + ':' + sec;
	},

	floodControl: function(bot, to, cmdString) {
		bot.cmd[to]++;
        var timer = setTimeout(function () {
            bot.cmd[to]--;
            console.log('Flood: ' + bot.cmd[to] + ' ' + JSON.stringify(this));
        }, 1500 + bot.cmd[to] * 1000);
        timer.cmd = cmdString;

        return (bot.cmd[to] <= 5);
	}
};