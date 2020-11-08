import React from "react";

import ContentLoader from '../ContentLoader/ContentLoader';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Savings from "./Savings";
import axios from "axios";

interface AlbumDisplayProps {
  albumTitle?: string;
  discount?: number;
  tags?: string[];
  photos?: string[];
  albumId: string;
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
}

export default class AlbumDisplay extends React.Component<AlbumDisplayProps, AlbumDisplayState> {
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
      savings: ''
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
  }

  render() {

    return (
      <>
        <Container>
          <Savings albumId={this.state.albumId}/>
          <Button onClick={this.purchaseAlbum}>
            Purchase
          </Button>
          <ContentLoader
            query={this.state.albumId}
            route='/album/photos'
            type="albumPhotos"/>
        </Container>
      </>);
    }
  }
