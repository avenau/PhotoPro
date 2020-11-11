import React from "react";

import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import axios from "axios";
import { RouteComponentProps, withRouter, Link } from 'react-router-dom';
import Savings from "./Savings";
import Album from "../PhotoEdit/Album";
import "./AlbumDisplay.scss"


interface AlbumDisplayProps extends RouteComponentProps {
  albumTitle?: string;
  discount?: number;
  tags: string[];
  photos?: string[];
  albumId: string;
  isOwner: boolean;
  owner: string;
  nickname: string;
}

interface AlbumDisplayState {
  albumTitle?: string;
  discount?: number;
  tags?: string[];
  photos?: string[];
  albumId: string;
  purchased: boolean;
}

class AlbumDisplay extends React.Component<AlbumDisplayProps, AlbumDisplayState> {
  constructor(props: AlbumDisplayProps) {
    super(props);
    this.state = {
      albumTitle: props.albumTitle,
      discount: props.discount,
      tags: props.tags,
      photos: props.photos,
      albumId: props.albumId,
      purchased: false,
    }
  }

  componentDidMount() {
    this.checkIfPurchased()
  }

  checkIfPurchased() {
    const token = localStorage.getItem('token') ? localStorage.getItem('token') : '';
    axios
      .get(`/album/checkpurchased?token=${token}&albumId=${this.state.albumId}`)
      .then((res) => {
        if (res.data.purchased) {
          this.setState({ purchased: true })
        }
      })
  }

  purchaseAlbum() {
    const token = localStorage.getItem('token') ? localStorage.getItem('token') : '';
    axios
      .post("/purchasealbum", {
        token,
        albumId: this.state.albumId
      })
      .then((res) => {
        this.setState({ purchased: true })
        window.location.reload()
      })
      .catch((err) => {
        console.log(err)
      })
  }

  render() {
    return (
      <>
        <Link
          to={`/user/${this.props.owner}`}
          >
          By @​​​​​​​{this.props.nickname}
        </Link>
        {this.props.isOwner ?
          <>
          <div className="album-price-display">
            <p>{this.props.discount}% off original price!</p>
            <Savings albumId={this.state.albumId} />
          </div>
          </> :
          this.state.purchased ? 
            <p>You've purchased this album already</p>
            :
            <div className="album-price-display">
              <p>{this.props.discount}% off original price!</p>
              <Savings albumId={this.state.albumId} />
              <Button onClick={() => { this.purchaseAlbum() }}>
                Purchase
              </Button>
            </div>
        }
      </>);
  }
}
export default withRouter(AlbumDisplay)
