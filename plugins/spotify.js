var listen = /spotify/;

function process(nick, to, cmd, topass) {
    var spotify = require('spotify');
    data = topass.split(':');
    spotify.lookup({
        type: data[1],
        id: data[2]
    }, function (err, data) {
        try {
            if (!data || err) {
                console.log(err);
            } else {
                switch (data['info']['type']) {
                    case 'track':
                        track = '';
                        length = '';
                        if (data['track']['track-number']) {
                            track = ' Track #' + data['track']['track-number'] + ' with popularity ' + Math.round(data['track']['popularity'] * 100);
                        }

                        if (data['track']['length']) {
                            length = ' (' + reload.secToTime(Math.floor(data['track']['length'])) + ')';
                        }
                        bot.say(to, '(Song) ' + data['track']['name'] + ' - ' + data['track']['artists'][0]['name'] + length + '.' + track + ' on the album ' + data['track']['album']['name'] + '. Released in ' + data['track']['album']['released']);
                        break;
                    case 'album':
                        bot.say(to, '(Album) ' + data['album']['name'] + ' by ' + data['album']['artist'] + ' released in ' + data['album']['released']);
                        console.log(err);
                        break;
                    case 'artist':
                        bot.say(to, '(Artist) ' + data['artist']['name'] + ' with ' + data.artist.albums.length + ' albums. ');
                }
            }
        } catch (err) {
            bot.say(to, 'err: ' + err);
        }
    });
}