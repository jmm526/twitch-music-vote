import React, {Component} from 'react'
import {Redirect} from 'react-router'
import axios from 'axios'

class LoginSpotify extends Component {

  constructor() {
    super()
    this.state = {}
  }

  async componentDidMount() {
    console.log('component did mount')
    const res = await axios.get('/auth/spotify')
    console.log('res', res)
  }

  async componentDidUpdate() {
    console.log('component will update')
    const {data} = await axios.get('/auth/spotify')
  }

  render() {
    return (
      <p>Hi</p>
    )
  }

}

export default LoginSpotify
