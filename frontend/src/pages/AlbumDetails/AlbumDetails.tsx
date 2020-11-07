import React from "react";
import { RouteComponentProps } from "react-router-dom";
import Container from "react-bootstrap/Container";
import axios from "axios";

import Toolbar from "../../components/Toolbar/Toolbar";

import AlbumDisplay from '../../components/Album/AlbumDisplay';


interface Props extends RouteComponentProps<MatchParams> {}
interface MatchParams {
  album_id: string,
}

interface State {
  uId: string,
  token: string,
  title: string,
  discount: number,
  tags: string[],
  albumId: string,
  photos?: string[]
}

class AlbumDetails extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const albumId = this.props.match.params.album_id
    this.state = {
      uId: String(localStorage.getItem('u_id')),
      token: String(localStorage.getItem('token')),
      title: '',
      discount: 0,
      tags: [],
      albumId: albumId
    }
  }

  componentDidMount() {
    this.getAlbum()
  }

  getAlbum(){
    if (this.state.albumId != '') {
      axios
      .get('/album', {
        params: {
          token: this.state.token,
          albumId: this.state.albumId,
        }
      })
      .then((res) => {
        if (res.data) {
          this.setState ({
            'title': res.data.title,
            'discount': res.data.discount,
            'tags': res.data.tags,
            'albumId': res.data.albumId
          });
        }
      })
      .catch(() =>{});
    }
  }

  render() {
    return (
      <div className="createAlbumPage">
        <Toolbar />
        <Container className="mt-5">
          <h1>Album</h1>
          <AlbumDisplay
            albumTitle={this.state.title}
            discount={this.state.discount}
            tags={this.state.tags}
            photos={this.state.photos}
            albumId={this.state.albumId}
          />
        </Container>
      </div>
  )}
};

export default AlbumDetails;
