import React, {Component} from 'react'
import SpotifyWebApi from 'spotify-web-api-node'
import {connect} from 'react-redux'
import {getPlaylists, refreshSpotifyToken} from '../store'

class UserPlaylists extends Component {
  async componentDidMount() {
    // const res = await axios.get('/api/users/playlists')
    try {
      this.props.getPlaylists()
    } catch (e) {
      try {
        this.props.refreshToken()
        this.props.getPlaylists()
      } catch (e) { console.error(e) }
    }
  }

  render() {
    console.log(this.props)
    return (
      <div id="user-playlists-body" >
        <h2>User Playlists</h2>
        <ul>
          {
            this.props.playlists.map(playlist => {
              return <li key={playlist.id}>{playlist.name}</li>
            })
          }
        </ul>
      </div>
    )
  }
}

const mapState = (state) => {
  return {
    playlists: state.user.playlists
  }
}

const mapDispatch = (dispatch) => {
  return {
    getPlaylists: () => dispatch(getPlaylists()),
    refreshToken: () => dispatch(refreshSpotifyToken())
  }
}

export default connect(mapState, mapDispatch)(UserPlaylists)

