import React, {Component} from 'react'
import SpotifyWebApi from 'spotify-web-api-node'
import {connect} from 'react-redux'
import {getPlaylists, refreshSpotifyToken, selectPlaylist} from '../store'
import IndividualPlaylist from './individual-playlist'

class UserPlaylists extends Component {
  constructor(props) {
    super(props)
    this.props.getPlaylists()
    .then(() => {
      return this.props.refreshToken()
    })
    .then(() => {
      return this.props.getPlaylists()
    })
    .then(() => {
      return this.props.selectPlaylist(this.props.playlists[0])
    })
  }

  render() {

    return (
      <div id="user-playlists-body" >
      {
        this.props.isLoggedIn && this.props.playlists && this.props.selectedPlaylist
          ? <div>
              <h2>User Playlists</h2>
              <ul>
                {
                  this.props.playlists.map(playlist => {
                    return (
                      <IndividualPlaylist
                        key={playlist.id}
                        onClick={this.handleSelectPlaylist}
                        playlist={playlist}
                        selectedBool={playlist.id === this.props.selectedPlaylist.id} />
                    )
                  })
                }
              </ul>
            </div>
          : <div />
      }
      </div>
    )
  }
}

const mapState = (state) => {
  return {
    isLoggedIn: !!state.user.spotifyEmail,
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

export default connect(mapState, mapDispatch)(UserPlaylists)

