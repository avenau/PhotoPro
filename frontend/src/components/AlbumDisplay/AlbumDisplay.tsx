import React from "react";

import axios from "axios";
import { RouteComponentProps, withRouter, Link } from "react-router-dom";
import Savings from "./Savings";
import LoadingButton from "../LoadingButton/LoadingButton";
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
  albumId: string;
  purchaseBtnLoading: boolean;
}

class AlbumDisplay extends React.Component<
  AlbumDisplayProps,
  AlbumDisplayState
> {
  constructor(props: AlbumDisplayProps) {
    super(props);
    this.state = {
      albumId: props.albumId,
      purchaseBtnLoading: false,
    };
  }

  purchaseAlbum() {
    const token = localStorage.getItem("token");
    this.setState({ purchaseBtnLoading: true });
    axios
      .post("/purchasealbum", {
        token,
        albumId: this.state.albumId,
      })
      .then(() => {
        this.props.setPurchased(true);
        this.setState({ purchaseBtnLoading: false });
        window.location.reload();
      })
      .catch(() => {
        this.setState({ purchaseBtnLoading: false });
      });
  }

  getPurchaseButton() {
    if (this.props.isOwner) return <></>;
    if (this.props.purchased)
      return <p>You own all the photos in this album!</p>;

    return (
      <LoadingButton
        loading={this.state.purchaseBtnLoading}
        onClick={() => {
          this.purchaseAlbum();
        }}
      >
        Purchase
      </LoadingButton>
    );
  }

  render() {
    return (
      <>
        <Link to={`/user/${this.props.owner}`}>By @{this.props.nickname}</Link>
        <div className="album-price-display">
          <Savings albumId={this.state.albumId} />
        </div>
        {this.getPurchaseButton()}
      </>
    );
  }
}
export default withRouter(AlbumDisplay);
