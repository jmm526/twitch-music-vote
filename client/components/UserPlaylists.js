import React, {Component} from 'react'
import SpotifyWebApi from 'spotify-web-api-node'
import axios from 'axios'

export default class UserPlaylists extends Component {
  async componentDidMount() {
    const res = await axios.get('/api/users/playlists')
  }

  render() {
    return (
      <div id="user-playlists-body" >
        <h2>User Playlists</h2>

      </div>
    )
  }
}

