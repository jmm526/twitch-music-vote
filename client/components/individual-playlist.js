'use strict'

import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import { Card, Image, Button } from 'semantic-ui-react'

import {selectPlaylist} from '../store'

class IndividualPlaylist extends Component {
  constructor(props) {
    super(props)
  }

  handleSelectPlaylist = async (evt) => {
    this.props.selectPlaylist(this.props.playlist)
  }

  render() {
    const {playlist, selectedBool} = this.props
    return (
      <Card
        fluid
        raised
        onClick={this.handleSelectPlaylist}
      >
        <div className={this.props.selectedBool ? 'selected-playlist' : ''}>
        <Card.Content>
          <div className="product-list-img-bound">
            {
              playlist.images.length
                ? <Image
                    src={(playlist.images.length > 1)
                          ? playlist.images[1].url
                          : playlist.images[0].url}
                    size="small"
                  />
                : <div />
            }

          </div>
          <Card.Header
            as={Link}
            to="/home"
            style={{ margin: '1rem 0 .5rem 0' }}
          >
            {playlist.name}
          </Card.Header>
          <Card.Meta>
            <strong>{playlist.tracks.total} Tracks</strong>
          </Card.Meta>
        </Card.Content>
        </div>
      </Card>
    )
  }
}

// const mapState = (state) => {
//   return {
//     orderId: state.order.id,
//     userId: state.user.id
//   }
// }

const mapDispatch = (dispatch) => {
  return {
    selectPlaylist: (playlist) => dispatch(selectPlaylist(playlist))
  }
}

export default connect(null, mapDispatch)(IndividualPlaylist)
