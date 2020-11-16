import React from "react";
import axios from "axios";

interface AlbumSavingsProps {
  albumId: string;
}

interface AlbumSavingsState {
  originalPrice: number;
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
      })
      .catch(() => {});
  }

  render() {
    return (
      <>
        {this.state.rawAlbumDiscount > 0 ? (
          <>
            <p>{this.state.rawAlbumDiscount}% off original price!</p>
            <p>
              <b>Originally, you would pay:</b> {this.state.originalPrice}{" "}
              Credits{" "}
            </p>
            <p>
              <b>After discount, you pay:</b> {this.state.yourPrice} Credits
            </p>
            <p>
              <b>You save:</b> {this.state.savings} Credits{" "}
            </p>
          </>
        ) : (
          <p>
            <p>There is no discount on this album</p>
            <b>Total Price:</b> {this.state.originalPrice}
          </p>
        )}
      </>
    );
  }
}
