import React from "react";
import Card from 'react-bootstrap/Card';
import axios from "axios";

interface AlbumSavingsProps {
    albumId: string;
}

interface AlbumSavingsState {
  originalPrice: number;
  discountedPrice: number;
  savings: number;
  yourPrice: number;
  rawAlbumDiscount: number;
  albumId: string;
}



export default class AlbumSavings extends React.Component<AlbumSavingsProps, AlbumSavingsState> {
  constructor(props: AlbumSavingsProps){
    super(props);
    this.state = {
      albumId: props.albumId,
      originalPrice: 0,
      discountedPrice: 0,
      savings: 0,
      yourPrice: 0,
      rawAlbumDiscount: 0,
    }
  }

  componentDidMount(){
    this.getPrice()
  }

  getPrice(){
    const token = localStorage.getItem('token') ? localStorage.getItem('token') : '';
    axios
      .get(`/album/price?token=${token}&albumId=${this.state.albumId}`)
      .then((res) => {
        this.setState({
          yourPrice: res.data['yourPrice'],
          originalPrice: res.data['originalPrice'],
          rawAlbumDiscount: res.data['rawAlbumDiscount'],
          savings: res.data['savings']
        })
      })
  }

  render() {
    return (this.state.savings > 0) ?
    (
      <>
        <h2>Price: {this.state.yourPrice}</h2>
          <h4>Originally {this.state.originalPrice}</h4>
          <h4>You Save {this.state.savings}</h4>
      </>
    ) :
    (
      <>
        <h2>Price: {this.state.yourPrice}</h2>
      </>
    )
  }
}
