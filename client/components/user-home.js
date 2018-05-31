import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import UserPlaylists from './UserPlaylists'

/**
 * COMPONENT
 */
export const UserHome = (props) => {
  const {user} = props

  return (
    <div>
      <h3>Welcome, {user.spotifyEmail}</h3>
      <UserPlaylists />
    </div>
  )
}

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    user: state.user
  }
}

export default connect(mapState)(UserHome)

/**
 * PROP TYPES
 */
UserHome.propTypes = {
  user: PropTypes.object
}
