import React from "react";

import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import axios from "axios";
import { RouteComponentProps, withRouter, Link } from 'react-router-dom';
import ContentLoader from '../ContentLoader/ContentLoader';
import Savings from "./Savings";
import Album from "../PhotoEdit/Album";

interface AlbumDisplayProps extends RouteComponentProps {
  albumTitle?: string;
  discount?: number;
  tags?: string[];
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
        <Container>
          <Link
            to={`/user/${this.props.owner}`}
            >
            By @​​​​​​​{this.props.nickname}
          </Link>
          {this.props.isOwner ?
            <>
            <p>{this.props.discount}% off original price!</p>
            <Savings albumId={this.state.albumId} />
            </> :
            this.state.purchased ? 
              <p>You've purchased this album already</p>
              :
              <>
                <p>{this.props.discount}% off original price!</p>
                <Savings albumId={this.state.albumId} />
                <Button onClick={() => { this.purchaseAlbum() }}>
                  Purchase
                </Button>
              </>
          }
          <ContentLoader
            query={this.state.albumId}
            route='/album/photos'
            type="albumPhotos"
            updatePage={() => {window.location.reload()}}
          />
        </Container>
      </>);
  }
}
export default withRouter(AlbumDisplay)
