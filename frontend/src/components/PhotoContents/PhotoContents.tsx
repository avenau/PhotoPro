import axios from "axios";
import React from "react";
import { Col, Container, Image, Row } from "react-bootstrap";
import { ArrowDownSquare, CartPlus, PencilSquare } from "react-bootstrap-icons";
import { RouteComponentProps, withRouter } from "react-router-dom";
import BookmarkButton from "../BookmarkButton";
import HoverText from "../HoverText";
import LikeButton from "../LikeButton";
import LoadingButton from "../LoadingButton/LoadingButton";
import PhotoComments from "../PhotoComments/PhotoComments";
import Price from "../Price";
import ShowdownBadge from "../Showdown/ShowdownBadge";
import Tags from "../TagLinks";
import "./PhotoContents.scss";

interface Collection {
  title: string;
  id: string;
  photoExists: boolean;
}

interface Props extends RouteComponentProps {
  photoId: string;
  refreshCredits: () => void;
}
interface Comment {
  content: string;
  datePosted: string;
  commenter: string;
  commenter_id: string;
  exact_time: string;
  time_after: string;
  comment_id: string;
  profile_pic: string[];
}

interface State {
  artistId: string;
  nickname: string;
  email: string;
  title: string;
  fullPrice: number;
  discount: number;
  postedDate: string;
  likes: number;
  isLiked: boolean;
  tags: string[];
  purchased: boolean;
  photoB64: string;
  isArtist: boolean;
  comments: Comment[];
  loading: boolean;
  msg: string;
  collections: Collection[];
  downloadBtnLoading: boolean;
  purchaseBtnLoading: boolean;
}

class PhotoContents extends React.Component<Props, State> {
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
        document.title = `${res.data.title} | PhotoPro`;
        const tempComments: Comment[] = [];
        res.data.comments.map((comment: any) =>
          tempComments.push(JSON.parse(comment))
        );
        this.setState({
          comments: tempComments,
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
      .catch(() => {
        // Sleep to display the Toast long enough to read it.
        const sleep = (delay: number) => new Promise((resolve) => setTimeout(resolve, delay))
        const sleepBaby = async () => {await sleep(3000)}
        sleepBaby()
        .then(()=> this.props.history.push('/purchases'));
      });
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
        <>
          <Row>
            <HoverText
              id="downloadButton"
              helpfulText="Download"
              placement="bottom"
            >
              <LoadingButton
                loading={this.state.downloadBtnLoading}
                onClick={(e) => this.downloadPhoto(e)}
                variant="light"
                className="m-2 ml-4"
              >
                <ArrowDownSquare />
              </LoadingButton>
            </HoverText>
            <HoverText
              id="manageButton"
              helpfulText="Manage Photo"
              placement="bottom"
            >
              <LoadingButton
                loading={false}
                onClick={() =>
                  this.props.history.push(`/edit/${this.props.photoId}`)
                }
                variant="light"
                className="m-2"
              >
                <PencilSquare />
              </LoadingButton>
            </HoverText>
          </Row>
        </>
      );
    }
    if (this.state.purchased) {
      return (
        <Row>
          <HoverText
            id="downloadButton"
            helpfulText="Download"
            placement="bottom"
          >
            <LoadingButton
              loading={this.state.downloadBtnLoading}
              onClick={(e) => this.downloadPhoto(e)}
              className="m-2 ml-4"
              variant="light"
            >
              <ArrowDownSquare />
            </LoadingButton>
          </HoverText>
        </Row>
      );
    }
    return (
      <>
        <Row>
          <HoverText
            id="downloadWatermarked"
            helpfulText="Download Watermarked Photo"
            placement="bottom"
          >
            <LoadingButton
              loading={this.state.downloadBtnLoading}
              onClick={(e) => this.downloadPhoto(e)}
              className="m-2 ml-4"
              variant="light"
            >
              <ArrowDownSquare />
            </LoadingButton>
          </HoverText>
          <HoverText
            id="purchasePhoto"
            helpfulText="Purchase Photo"
            placement="bottom"
          >
            <LoadingButton
              className="m-2"
              loading={this.state.purchaseBtnLoading}
              onClick={(e) => this.purchasePhoto(e)}
              variant="light"
            >
              <CartPlus />
            </LoadingButton>
          </HoverText>
        </Row>
      </>
    );
  }

  render() {
    return !this.state.loading ? (
      <div className="photo-contents">
        <Container>
          <div className="top-container">
            <div className="photo-component">
              <Image className="actualPhoto" src={this.state.photoB64} fluid />
            </div>
            <div>
              <div className="photo-info">
                <Row>
                  <h2 className="PhotoTitle">
                    <b>{this.state.title}</b>
                  </h2>
                  <ShowdownBadge entryId={this.props.photoId} type="photo" />
                </Row>
                <Row>
                  by{" "}
                  <a className="mx-1" href={`/user/${this.state.artistId}`}>
                    {this.state.nickname}
                  </a>{" "}
                  on {this.state.postedDate}
                </Row>
                <Row>{this.state.email}</Row>
                <br />
                <Row>
                  <Col>
                    <Row>
                      <div>
                        <b>Tags</b> (click tag to search)
                      </div>
                    </Row>
                    <Row>
                      {this.state.tags.map((tag: string) => (
                        <Tags key={tag} tagName={tag} type="photo" />
                      ))}
                    </Row>
                  </Col>
                </Row>
                <Row className="photo-interactions">
                  <LikeButton
                    pId={this.props.photoId}
                    likeCount={this.state.likes}
                    isLiked={this.state.isLiked}
                  />
                  <BookmarkButton
                    pId={this.props.photoId}
                    collections={this.state.collections}
                  />
                  {this.returnDynamicButtons()}
                </Row>
                {this.state.isArtist || !this.state.purchased ? (
                  <Row>
                    <Price
                      fullPrice={this.state.fullPrice}
                      discount={this.state.discount}
                      className="price"
                    />
                  </Row>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
        </Container>
        <Container>
          <PhotoComments
            p_id={this.props.photoId}
            comments={this.state.comments}
          />
        </Container>
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
