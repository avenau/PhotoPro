import React from "react";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";
import Price from "../Price";
import "./CollectionThumbnail.scss";

interface Props {
  id: string;
  title: string;
  price: number;
  discount: number;
  purchasable: boolean;
}

// TODO change from PhotoThumbnail template
export default class CollectionThumbnail extends React.Component<Props> {
  private getCollection() {
    return this.props.title;
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
    console.log("do download");
  }

  render() {
    console.log(this.props);
    return (
      <>
        <Image src={this.getCollection()} className="collection-thumbnail" />
        <div className="overlay">
          <div>{this.props.title}</div>
          <Price price={this.props.price} discount={this.props.discount} />
          {this.props.purchasable ? (
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
