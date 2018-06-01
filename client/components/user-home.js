import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import UserPlaylists from './UserPlaylists'
import {refreshSpotifyToken} from '../store'

/**
 * COMPONENT
 */

class UserHome extends Component {

  componentDidMount() {
    this.props.getToken()
  }

  render() {
    const {user} = this.props
    return (
      <div>
        <h3>Welcome, {user.spotifyEmail}</h3>
        <UserPlaylists />
      </div>
    )
  }
}

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    user: state.user
  }
}

const mapDispatch = (dispatch) => {
  return {
    getToken: () => dispatch(refreshSpotifyToken())
  }
}

export default connect(mapState, mapDispatch)(UserHome)

/**
 * PROP TYPES
 */
UserHome.propTypes = {
  user: PropTypes.object
}
