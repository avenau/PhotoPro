import React from "react";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";
import Price from "../Price";
import "./PhotoThumbnail.scss";

interface Props {
  id: string;
  title: string;
  price: number;
  discount: number;
  photoStr: string;
  metadata: string;
  author: string;
}

export default class PhotoThumbnail extends React.Component<Props> {
  private getPic() {
    return this.props.metadata + this.props.photoStr;
  }

  private handleBuy(e: React.MouseEvent<HTMLElement, MouseEvent>) {
    e.preventDefault();
    e.stopPropagation();
    // TODO Handle puchasing here
    console.log("do purchase/add to cart");
  }

  private handleDownload(e: React.MouseEvent<HTMLElement, MouseEvent>) {
    e.preventDefault();
    e.stopPropagation();
    // TODO Handle downloading here
    // TODO ensure this gets validated
    console.log("do download");
  }

  render() {
    console.log(this.props);
    let purchasable = false;
    if (
      this.props.author &&
      this.props.author === localStorage.getItem("u_id")
    ) {
      purchasable = true;
    }
    return (
      <>
        <Image src={this.getPic()} className="photo-thumbnail" />
        <div className="overlay">
          <div>{this.props.title}</div>
          <Price price={this.props.price} discount={this.props.discount} />
          {purchasable ? (
            <Button
              onClick={(e) => {
                this.handleBuy(e);
              }}
            >
              Buy
            </Button>
          ) : (
            <Button
              onClick={(e) => {
                this.handleDownload(e);
              }}
            >
              Download
            </Button>
          )}
        </div>
      </>
    );
  }
}
