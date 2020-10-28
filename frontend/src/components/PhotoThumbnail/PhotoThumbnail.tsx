import React from "react";
import { Image } from "react-bootstrap";
import "./PhotoThumbnail.scss";

interface Props {
  id: string;
  title: string;
  price: number;
  discount: string;
  photoStr: string;
  metadata: string;
}

export default class PhotoThumbnail extends React.Component<Props> {
  private getPic() {
    return (
      this.props.metadata + this.props.photoStr.replace("b'", "").slice(0, -1)
    );
  }

  render() {
    console.log(this.props);
    return (
      <>
        <Image src={this.getPic()} className="photo-thumbnail" />
        <div className="overlay">
          <button>Hi there i am button</button>
        </div>
      </>
    );
  }
}
