import React from "react";
import Card from "react-bootstrap/Card";
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

export default class AlbumSavings extends React.Component<
  AlbumSavingsProps,
  AlbumSavingsState
> {
  constructor(props: AlbumSavingsProps) {
    super(props);
    this.state = {
      albumId: props.albumId,
      originalPrice: 0,
      discountedPrice: 0,
      savings: 0,
      yourPrice: 0,
      rawAlbumDiscount: 0,
    };
  }

  componentDidMount() {
    this.getPrice();
  }

  getPrice() {
    const token = localStorage.getItem("token")
      ? localStorage.getItem("token")
      : "";
    axios
      .get(`/album/price?token=${token}&albumId=${this.state.albumId}`)
      .then((res) => {
        this.setState({
          yourPrice: res.data.yourPrice,
          originalPrice: res.data.albumPrice,
          rawAlbumDiscount: res.data.rawAlbumDiscount,
          savings: res.data.savings,
        });
        console.log(res.data.rawAlbumDiscount);
      })
      .catch(() => {});
  }

  render() {
    return (
      <>
        <p>{this.state.rawAlbumDiscount}% off original price!</p>
        <p>
          <b>Originally, you would pay:</b> {this.state.originalPrice} CR{" "}
        </p>
        <p>
          <b>After discount, you would pay:</b> {this.state.yourPrice} CR
        </p>
        <p>
          <b>You save:</b> {this.state.savings} CR{" "}
        </p>
      </>
    );
  }
}
