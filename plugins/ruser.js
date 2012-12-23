var listen = /ruser/i;

function process(nick, to, cmd, topass) {
    var moment = require('moment');
    var fetch = require('fetch').fetchUrl;
    var url = 'http://www.reddit.com/user/' + topass + '/about.json';
    fetch(url, function (error, meta, body) {
        try {
            data = JSON.parse(body.toString());
            var create = moment.unix(data.data.created);
            var now = moment();
            var dur = now.from(create, true);
            bot.say(to, 'User: ' + data.data.name + ' created ' + dur + ' ago. ' + data.data.link_karma + ' link karma and ' + data.data.comment_karma + ' comment karma!');
        } catch (err) {
            bot.say(to, 'Error: ' + err + '. This probably means they don\'t exist');
        }
    });
}