const Sequelize = require('sequelize')
const db = require('../db')

const Vote = db.define('vote', {
  songVote: {
    type: Sequelize.INTEGER,
    validate: {
      min: 1,
      max: 4
    }
  }
})

module.exports = Vote
