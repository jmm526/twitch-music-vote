import axios from 'axios'
import history from '../history'

/**
 * ACTION TYPES
 */
const GET_USER = 'GET_USER'
const REMOVE_USER = 'REMOVE_USER'
const REFRESH_SPOTIFY_TOKEN = 'REFRESH_SPOTIFY_TOKEN'
const GET_SPOTIFY_PLAYLISTS = 'GET_SPOTIFY_PLAYLISTS'
const SELECT_SPOTIFY_PLAYLIST = 'SELECT_SPOTIFY_PLAYLIST'

/**
 * ACTION CREATORS
 */
const getUser = user => ({type: GET_USER, user})
const removeUser = () => ({type: REMOVE_USER})
const getSpotifyToken = tokens => ({type: REFRESH_SPOTIFY_TOKEN, tokens})
const getSpotifyPlaylists = (playlists) => ({type: GET_SPOTIFY_PLAYLISTS, playlists})
const selectSpotifyPlaylist = (selectedPlaylist, selectedTracks) => ({type: SELECT_SPOTIFY_PLAYLIST, selectedPlaylist, selectedTracks})
/**
 * THUNK CREATORS
 */
export const me = () =>
  dispatch =>
    axios.get('/auth/me')
      .then(res =>
        dispatch(getUser(res.data || defaultUser)))
      .catch(err => console.log(err))

export const auth = (email, password, method) =>
  dispatch =>
    axios.post(`/auth/${method}`, { email, password })
      .then(res => {
        dispatch(getUser(res.data))
        history.push('/home')
      }, authError => { // rare example: a good use case for parallel (non-catch) error handler
        dispatch(getUser({error: authError}))
      })
      .catch(dispatchOrHistoryErr => console.error(dispatchOrHistoryErr))

export const logout = () =>
  dispatch =>
    axios.post('/auth/logout')
      .then(_ => {
        dispatch(removeUser())
        history.push('/login')
      })
      .catch(err => console.log(err))

export const refreshSpotifyToken = (user) => {
  return async (dispatch) => {
    const {data} = await axios.get('/api/users/me/token')
    dispatch(getSpotifyToken(data))
  }
}

export const getPlaylists = () => {
  return async (dispatch) => {
    const {data} = await axios.get('/api/users/me/playlists')
    dispatch(getSpotifyPlaylists(data.items))
  }
}

export const selectPlaylist = (playlist) => {
  return async (dispatch) => {
    console.log('in select playlist')
    const numSongs = playlist.tracks.total
    let offset = 0
    let tracks = []
    while (offset < numSongs) {
      const {data} = await axios.get(`/api/users/me/playlists/${playlist.id}/tracks/${offset}`)
      tracks = tracks.concat(data.items)
      offset = offset + 100
    }
    dispatch(selectSpotifyPlaylist(playlist, tracks))
  }
}

/**
 * INITIAL STATE
 */
const defaultUser = {
  playlists: [],
  selectedPlaylist: {},
  selectedTracks: []
}

/**
 * REDUCER
 */
export default function (state = defaultUser, action) {
  switch (action.type) {
    case GET_USER:
      const mystate = {...state,  createdAt: action.user.createdAt,
                                  id: action.user.id,
                                  spotifyAccessToken: action.user.spotifyAccessToken,
                                  spotifyAuthCode: action.user.spotifyAuthCode,
                                  spotifyEmail: action.user.spotifyEmail,
                                  spotifyHref: action.user.spotifyHref,
                                  spotifyId: action.user.spotifyId,
                                  spotifyImg: action.user.spotifyImg,
                                  spotifyPremium: action.user.spotifyPremium,
                                  spotifyRefreshToken: action.user.spotifyRefreshToken,
                                  spotifyState: action.user.spotifyState,
                                  updatedAt: action.user.updatedAt}
      return mystate
    case REMOVE_USER:
      return defaultUser
    case REFRESH_SPOTIFY_TOKEN:
      return {...state, spotifyAccessToken: action.tokens.action_token,
                        spotifyRefreshToken: action.tokens.refresh_token,
                        spotifyExpiresIn: action.tokens.expires_in}
    case GET_SPOTIFY_PLAYLISTS:
      return {...state, playlists: action.playlists}
    case SELECT_SPOTIFY_PLAYLIST:
      return {...state, selectedPlaylist: action.selectedPlaylist, selectedTracks: action.selectedTracks}
    default:
      return state
  }
}
