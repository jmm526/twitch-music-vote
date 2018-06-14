import React, {Component} from 'react'
import SpotifyWebApi from 'spotify-web-api-node'
import {connect} from 'react-redux'
import {getPlaylists, refreshSpotifyToken, selectPlaylist} from '../store'
import IndividualPlaylist from './individual-playlist'

class UserPlaylists extends Component {
  async componentDidMount() {
    // const res = await axios.get('/api/users/playlists')
    try {
      await this.props.getPlaylists()
    } catch (e) {
      try {
        await this.props.refreshToken()
        await this.props.getPlaylists()
      } catch (e) { console.error(e) }
    }
    await this.props.selectPlaylist(this.props.playlists[0])
  }


  render() {
    console.log(this.props)
    return (
      <div id="user-playlists-body" >
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
    )
  }
}

const mapState = (state) => {
  return {
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

