import React from "react";
import axios from "axios";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";
import Price from "../Price";
import "./PhotoThumbnail.scss";

interface Props {
  id: string;
  title: string;
  price: number;
  discount: number;
  photoStr: string;
  metadata: string;
  user: string;
  owns: boolean; // purchased or posted
}

export default class PhotoThumbnail extends React.Component<
  Props,
  { owns: boolean }
> {
  constructor(props: Props) {
    super(props);
    this.state = {
      owns: this.props.owns,
    };
  }
  private getPic() {
    return this.props.metadata + this.props.photoStr;
  }

  private handleBuy(e: React.MouseEvent<HTMLElement, MouseEvent>) {
    e.preventDefault();
    e.stopPropagation();
    const token = localStorage.getItem("token");
    axios
      .post("/purchasephoto", {
        token: token,
        photoId: this.props.id,
      })
      .then((response) => {
        this.setState({ owns: response.data.purchased });
      })
      .catch(() => {});
  }

  private handleDownload(e: React.MouseEvent<HTMLElement, MouseEvent>) {
    e.preventDefault();
    e.stopPropagation();
    const token = localStorage.getItem("token");
    console.log('download!')
    console.log(this.props)
    axios
      .get("/download", {
        params: {
          token: token,
          photoId: this.props.id,
        },
      })
      .then((r) => {
        const link = document.createElement("a");
        link.href = `${r.data.metadata}${r.data.base64_img}`;
        const titleWithoutSpaces = this.props.title.replace(/\s+/g, "");
        link.setAttribute(
          "download",
          `${titleWithoutSpaces}${r.data.extension}`
        );
        document.body.appendChild(link);
        link.click();
        link.remove();
      });
  }

  render() {
    return (
      <>
        <Image src={this.getPic()} className="photo-thumbnail" />
        <div className="photo-overlay">
          <div>{this.props.title}</div>
          <Price fullPrice={this.props.price} discount={this.props.discount} />
          {!this.state.owns ? (
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
