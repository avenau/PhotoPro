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
  price: string;
  originalPrice: string;
  rawAlbumDiscount: string;
  savings: string;
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
      price: '',
      originalPrice: '',
      rawAlbumDiscount: '',
      savings: '',
      purchased: false
    }
  }

  componentDidMount(){
    this.getPrice();
  }

  getPrice(){
    const token = localStorage.getItem('token') ? localStorage.getItem('token') : '';
    axios
      .get(`/album/price?token=${token}&albumId=${this.state.albumId}`)
      .then((res) => {
        this.setState({
          price: res.data['yourPrice'],
          originalPrice: res.data['originalPrice'],
          rawAlbumDiscount: res.data['rawAlbumDiscount'],
          savings: res.data['savings']
        })
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
        this.props.history.push('/purchases')
      })
      .catch((err) => {
        console.log(err)
      })
  }

  // you own x photos in this Album
  // you would pay this normally
  // now you pay x
  // discount percentage

  render() {
    return (
      <>
        <Container>
          {this.props.isOwner ?
          <Savings albumId={this.state.albumId}/> :
            this.state.purchased ? 
              <Button>You've purchased this album already</Button>
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