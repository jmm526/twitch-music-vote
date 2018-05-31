const passport = require('passport')
const router = require('express').Router()
const axios = require('axios');
const SpotifyStrategy = require('passport-spotify').Strategy;
const {User} = require('../db/models')
// const xmlhttprequest = require('xmlhttprequest');
// const XMLHttpRequest = xmlhttprequest.XMLHttpRequest;

const corsOptions = {
  origin: `http://localhost:${process.env.PORT}`,
  credentials: true
}

module.exports = router

if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {

  console.log('Spotify client ID / secret not found. Skipping Spotify OAuth.')

} else {
  const spotifyConfig = {
    clientID: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    callbackURL: `http://localhost:${process.env.PORT}/auth/spotify/callback/`
  }

  const strategy = new SpotifyStrategy(spotifyConfig, async (token, refreshToken, profile, done) => {
    // console.log(profile)
    const users = await User.findOrCreate({where: {spotifyId: profile.id}, defaults: {
      spotifyEmail: profile._json.email,
      spotifyHref: profile.href,
      spotifyId: profile.id,
      spotifyImg: profile.photos[0],
      spotifyPremium: (profile.product === 'premium'),
    }})
    const user = users[0]
    done(null, user)
  })

  passport.use(strategy)

  router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  })

  router.get('/', passport.authenticate('spotify', {scope: ['user-read-private', 'user-read-email'], showDialog: true}))

  router.get('/callback', passport.authenticate('spotify', {
      failureRedirect: '/login'
    }),
    (req, res, next) => {
      res.redirect('/home')
    })

}


// function createCORSRequest(method, url) {
//   var xhr = new XMLHttpRequest();
//   if ('withCredentials' in xhr) {

//     // Check if the XMLHttpRequest object has a "withCredentials" property.
//     // "withCredentials" only exists on XMLHTTPRequest2 objects.
//     xhr.open(method, url, true);

//   } else if (typeof XDomainRequest != 'undefined') {

//     // Otherwise, check if XDomainRequest.
//     // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
//     xhr = new XDomainRequest();
//     xhr.open(method, url);

//   } else {

//     // Otherwise, CORS is not supported by the browser.
//     xhr = null;

//   }
//   return xhr;
// }
