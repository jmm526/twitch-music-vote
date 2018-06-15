const router = require('express').Router()
const {User} = require('../db/models')
const axios = require('axios')
const refresh = require('spotify-refresh')
const {spotifyCheckAccessToken, spotifyRefreshAccessToken} = require('./AccessToken')

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

router.get('/me/token', spotifyRefreshAccessToken)

router.get('/me/playlists', spotifyCheckAccessToken, async (req, res, next) => {
  try {
    // console.log('req.user', req.user)
    const {data} = await axios.get(process.env.SPOTIFY_API_URL + '/v1/me/playlists', {
      headers: { Authorization: 'Bearer ' + req.user.spotifyAccessToken}
    })
    res.json(data)
  } catch (e) {
    console.log('Error when getting playlists')
    res.send(e)
  }
})

router.get('/me/playlists/:playlistId/tracks/:offset', spotifyCheckAccessToken, async (req, res, next) => {
  // console.log('req.user', req.user)
  const {data} = await axios.get(process.env.SPOTIFY_API_URL + `/v1/users/${req.user.spotifyId}/playlists/${req.params.playlistId}/tracks?offset=${req.params.offset}`, {
    headers: { Authorization: 'Bearer ' + req.user.spotifyAccessToken}
  })
  res.json(data)
})

router.put('/me/playtrack/:trackURI', async (req, res, next) => {
  try {
    const {data} = await axios.put(process.env.SPOTIFY_API_URL + '/v1/me/player/play',
    {uris: [req.params.trackURI]},
    {headers: { Authorization: 'Bearer ' + req.user.spotifyAccessToken}})
    res.json(data)
  } catch (e) {
    console.log(e)
    res.send(e)
  }
})

router.get('/me/devices', async (req, res, next) => {
  const {data} = await axios.put(process.env.SPOTIFY_API_URL + '/v1/me/player/play',
  {uris: [req.params.trackURI]},
  {headers: { Authorization: 'Bearer ' + req.user.spotifyAccessToken}})
  res.json(data)
})

