const {User} = require('../db/models')
const axios = require('axios')
const refresh = require('spotify-refresh')

module.exports = spotifyCheckAccessToken = (req, res, next) => {
  if (!req.user.spotifyLastRefresh || Date.now() - req.user.spotifyLastRefresh > 2400000) {
    console.log('REFRESHING ACCESS TOKEN')
    spotifyRefreshAccessToken(req, res, next)
  }
  next()
}

spotifyRefreshAccessToken = (req, res, next) => {

  let spotifyAccessToken
  let user
  refresh(req.user.spotifyRefreshToken, process.env.SPOTIFY_CLIENT_ID, process.env.SPOTIFY_CLIENT_SECRET, async (err, res, body) => {
    if (err) return
    spotifyAccessToken = body.access_token
    // console.log('new access token: ', JSON.stringify(body))

    user = await User.findById(req.user.id)
    // console.log('user: ', user)
    await user.update({spotifyAccessToken, spotifyLastRefresh: Date.now()})

    req.user = user
  })

  res.json(user)

}

module.exports = {spotifyCheckAccessToken, spotifyRefreshAccessToken}
