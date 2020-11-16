import React from "react";
import Image from "react-bootstrap/Image";
import "./ArtistThumbnail.scss";
import _ from "lodash";
import profilePic from "../../static/profile-pic.png";

interface Props {
  name: string;
  user: string;
  artistImg: string;
}

export default class ArtistThumbnail extends React.Component<Props> {
  private getPic() {
    if (_.isEqual(this.props.artistImg, ["", ""])) {
      return profilePic;
    }
    if (this.props.artistImg !== undefined) {
      // base64 of the tuple profilePic
      const b64 = `${this.props.artistImg[0]}`;
      const header = "data:image/";
      // Filetype of the tuple profilePic
      const filetype = `${this.props.artistImg[1]}`;
      const footer = ";base64, ";
      const ret = header.concat(filetype.concat(footer.concat(b64)));

      return ret;
    }
    return profilePic;
  }

  render() {
    return (
      <>
        <Image src={this.getPic()} className="artist-thumbnail" />
        <div className="artist-overlay">
          <div>{this.props.name}</div>
        </div>
      </>
    );
  }
}
