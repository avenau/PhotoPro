import React from "react";

import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { RouteComponentProps, withRouter, Link } from "react-router-dom";
import Savings from "./Savings";
import Album from "../PhotoEdit/Album";
import "./AlbumDisplay.scss";

interface AlbumDisplayProps extends RouteComponentProps {
  albumTitle?: string;
  discount?: number;
  tags: string[];
  photos?: string[];
  albumId: string;
  isOwner: boolean;
  owner: string;
  nickname: string;
  purchased: boolean;
  setPurchased: (b: boolean) => void;
}

interface AlbumDisplayState {
  albumTitle?: string;
  discount?: number;
  tags?: string[];
  photos?: string[];
  albumId: string;
  purchased: boolean;
}

class AlbumDisplay extends React.Component<
  AlbumDisplayProps,
  AlbumDisplayState
> {
  constructor(props: AlbumDisplayProps) {
    super(props);
    this.state = {
      albumTitle: props.albumTitle,
      discount: props.discount,
      tags: props.tags,
      photos: props.photos,
      albumId: props.albumId,
      purchased: false,
    };
  }

  // componentDidMount() {
  //   this.checkIfPurchased();
  // }

  // checkIfPurchased() {
  //   const token = localStorage.getItem("token")
  //     ? localStorage.getItem("token")
  //     : "";
  //   axios
  //     .get(`/album/checkpurchased?token=${token}&albumId=${this.state.albumId}`)
  //     .then((res) => {
  //       if (res.data.purchased) {
  //         this.setState({ purchased: true });
  //       }
  //     })
  //     .catch(() => {});
  // }

  purchaseAlbum() {
    const token = localStorage.getItem("token")
      ? localStorage.getItem("token")
      : "";
    axios
      .post("/purchasealbum", {
        token,
        albumId: this.state.albumId,
      })
      .then((res) => {
        this.props.setPurchased(true);
        window.location.reload();
      })
      .catch(() => {});
  }

  render() {
    return (
      <>
        <Link to={`/user/${this.props.owner}`}>
          By @​​​​​​​{this.props.nickname}
        </Link>
        <div className="album-price-display">
          <Savings albumId={this.state.albumId} />
        </div>
        {this.props.isOwner ? (
          <></>
        ) : this.props.purchased ? (
          <p>You own all the photos in this album!</p>
        ) : (
          <Button
            onClick={() => {
              this.purchaseAlbum();
            }}
          >
            Purchase
          </Button>
        )}
      </>
    );
  }
}
export default withRouter(AlbumDisplay);
