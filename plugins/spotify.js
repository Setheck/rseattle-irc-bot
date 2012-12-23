var listen = /spotify/;

function process(nick, to, cmd, topass) {
    var fetch = require('fetch').fetchUrl;
    data = topass.split(':');
    var url = 'http://ws.spotify.com/lookup/1/.json?uri=spotify:' + data[1] + ':' + data[2];
    if (data[1] == 'artist') {
        url += '&extras=album';
    }
    fetch(url, function (err, meta, out) {
        try {
            if (!out || err) {
                console.log(err);
            } else {
                var data = JSON.parse(out);
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