import axios from "axios";
import React from "react";
import { Col, Row } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import { Link, RouteComponentProps } from "react-router-dom";
import AlbumHeader from "../../components/AlbumDisplay/AlbumHeader";
import ContentLoader from "../../components/ContentLoader/ContentLoader";
import Tags from "../../components/TagLinks";
import "../AlbumDetails/AlbumDetails.scss";

interface Props extends RouteComponentProps<MatchParams> {
  isOwner?: boolean;
}
interface MatchParams {
  collection_id: string;
}

interface State {
  uId?: string;
  token: string;
  title: string;
  collectionId: string;
  isOwner: boolean;
  owner: string;
  nickname: string;
  tags: string[];
}

class CollectionDetails extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const collectionId = this.props.match.params.collection_id;
    this.state = {
      token: String(localStorage.getItem("token")),
      title: "",
      collectionId,
      isOwner: !!props.isOwner,
      owner: "",
      nickname: "",
      tags: [],
    };
  }

  componentDidMount() {
    this.getCollection();
  }

  private getCollection() {
    const { collectionId } = this.state;
    const { token } = this.state;

    if (this.state.collectionId !== "") {
      axios
        .get(`/collection/get?token=${token}&collectionId=${collectionId}`)
        .then((res) => {
          if (res.data) {
            document.title = `${res.data.title} | PhotoPro`;
            this.setState({
              title: res.data.title,
              isOwner: res.data.isOwner,
              owner: res.data.owner,
              nickname: res.data.nickname,
              tags: res.data.tags,
            });
          }
        })
        .catch(() => {
          this.props.history.push("/page-not-found");
        });
    }
  }

  render() {
    return (
      <div className="create-collection-page">
        <Container className="mt-5">
          <h1>{this.state.title}</h1>
          <Row>
            <Col>
              <Link to={`/user/${this.state.owner}`}>
                By @{this.state.nickname}
              </Link>
              <div className="album-price-display">
                <p>
                  {this.state.nickname}&apos;s {this.state.title} collection.
                  They&apos;ve bookmarked photos into this collection.
                </p>
              </div>
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
                        <Tags key={tag} tagName={tag} type="collection" />
                      ))
                    ) : (
                      <p>No collection tags found</p>
                    )}
                  </Row>
                </Container>
                <AlbumHeader
                  isOwner={this.state.isOwner}
                  catalogueId={this.state.collectionId}
                  token={this.state.token}
                  type="collection"
                />
              </Container>
            </Col>
          </Row>
          <hr />
          <Row id="the-photos-heading">
            <h1>This Collection&apos;s Photos</h1>
          </Row>
          <hr />
          <ContentLoader
            query={this.state.collectionId}
            route="/collection/photos"
            type="collectionPhotos"
            updatePage={() => {
              window.location.reload();
            }}
          />
        </Container>
      </div>
    );
  }
}

export default CollectionDetails;
