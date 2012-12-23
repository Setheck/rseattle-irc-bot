var listen = /rand(om)?/;
function process(nick, to, cmd, topass) {
	if (topass == '' || +topass != topass) {
		topass = 10;
	}
    bot.say(to, 'Random number between 1 and ' + topass + ': ' + Math.floor(Math.random() * topass + 1));
}