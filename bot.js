var irc = require('irc');
var config = require('./config.json');
var bot = new irc.Client(config.server, config.name, config.data);
// Specify some variables we'll be using later
bot.cmd = []; // This is used for flood protection
bot.bookmark = {};
bot.commandList = [];
bot.api = config.apiKey;
bot.admin = ''; // initialize the admin variable
// Lets load all of our plugins
ircLib = require('./lib.js'); // this allows us to load/reload our plugins
eventList = ircLib.addPlugins(bot, ircLib); // load plugins for the first time

// In case anything goes wrong
bot.addListener('error', function (message) {
    console.error('ERROR: %s: %s:', message.command, message.args.join(' '));
});

//Gets channel messages, figures out what to do with them
bot.addListener('message#', function (nick, to, text, message) {
    console.log('%s: <%s> %s', to, nick, text);
    var bookText = text.split(' ').shift().substr(1);
    if (text.match(/^[&~]/) && ircLib.floodControl(bot, to, text)) { //normal, prefixed, commands
        bot.emit('botcommand', nick, to, text.substr(1));
    }
    //YouTube - if YT plugin is not loaded it will not reply
    if (id = text.match(/(?:https?:\/\/)?(?:www\.)?youtu(?:\.be|be\.com)\/(?:watch\?v=)?((\w|-){11,})/)) {
        if (ircLib.floodControl(bot, to, text)) {
            bot.emit('botcommand', nick, to, 'youtube ' + id[1]);
        }
    }
    //Spotify
    if (id = text.match(/(spotify:(?:(?:artist|album|track|user:[^:]+:playlist):[a-zA-Z0-9]+|user:[^:]+|search:(?:[-\w$\.+!*'(),]+|%[a-fA-F0-9]{2})+))/)) {
        if (ircLib.floodControl(bot, to, text)) {
            bot.emit('botcommand', nick, to, 'spotify ' + id[1]);
        }
    }
    if (id = text.match(/http:\/\/open.spotify.com\/(track|album|artist)\/([\w]+)/)) {
        if (ircLib.floodControl(bot, to, text)) {
            bot.emit('botcommand', nick, to, 'spotify ' + 'spotify:' + id[1] + ':' + id[2]);
        }
    }
    if (bot.bookmark.hasOwnProperty(bookText)) {
        if (ircLib.floodControl(bot, to, text)) {
            bot.say(to, '[B]: ' + bot.bookmark[bookText]);
        }
    }
});
//Initialize variable for flood protection
bot.addListener('names', function (channel, nicks) {
    bot.cmd[channel] = 0;
});

//This listener is called when the message listener determines there's a possibility
//that a command has been issues
bot.addListener('botcommand', function (nick, to, text) {
    raw = text.split(' ');
    cmd = raw[0];
    raw.shift();
    topass = raw.join(' ');
    console.log('CMD: %s: %s', cmd, topass);
    for (i = 0; i < eventList.length; i++) {
        if (cmd.match(eventList[i][0])) {
            try {
                eventList[i][1](nick, to, cmd, topass);
            } catch (err) {
                bot.say(to, err);
            }
        }
    }

});