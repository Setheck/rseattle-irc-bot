var listen = /admin/i;

function process(nick, to, cmd, topass) {
    cmds = topass.split(' ');
    if (cmds[0].match(/login/)) {
        if (cmds[1] == bot.password) {
            bot.admin = nick;
            bot.say(nick, "Logged in as admin, nig");
        }
    }
    if (cmds[0].match(/eval/)) {
        if (nick == bot.admin) {
            var sandbox = {
                bot: bot,
                to: to,
                nick: nick,
                cmd: cmd,
                topass: topass,
                console: console,
                eventList: eventList,
                fs: fs,
                reload: reload
            };
            try {
                var out = cmds.slice(1);
                var eval = out.join(' ');
                console.log(eval);
                var cmd = '';
                vm.runInNewContext(eval, sandbox);
            } catch (err) {
                bot.say(to, err);
            }
        }
    }
    if (cmds[0].match(/rld/)) {
        eventList = reload.addPlugins(bot, reload);
        bot.say(to, "Reloaded");
    }
}