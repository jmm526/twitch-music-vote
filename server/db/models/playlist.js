const Sequelize = require('sequelize')
const db = require('../db')

const Playlist = db.define('playlist', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  spotifyId: {
    type: Sequelize.STRING,
  },
})

module.exports = Playlist
