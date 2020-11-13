import React from "react";
import Image from "react-bootstrap/Image";
import { Link } from "react-router-dom";
import Thumbnail from "../../static/catalouge.png";
import "./AlbumThumbnail.scss";
import axios from "axios"

interface Props {
  id: string;
  title: string;
  discount: number;
  authorId: string;
  author: string;
}

interface State {
  albumThumbnail: string;
}

export default class AlbumThumbnail extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      albumThumbnail: Thumbnail,
    }
  }

  componentDidMount() {
    const token = localStorage.getItem("token")
    axios
      .get("/album/thumbnail", {
        params: {
          albumId: this.props.id,
          token
        }
      })
      .then((res) => {
        console.log(res.data)
        if (res.data.thumbnail !== "") {
          this.setState({albumThumbnail: res.data.thumbnail})
        }
      })
      .catch();
  }

  render() {
    const { discount } = this.props;
    return (
      <>
        <Image src={this.state.albumThumbnail} className="album-thumbnail" />
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
