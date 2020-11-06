import React from "react";
import Image from "react-bootstrap/Image";

import { Link } from "react-router-dom";
import Thumbnail from "../../static/catalouge.png";

import "./CollectionThumbnail.scss";

interface Props {
  id: string;
  title: string;
  authorId: string;
  author: string;
}

export default class CollectionThumbnail extends React.Component<Props> {
  render() {
    return (
      <>
        <Image src={Thumbnail} className="collection-thumbnail" />
        <div className="collection-overlay">
          <div>{this.props.title}</div>
          <Link
            to={`/user/${this.props.authorId}`}
            onClick={(e) => e.stopPropagation()}
          >
            By @{this.props.author}
          </Link>
        </div>
      </>
    );
  }
}
