const Sequelize = require('sequelize')
const db = require('../db')

const VoteCycle = db.define('voteCycle', {
  songId1: {
    type: Sequelize.STRING
  },
  songId2: {
    type: Sequelize.STRING
  },
  songId3: {
    type: Sequelize.STRING
  },
  songId4: {
    type: Sequelize.STRING
  },
  currentSongLength: {
    type: Sequelize.INTEGER
  },
  active: {
    type: Sequelize.BOOLEAN
  }
})

module.exports = VoteCycle
