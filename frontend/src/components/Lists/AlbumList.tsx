import React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import AlbumThumbnail from "../Thumbnails/AlbumThumbnail";
import "./AlbumList.scss";

interface Props extends RouteComponentProps {
  albums: Album[];
}

interface Album {
  id: string;
  title: string;
  discount: number;
  authorId: string;
  author: string;
}

class AlbumList extends React.Component<Props> {
  render() {
    return (
      <div className="album-results">
        {this.props.albums.map((album) => (
          <div
            onClick={(e) => {
              e.preventDefault();
              this.props.history.push(`/album/${album.id}`);
            }}
            key={album.id}
            className="album-result"
          >
            <AlbumThumbnail {...album} />
          </div>
        ))}
      </div>
    );
  }
}

export default withRouter(AlbumList);
