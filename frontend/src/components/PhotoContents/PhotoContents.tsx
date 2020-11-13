import React from "react";
import { RouteComponentProps, withRouter, Link } from "react-router-dom";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import axios from "axios";
import BookmarkButton from "../BookmarkButton";
import LikeButton from "../LikeButton";
import "./PhotoContents.scss";

import PhotoComments from "../PhotoComments/PhotoComments";
import Price from "../Price";
import Tags from "../Tags";
import LoadingButton from "../LoadingButton/LoadingButton";

interface Collection {
  title: string;
  id: string;
  photoExists: boolean;
}

interface Props extends RouteComponentProps {
  photoId: string;
  refreshCredits: () => void;
}


class PhotoContents extends React.Component<Props, any> {
  constructor(props: Props) {
    super(props);
    this.state = {
      artistId: "",
      nickname: "",
      email: "",
      title: "",
      fullPrice: 0,
      discount: 0,
      postedDate: "",
      likes: 0,
      isLiked: false,
      tags: [],
      purchased: false,
      photoB64: "",
      isArtist: false,
      comments: [],
      loading: true,
      msg: "Loading...",
      collections: [],
      token: localStorage.getItem("token") ? localStorage.getItem("token") : "",
      uId: localStorage.getItem("u_id") ? localStorage.getItem("u_id") : "",
      downloadBtnLoading: false,
      purchaseBtnLoading: false,
    };
  }

  componentDidMount() {
    axios
      .get("/photodetailspage", {
        params: {
          token: localStorage.getItem("token"),
          p_id: this.props.photoId,
        },
      })
      .then((res) => {
        const tempComments: string[] = [];
        res.data.comments.map((comment: any) =>
          tempComments.push(JSON.parse(comment))
        );
        this.setState({
          comments: tempComments,
        });
        this.setState({
          artistId: res.data.artist_id,
          nickname: res.data.artist_nickname,
          email: res.data.artist_email,
          title: res.data.title,
          fullPrice: res.data.price,
          discount: res.data.discount,
          postedDate: res.data.posted,
          likes: res.data.n_likes,
          isLiked: res.data.is_liked,
          tags: res.data.tagsList,
          purchased: res.data.purchased,
          photoB64: `${res.data.metadata}${res.data.photoStr}`,
          isArtist: res.data.is_artist,
          loading: false,
        });
      })
      .catch(() => { });
    if (localStorage.getItem("token")) {
      const query = `/collection/getall?token=${this.state.token}&photoId=${this.props.photoId}`
      axios.get(query)
        .then((res) => {
          this.setState({ collections: res.data.map((obj: Collection) => obj) });
        })
        .catch(()=> {});
    }
  }

  purchasePhoto(e: any) {
    this.setState({ purchaseBtnLoading: true });
    e.preventDefault();
    e.stopPropagation();
    axios
      .post("/purchasephoto", {
        token: localStorage.getItem("token"),
        photoId: this.props.photoId,
      })
      .then((res) => {
        this.setState({ purchaseBtnLoading: false });
        this.setState({
          purchased: res.data.purchased,
          photoB64: `${res.data.metadata}${res.data.photoStr}`,
        });
        this.props.refreshCredits();
      })
      .catch(() => {
        this.setState({ purchaseBtnLoading: false });
      });
  }

  downloadPhoto(e: React.MouseEvent) {
    this.setState({ downloadBtnLoading: true });
    e.preventDefault();
    e.stopPropagation();
    axios
      .get("/download", {
        params: {
          token: localStorage.getItem("token"),
          photoId: this.props.photoId,
        },
      })
      .then((r) => {
        this.setState({ downloadBtnLoading: false });
        const link = document.createElement("a");
        link.href = `${r.data.metadata}${r.data.base64_img}`;
        const titleWithoutSpaces = this.state.title.replace(/\s+/g, "");
        link.setAttribute(
          "download",
          `${titleWithoutSpaces}${r.data.extension}`
        );
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch(() => {
        this.setState({ downloadBtnLoading: false });
      });
  }

  // Determine whether to show buttons for:
  // Downloading full/watermarked photo, and managing photo
  returnDynamicButtons() {
    if (this.state.isArtist) {
      return (
        <div>
          <LoadingButton
            loading={this.state.downloadBtnLoading}
            onClick={(e) => this.downloadPhoto(e)}
          >
            Download Full Photo
          </LoadingButton>
          <Button href={`/edit/${this.props.photoId}`} className="ml-1">
            Manage Photo
          </Button>
        </div>
      );
    }
    if (this.state.purchased) {
      return (
        <div>
          <LoadingButton
            loading={this.state.downloadBtnLoading}
            onClick={(e) => this.downloadPhoto(e)}
          >
            Download Full Photo
          </LoadingButton>
        </div>
      );
    }
    return (
      <div>
        <LoadingButton
          loading={this.state.downloadBtnLoading}
          onClick={(e) => this.downloadPhoto(e)}
        >
          Download Watermarked Photo
        </LoadingButton>
        <LoadingButton
          className="ml-1"
          loading={this.state.purchaseBtnLoading}
          onClick={(e) => this.purchasePhoto(e)}
        >
          Purchase Photo
        </LoadingButton>
        <Price
          fullPrice={this.state.fullPrice}
          discount={this.state.discount}
        />
      </div>
    );
  }

  render() {
    return !this.state.loading ? (
      <div className="PhotoContents">
        <Container className="container">
          <Row className="PhotoRow">
            <img className="actualPhoto" src={this.state.photoB64} />
          </Row>
          <Row className="PhotoInteraction">
            <div className="LikeButton">
              <LikeButton
                p_id={this.props.photoId}
                like_count={this.state.likes}
                isLiked={this.state.isLiked}
              />
            </div>
            <div className="BookmarkButton" data-type="toggle" title="Add to Collection">
              <BookmarkButton
                pId={this.props.photoId}
                collections={this.state.collections}
              />
            </div>

          </Row>
          <Row>
            {this.returnDynamicButtons()}
          </Row>
          <div className="ArtistInfo">
            <Row>
              <h2 className="PhotoTitle">
                <b>{this.state.title}</b>
              </h2>
            </Row>
            <Row>
              by{" "}
              <a className="mx-1" href={`/user/${this.state.artistId}`}>
                {this.state.nickname}
              </a>{" "}
              on {this.state.postedDate}
            </Row>
            <Row>{this.state.email}</Row>
          </div>
          <Row className="ContentRow">
            <Col className="Details">
              <Row>Tags (click tag to search)</Row>
              <Row>
                {this.state.tags.map((tag: string) => (
                  <Tags key={tag} tagName={tag} type="photo" />
                ))}
              </Row>
            </Col>
          </Row>
        </Container>
        <PhotoComments
          p_id={this.props.photoId}
          comments={this.state.comments}
        />
      </div>
    ) : (
      <div>
        {" "}
        <p>{this.state.msg}</p>{" "}
      </div>
      );
  }
}

export default withRouter(PhotoContents);
