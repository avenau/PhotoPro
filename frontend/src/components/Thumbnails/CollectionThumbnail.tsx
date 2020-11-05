import React from "react";
import Image from "react-bootstrap/Image";
import paperclip from '../../static/paperclip.png'
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

  render() {
    return (
      <>
        <Image src={paperclip} className="collection-thumbnail" />
      </>
    );
  }
}
