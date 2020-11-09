import React, { useEffect, useState } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import BookmarkButton from "../BookmarkButton";
import LikeButton from "../LikeButton";
import "./PhotoContents.scss";
import axios from "axios";
import { Link } from "react-router-dom";
import PhotoComments from "../PhotoComments/PhotoComments";
import Price from "../Price";
import Tags from "../Tags";

interface Props extends RouteComponentProps {
  photoId: string;
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
      deleted: false,
      isArtist: false,
      comments: [],
      loading: true,
      msg: "Loading...",
    };
  }
  // const [titleName, setTitle] = useState("Photo Title");
  // const [nickname, setNick] = useState("Artist Nickname");
  // const [email, setEmail] = useState("Artist Email");
  // const [likes, set1s] = useState(0);
  // const [isLoaded, setLoad] = useState(false);
  // const [tags, setTags] = useState<string[]>([]);
  // const [artist, setArtist] = useState("");
  // const [status, setStatus] = useState(0);
  // const [is_artist, setIsArtist] = useState(false);
  // // TODO
  // const [photo, setPhoto] = useState("");
  // const [purchased, setPurchased] = useState<boolean>();
  // const currentUser = localStorage.getItem("u_id") as string;
  // const token = localStorage.getItem("token") as string;
  // const [meta, setMeta] = useState("");
  // const [price, setPrice] = useState(0);
  // const [discount, setDiscount] = useState(0);
  // const [deleted, setDeleted] = useState(false);
  // const [loadMessage, setLoadMessage] = useState("Page Still Loading");
  // const updateTags = (tag: string) => {
  //   if (tag) {
  //     setTags((tags) => [...tags, tag]);
  //   } else if (tag !== "") {
  //     setTags((tags) => [...tags, tag]);
  //   }
  // };

  componentDidMount() {
    axios
      .get("/photodetailspage", {
        params: {
          token: localStorage.getItem("token"),
          p_id: this.props.photoId,
        },
      })
      .then((res) => {
        const tempComments = [];
        for (const comment of res.data.comments) {
          tempComments.push(JSON.parse(comment));
        }
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
          deleted: res.data.deleted,
          isArtist: res.data.is_artist,
          loading: false,
        });
      })
      .catch(() => {});
  }

  // getPhotoDetails = async (photoId: string) => {
  //   await axios
  //     .get(`/photo_details?p_id=${photoId}&token=${token}`)
  //     .then((response) => {
  //       setArtist(response.data.u_id);
  //       setNick(response.data.nickname);
  //       setIsArtist(response.data.is_artist);
  //       setEmail(response.data.email);
  //       setLikes(response.data.likes);
  //       setTags(response.data.tagsList);
  //       setPurchased(response.data.purchased);
  //       setDeleted(response.data.deleted);
  //       setStatus(response.data.status);
  //       setMeta(response.data.metadata);
  //       setTitle(response.data.title);
  //       setPrice(response.data.price);
  //       setPhoto(`${response.data.metadata}${response.data.photoStr}`);
  //     });
  // };

  // useEffect(() => {
  //   getPhotoDetails(props.photoId);
  //   if (purchased === true) {
  //     setLoad(true);
  //   } else if (deleted === true || artist === "") {
  //     setLoad(false);
  //     setLoadMessage("The photo does not exist!");
  //   } else {
  //     setLoad(true);
  //   }
  //   if (status === 0) {
  //     setLoadMessage("Loading Photos...");
  //   }
  // }, [purchased, deleted, status, is_artist]);

  purchasePhoto(e: any) {
    e.preventDefault();
    e.stopPropagation();
    axios
      .post("/purchasephoto", {
        token: localStorage.getItem("token"),
        photoId: this.props.photoId,
      })
      .then((response) => {
        this.setState({ purchased: response.data.purchased });
        this.props.history.go(0);
      })
      .catch(() => {});
  }

  downloadPhoto(e: React.MouseEvent) {
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
      .catch(() => {});
  }

  // Determine whether to show buttons for:
  // Downloading full/watermarked photo, and managing photo
  returnDynamicButtons() {
    if (this.state.isArtist) {
      return (
        <div>
          <Button onClick={(e) => this.downloadPhoto(e)}>
            Download Full Photo
          </Button>
          <Button href={`/edit/${this.props.photoId}`} className="ml-1">
            Manage Photo
          </Button>
        </div>
      );
    } else if (this.state.purchased) {
      return (
        <div>
          <Button onClick={(e) => this.downloadPhoto(e)} className="ml-1">
            Download Full Photo
          </Button>
        </div>
      );
    }
    return (
      <div>
        <Button className="ml-1" onClick={(e) => this.downloadPhoto(e)}>
          Download Watermarked Photo
        </Button>
        <Button className="ml-1" onClick={(e) => this.purchasePhoto(e)}>
          Purchase Photo
        </Button>
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
            <LikeButton
              p_id={this.props.photoId}
              like_count={this.state.likes}
              isLiked={this.state.isLiked}
            />
            <BookmarkButton p_id={this.props.photoId} />
            {this.returnDynamicButtons()}
          </Row>
          <div className="ArtistInfo">
            <Row>
              <h2>
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
                  <Tags key={tag} tagName={tag} />
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
