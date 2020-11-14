import React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import axios from "axios";
import Image from "react-bootstrap/Image";
import Price from "../Price";
import LoadingButton from "../LoadingButton/LoadingButton";
import NoImage from "../../static/no_image.png";
import "./PhotoThumbnail.scss";

interface Props extends RouteComponentProps {
  id: string;
  title: string;
  price: number;
  discount: number;
  photoStr: string;
  metadata: string;
  user: string;
  owns: boolean;
  popular?: boolean;
  likes?: number;
  deleted?: boolean;
  updatePage?: () => void;
  refreshCredits?: () => void;
  buyBtnLoading?: boolean;
  setBuyBtnsDisabled?: (set: boolean) => void;
}

interface BetterInterface {
  owns: boolean;
  photoB64: string;
  btnLoading: boolean;
}

class PhotoThumbnail extends React.Component<Props, BetterInterface> {
  constructor(props: Props) {
    super(props);
    this.state = {
      owns: this.props.owns,
      photoB64: `${this.props.metadata}${this.props.photoStr}`,
      btnLoading: false,
    };
  }

  private handleBuy(e: React.MouseEvent<HTMLElement, MouseEvent>) {
    e.preventDefault();
    e.stopPropagation();
    const token = localStorage.getItem("token");
    this.props.setBuyBtnsDisabled!(true);
    this.setState({ btnLoading: true });
    axios
      .post("/purchasephoto", {
        token,
        photoId: this.props.id,
      })
      .then((res) => {
        this.setState({
          owns: res.data.purchased,
          photoB64: `${res.data.metadata}${res.data.photoStr}`,
        });
        this.props.setBuyBtnsDisabled!(false);
        this.setState({ btnLoading: false });
        if (this.props.refreshCredits) {
          this.props.refreshCredits();
        }
        if (this.props.updatePage !== undefined) {
          this.props.updatePage();
        }
      })
      .catch(() => {
        this.props.setBuyBtnsDisabled!(false);
        this.setState({ btnLoading: false });
      });
  }

  private handleDownload(e: React.MouseEvent<HTMLElement, MouseEvent>) {
    e.preventDefault();
    e.stopPropagation();
    const token = localStorage.getItem("token");
    this.setState({ btnLoading: true });
    axios
      .get("/download", {
        params: {
          token,
          photoId: this.props.id,
        },
      })
      .then((r) => {
        this.setState({ btnLoading: false });
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
      })
      .catch(() => {
        this.setState({ btnLoading: false });
      });
  }

  getLikes() {
    if (this.props.likes) {
      return this.props.likes > 1 ? (
        <div style={{ fontSize: "18px" }}> {this.props.likes} likes </div>
      ) : (
        <div style={{ fontSize: "18px" }}> {this.props.likes} like </div>
      );
    }
    return <></>;
  }

  render() {
    return !this.state.owns && this.props.deleted ? (
      <>
        <Image src={NoImage} className="photo-thumbnail" />
        <div className="photo-overlay">This photo has been deleted</div>
      </>
    ) : (
      <>
        <Image src={this.state.photoB64} className="photo-thumbnail" />
        <div className="photo-overlay">
          <div>{this.props.title}</div>
          {this.props.popular ? this.getLikes() : <></>}
          <Price fullPrice={this.props.price} discount={this.props.discount} />
          {!this.state.owns ? (
            <LoadingButton
              loading={this.state.btnLoading}
              disabled={this.props.buyBtnLoading!}
              onClick={(e) => {
                this.handleBuy(e);
              }}
            >
              Buy
            </LoadingButton>
          ) : (
            <LoadingButton
              loading={this.state.btnLoading!}
              onClick={(e) => {
                this.handleDownload(e);
              }}
            >
              Download
            </LoadingButton>
          )}
        </div>
      </>
    );
  }
}

export default withRouter(PhotoThumbnail);
