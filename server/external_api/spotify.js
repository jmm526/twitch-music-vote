const router = require('express').Router()

var SpotifyWebApi = require('spotify-web-api-node');

// credentials are optional
var spotifyApi = new SpotifyWebApi({
  clientId: 'fcecfc72172e4cd267473117a17cbd4d',
  clientSecret: 'a6338157c9bb5ac9c71924cb2940e1a7',
  redirectUri: 'http://www.example.com/callback'
});

module.exports = router

router.post(process.env.SPOTIFY_API_URL + '/token', (req, res, next) => {

})

