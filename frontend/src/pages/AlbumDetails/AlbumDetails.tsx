import React from "react";
import { RouteComponentProps } from "react-router-dom";
import Container from "react-bootstrap/Container";
import axios from "axios";
import AlbumHeader from "../../components/AlbumDisplay/AlbumHeader";

import Toolbar from "../../components/Toolbar/Toolbar";
import AlbumDisplay from "../../components/AlbumDisplay/AlbumDisplay";

interface Props extends RouteComponentProps<MatchParams> {
  isOwner: boolean;
}
interface MatchParams {
  album_id: string;
}

interface State {
  uId: string;
  token: string;
  title: string;
  discount: number;
  tags: string[];
  albumId: string;
  photos?: string[];
  showEdit?: boolean;
  isOwner: boolean;
  owner: string;
  nickname: string;
}

class AlbumDetails extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const albumId = this.props.match.params.album_id;
    this.state = {
      uId: String(localStorage.getItem("u_id")),
      token: String(localStorage.getItem("token")),
      title: "",
      discount: 0,
      tags: [],
      albumId,
      isOwner: !!props.isOwner,
      owner: "",
      nickname: "",
    };
  }

  componentDidMount() {
    this.getAlbum();
  }

  private getAlbum() {
    const { albumId } = this.state;
    const { token } = this.state;
    if (this.state.albumId != "") {
      axios
        .get(`/album?token=${token}&album_id=${albumId}`)
        .then((res) => {
          if (res.data) {
            this.setState({
              title: res.data.title,
              discount: res.data.discount,
              tags: res.data.tags,
              albumId: res.data.albumId,
              owner: res.data.owner,
              nickname: res.data.nickname,
            });
            if (this.state.uId == res.data.owner) {
              this.setState({ isOwner: true });
            }
          }
        })
        .catch(() => {});
    }
  }

  render() {
    return (
      <div className="createAlbumPage">
        <Container className="mt-5">
          <AlbumHeader
            isOwner={this.state.isOwner}
            catalogueId={this.state.albumId}
            token={this.state.token}
            type="album"
          />
          <h1>{this.state.title}</h1>
          <AlbumDisplay
            albumTitle={this.state.title}
            discount={this.state.discount}
            tags={this.state.tags}
            photos={this.state.photos}
            albumId={this.state.albumId}
            isOwner={this.state.isOwner}
            owner={this.state.owner}
            nickname={this.state.nickname}
          />
        </Container>
      </div>
    );
  }
}

export default AlbumDetails;
