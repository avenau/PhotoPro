import React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import ArtistThumbnail from "../Thumbnails/ArtistThumbnail";

import "./PhotoList.scss";


interface Props extends RouteComponentProps {
  artists: Artist[];
}

interface Artist {
  name: string;
  user: string;
  artistImg: string;
}

class ArtistList extends React.Component<Props> {
  render() {
    return (
      <>
        <div className="photo-results">
          {this.props.artists.map((artist) => (
            <div
              onClick={(e) => {
              e.preventDefault();
              this.props.history.push(`/user/${artist.user}`);
            }}
              className="photo-result"
              key={artist.user}
            >
              <ArtistThumbnail
                {...artist}
              />
            </div>
        ))}
        </div>

      </>
    );
  }
}

export default withRouter(ArtistList);
