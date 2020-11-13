import React from "react";
import { RouteComponentProps, Link } from "react-router-dom";
import axios from "axios";
import Container from "react-bootstrap/Container";
import AlbumHeader from "../../components/AlbumDisplay/AlbumHeader";
import ContentLoader from "../../components/ContentLoader/ContentLoader";
import "../AlbumDetails/AlbumDetails.scss";
import { Row, Col } from "react-bootstrap";
import { stringify } from "qs";
import Tags from "../../components/TagLinks";

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
            this.setState({
              title: res.data.title,
              isOwner: res.data.isOwner,
              owner: res.data.owner,
              nickname: res.data.nickname,
              tags: res.data.tags,
            });
          }
        })
        .catch((err) => {
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
                By @​​​​​​​{this.state.nickname}
              </Link>
              <div className="album-price-display">
                <p>
                  {this.state.nickname}'s {this.state.title} collection. They've
                  bookmarked photos into this collection.
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
