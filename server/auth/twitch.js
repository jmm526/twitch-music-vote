const passport = require('passport')
const router = require('express').Router()
const axios = require('axios');
const TwitchStrategy = require('passport-twitch-new').Strategy;
const {User} = require('../db/models')
// const xmlhttprequest = require('xmlhttprequest');
// const XMLHttpRequest = xmlhttprequest.XMLHttpRequest;

const corsOptions = {
  origin: `http://localhost:${process.env.PORT}`,
  credentials: true
}

module.exports = router

if (!process.env.TWITCH_CLIENT_ID || !process.env.TWITCH_CLIENT_SECRET) {

  console.log('Twitch client ID / secret not found. Skipping Twitch OAuth.')

} else {
  const twitchConfig = {
    clientID: process.env.TWITCH_CLIENT_ID,
    clientSecret: process.env.TWITCH_CLIENT_SECRET,
    callbackURL: `http://localhost:${process.env.PORT}/auth/twitch/callback/`
  }

  const strategy = new TwitchStrategy(twitchConfig, async (accessToken, refreshToken, profile, done) => {
    // const user = await User.findOne({where: {twitchId: profile.id}})
    // if (!user)
    console.log('profile: ', profile)
    const users = await User.findOrCreate({where: {twitchId: profile.id}, defaults: {
      twitchId: profile.id,
      twitchLogin: profile.login,
      twitchImg: profile.profile_image_url
    }})
    user = users[0]
    console.log('user', user)
    done(null, user)
  })

  passport.use(strategy)

  router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  })

  router.get('/', passport.authenticate('twitch'))

  router.get('/callback', passport.authenticate('twitch', { successRedirect: '/home', failureRedirect: '/login' }),
    async (req, res) => {
      console.log('req.user', req.user)
      // const {code, state} = req.query
      // const user = await User.findById(req.user.id)
      // await user.update({spotifyAuthCode: code, spotifyState: state})
      res.json(req.user)
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
