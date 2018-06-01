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

router.get('/me/token', async (req, res, next) => {

  let spotifyAccessToken
  refresh(req.user.spotifyRefreshToken, process.env.SPOTIFY_CLIENT_ID, process.env.SPOTIFY_CLIENT_SECRET, (err, res, body) => {
    if (err) return
    spotifyAccessToken = body.access_token
    // console.log(JSON.stringify(body))
  })

  const user = await User.findById(req.user.id)
  await user.update({spotifyAccessToken})

  res.send()

  // try {
  //   const {data} = await axios.post(process.env.SPOTIFY_API_URL + '/token', {
  //     grant_type: 'refresh_token',
  //     refresh_token: req.user.spotifyRefreshToken
  //   }, {
  //     headers: { Authorization: 'Bearer ' + process.env.SPOTIFY_USER_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET}
  //   })
  //   console.log('refresh token>>>>>>>>>>>>>>>>>>>>: ', data)
  // } catch (e) {
  //   console.error(e)
  // }
  // res.send()
})

