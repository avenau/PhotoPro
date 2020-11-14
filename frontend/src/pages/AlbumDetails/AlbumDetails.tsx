import axios from "axios";
import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { RouteComponentProps } from "react-router-dom";
import AlbumDisplay from "../../components/AlbumDisplay/AlbumDisplay";
import AlbumHeader from "../../components/AlbumDisplay/AlbumHeader";
import ContentLoader from "../../components/ContentLoader/ContentLoader";
import Tags from "../../components/TagLinks";

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
    if (this.state.albumId !== "") {
      axios
        .get(`/album?token=${token}&album_id=${albumId}`)
        .then((res) => {
          if (res.data) {
            document.title = `${res.data.title} | PhotoPro`;
            this.setState({
              title: res.data.title,
              discount: res.data.discount,
              tags: res.data.tags,
              albumId: res.data.albumId,
              owner: res.data.owner,
              nickname: res.data.nickname,
            });
            if (this.state.uId === res.data.owner) {
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
          <h1>{this.state.title}</h1>
          <Row>
            <Col>
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
            </Col>
            <Col xs={7}>
              <Container>
                <p>
                  <b>Tags</b>
                </p>
                <Container>
                  <Row>
                    {this.state.tags.length > 0 ? (
                      this.state.tags.map((tag) => (
                        <Tags key={tag} tagName={tag} type="album" />
                      ))
                    ) : (
                      <p>No album tags found</p>
                    )}
                  </Row>
                </Container>

                <AlbumHeader
                  isOwner={this.state.isOwner}
                  catalogueId={this.state.albumId}
                  token={this.state.token}
                  type="album"
                />
              </Container>
            </Col>
          </Row>
          <hr />
          <Row id="the-photos-heading">
            <h1>This Album&quot;s Photos</h1>
          </Row>
          <hr />
          <ContentLoader
            query={this.state.albumId}
            route="/album/photos"
            type="albumPhotos"
            updatePage={() => {
              window.location.reload();
            }}
          />
        </Container>
      </div>
    );
  }
}

export default AlbumDetails;
