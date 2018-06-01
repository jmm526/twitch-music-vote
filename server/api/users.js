const router = require('express').Router()
const {User} = require('../db/models')
const axios = require('axios')
const refresh = require('spotify-refresh')

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

router.get('/me/token', (req, res, next) => {

  let spotifyAccessToken
  refresh(req.user.spotifyRefreshToken, process.env.SPOTIFY_CLIENT_ID, process.env.SPOTIFY_CLIENT_SECRET, async (err, res, body) => {
    if (err) return
    spotifyAccessToken = body.access_token
    // console.log('new access token: ', JSON.stringify(body))

    const user = await User.findById(req.user.id)
    await user.update({spotifyAccessToken})

    req.user = user

    console.log('user right after update', req.user)
  })


  res.send()

})

router.get('/me/playlists', async (req, res, next) => {
  try {
    console.log('req.user', req.user)
    const accessToken = req.user.spotifyAccessToken
    const {data} = await axios.get(process.env.SPOTIFY_API_URL + '/v1/me/playlists', {
      headers: { Authorization: 'Bearer ' + req.user.spotifyAccessToken}
    })
    res.send(data)
  } catch (e) {
    console.log('Error when getting playlists')
    res.send(e)
  }
})

