import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import UserPlaylists from './UserPlaylists'
import {refreshSpotifyToken, getPlaylists, selectPlaylist} from '../store'

/**
 * COMPONENT
 */

class UserHome extends Component {

  componentDidMount() {
    this.props.refreshToken()
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
    user: state.user,
    playlists: state.user.playlists,
    selectedPlaylist: state.user.selectedPlaylist,
  }
}

const mapDispatch = (dispatch) => {
  return {
    getPlaylists: () => dispatch(getPlaylists()),
    refreshToken: () => dispatch(refreshSpotifyToken()),
    selectPlaylist: (playlist) => dispatch(selectPlaylist(playlist)),
  }
}

export default connect(mapState, mapDispatch)(UserHome)

/**
 * PROP TYPES
 */
UserHome.propTypes = {
  user: PropTypes.object
}
