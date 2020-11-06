import React from "react";
import Image from "react-bootstrap/Image";
import { Link } from "react-router-dom";
import Thumbnail from "../../static/catalouge.png";
import "./AlbumThumbnail.scss";

interface Props {
  id: string;
  title: string;
  discount: number;
  authorId: string;
  author: string;
}

export default class AlbumThumbnail extends React.Component<Props> {
  render() {
    const { discount } = this.props;
    return (
      <>
        <Image src={Thumbnail} className="album-thumbnail" />
        <div className="album-overlay">
          <div>{this.props.title}</div>
          <Link
            to={`/user/${this.props.authorId}`}
            onClick={(e) => e.stopPropagation()}
          >
            By @{this.props.author}
          </Link>
          {discount > 0 ? <div>Save {discount}%</div> : <div />}
        </div>
      </>
    );
  }
}
