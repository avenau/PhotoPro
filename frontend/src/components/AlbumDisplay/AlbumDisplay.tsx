import React from "react";

import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import axios from "axios";
import { RouteComponentProps, withRouter } from 'react-router-dom';
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
}

interface AlbumDisplayState {
  albumTitle?: string;
  discount?: number;
  tags?: string[];
  photos?: string[];
  albumId: string;
  purchased: boolean; // TODO set purchased from backend
}

class AlbumDisplay extends React.Component<AlbumDisplayProps, AlbumDisplayState> {
  constructor(props: AlbumDisplayProps){
    super(props);
    this.state = {
      albumTitle: props.albumTitle,
      discount: props.discount,
      tags: props.tags,
      photos: props.photos,
      albumId: props.albumId,
      purchased: false
    }
  }

  componentDidMount(){
    this.checkIfPurchased()
  }

  checkIfPurchased() {
    const token = localStorage.getItem('token') ? localStorage.getItem('token') : '';
    axios
      .get(`/album/checkpurchased?token=${token}&albumId=${this.state.albumId}`)
      .then((res) => {
        if (res.data["purchased"]) {
          this.setState({purchased: true})
        }
      })
  }

  purchaseAlbum(){
    console.log("Purchasing");
    const token = localStorage.getItem('token') ? localStorage.getItem('token') : '';
    axios
      .post("/purchasealbum", {
        token: token,
        albumId: this.state.albumId
      })
      .then((res) => {
        console.log('purchased album')
        this.setState({purchased: true})
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
          {this.props.isOwner ?
          <Savings albumId={this.state.albumId}/> :
            this.state.purchased ? 
              <p>You've purchased this album already</p>
              :
              <>
              <Savings albumId={this.state.albumId}/>
              <Button onClick={() => {this.purchaseAlbum()}}>
                Purchase
              </Button>
              </>
          }
          <ContentLoader
            query={this.state.albumId}
            route='/album/photos'
            type="albumPhotos"/>
        </Container>
      </>);
    }
  }
export default withRouter(AlbumDisplay)