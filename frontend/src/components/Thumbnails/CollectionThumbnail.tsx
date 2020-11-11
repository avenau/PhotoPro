import React from "react";
import Image from "react-bootstrap/Image";
import axios from "axios"
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
  constructor(props: Props) {
    super(props);
    this.state = {
      collectionThumbnail: Thumbnail,
    }
  }
  componentDidMount() {
    const token = localStorage.getItem("token")
    axios
      .get("/collection/thumbnail", {
        params: {
          albumId: this.props.id,
          token: token
        }
      })
      .then((res) => {
        console.log(res.data)
        if (res.data.thumbnail !== "") {
          this.setState({collectionThumbnail: res.data.thumbnail})
        }
      })
      .catch();
  }

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
