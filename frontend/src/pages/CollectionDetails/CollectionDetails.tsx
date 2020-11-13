import React from "react";
import { RouteComponentProps } from "react-router-dom";
import axios from "axios";
import Container from "react-bootstrap/Container";
import AlbumHeader from "../../components/AlbumDisplay/AlbumHeader";
import ContentLoader from '../../components/ContentLoader/ContentLoader';

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
  price: number;
  originalPrice: number;
}

class CollectionDetails extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const collectionId = this.props.match.params.collection_id;
    this.state = {
      token: String(localStorage.getItem("token")),
      title: "",
      price: 0,
      originalPrice: 0,
      collectionId,
      isOwner: !!props.isOwner,
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
              price: res.data.price,
              originalPrice: res.data.originalPrice,
              isOwner: res.data.isOwner,
            });
          }
        })
        .catch(() => {});
    }
  }

  render() {
    return (
      <div className="create-collection-page">
        <Container className="mt-5">
          <h1>{this.state.title}</h1>
          <Row>
            <Col>
              <Link
                to={`/user/${this.props.owner}`}
              >
                By @​​​​​​​{this.props.nickname}
              </Link>
            </Col>
            <Col xs={7}>
              <Container>
                <p><b>Tags</b></p>
                <Container>
                  <Row>
                    { this.state.tags.map((tag) => (
                      <Tags key={tag} tagName={tag} type="album" />
                      ))
                    }
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
          <div>
            <AlbumHeader
              isOwner={this.state.isOwner}
              catalogueId={this.state.collectionId}
              token={this.state.token}
              type="collection"
            />
            
            <h2>Price: {this.state.price}</h2>
            <h3>Regular Price: {this.state.originalPrice}</h3>
          </div>
          <ContentLoader
            query={this.state.collectionId}
            route='/collection/photos'
            type="collectionPhotos"
            updatePage={() => {window.location.reload()}}
          />
        </Container>
      </div>
    );
  }
}

export default CollectionDetails;
