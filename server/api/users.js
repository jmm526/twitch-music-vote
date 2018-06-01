const router = require('express').Router()
const {User} = require('../db/models')
const axios = require('axios')

// var SpotifyWebApi = require('spotify-web-api-node');
// var spotifyApi = new SpotifyWebApi();

module.exports = router

router.get('/', (req, res, next) => {
  User.findAll({
    // explicitly select only the id and email fields - even though
    // users' passwords are encrypted, it won't help if we just
    // send everything to anyone who asks!
    attributes: ['id', 'spotifyEmail']
  })
    .then(users => res.json(users))
    .catch(next)
})

router.get('/me/token', async (req, res, next) => {

  try {
    const {data} = await axios.post(process.env.SPOTIFY_API_URL + '/token', {
      grant_type: 'authorization_code',
      code: req.user.spotifyAuthCode,
      redirect_uri: process.env.SPOTIFY_CALLBACK_URL,
      client_secret: process.env.SPOTIFY_CLIENT_SECRET,
      client_id: process.env.SPOTIFY_CLIENT_ID
    })
    console.log('tokens: ', data)
  } catch (e) {
    console.error('theres an error yo')
  }
  res.send()
})

