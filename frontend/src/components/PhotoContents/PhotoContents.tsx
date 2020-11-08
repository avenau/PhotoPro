import React, { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import BookmarkButton from "../BookmarkButton";
import LikeButton from "../LikeButton";
import "./PhotoContents.scss";
import axios from "axios";
import { Link } from "react-router-dom";
import PhotoComments from "../PhotoComments/PhotoComments";
import Price from "../Price";
import Tags from "../Tags";


interface Props extends RouteComponentProps {
  photoId: string;
}

export default class PhotoContents extends React.Component<Props> { 
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      nickname: "",
      email: "",
      likes: "",
      loading: true,
      tags
    }
  }
  const [titleName, setTitle] = useState("Photo Title");
  const [nickname, setNick] = useState("Artist Nickname");
  const [email, setEmail] = useState("Artist Email");
  const [likes, setLikes] = useState(0);
  const [isLoaded, setLoad] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [artist, setArtist] = useState("");
  const [status, setStatus] = useState(0);
  const [is_artist, setIsArtist] = useState(false);
  // TODO
  const [photo, setPhoto] = useState("");
  const [purchased, setPurchased] = useState<boolean>();
  const currentUser = localStorage.getItem("u_id") as string;
  const token = localStorage.getItem("token") as string;
  const [meta, setMeta] = useState("");
  const [price, setPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [deleted, setDeleted] = useState(false);
  const [loadMessage, setLoadMessage] = useState("Page Still Loading");
  const updateTags = (tag: string) => {
    if (tag) {
      setTags((tags) => [...tags, tag]);
    } else if (tag !== "") {
      setTags((tags) => [...tags, tag]);
    }
  };

  const getPhotoDetails = async (photoId: string) => {
    await axios
      .get(`/photo_details?p_id=${photoId}&token=${token}`)
      .then((response) => {
        setArtist(response.data.u_id);
        setNick(response.data.nickname);
        setIsArtist(response.data.is_artist);
        setEmail(response.data.email);
        setLikes(response.data.likes);
        setTags(response.data.tagsList);
        setPurchased(response.data.purchased);
        setDeleted(response.data.deleted);
        setStatus(response.data.status);
        setMeta(response.data.metadata);
        setTitle(response.data.title);
        setPrice(response.data.price);
        setPhoto(`${response.data.metadata}${response.data.photoStr}`);
      });
  };

  useEffect(() => {
    getPhotoDetails(props.photoId);
    if (purchased === true) {
      setLoad(true);
    } else if (deleted === true || artist === "") {
      setLoad(false);
      setLoadMessage("The photo does not exist!");
    } else {
      setLoad(true);
    }
    if (status === 0) {
      setLoadMessage("Loading Photos...");
    }
  }, [purchased, deleted, status, is_artist]);

  function purchasePhoto(e: any) {
    e.preventDefault();
    e.stopPropagation();
    axios
      .post("/purchasephoto", {
        token: token,
        photoId: props.photoId,
      })
      .then((response) => {
        setPurchased(response.data.purchased);
      })
      .catch(() => {});
  }

  function downloadPhoto(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    axios
      .get("/download", {
        params: {
          token: token,
          photo_id: props.photoId,
        },
      })
      .then((r) => {
        const link = document.createElement("a");
        link.href = `${r.data.metadata}${r.data.base64_img}`;
        const titleWithoutSpaces = titleName.replace(/\s+/g, "");
        link.setAttribute(
          "download",
          `${titleWithoutSpaces}${r.data.extension}`
        );
        document.body.appendChild(link);
        link.click();
        link.remove();
      });
  }

  function DetermineButton() {
    if (is_artist === true) {
      return (
        <div>
          <Button onClick={(e) => downloadPhoto(e)}>Download Full Photo</Button>
          <Link to={`/edit/${props.photoId}`}>
            <Button className="ml-1">Manage Photo</Button>
          </Link>
        </div>
      );
    }
    if (purchased === true) {
      return (
        <div>
          <Button onClick={(e) => downloadPhoto(e)} className="ml-1">
            Download Full Photo
          </Button>
        </div>
      );
    }
    return (
      <div>
        <Button className="ml-1" onClick={(e) => downloadPhoto(e)}>
          Download Watermarked Photo
        </Button>
        <Button className="ml-1" onClick={(e) => purchasePhoto(e)}>
          Purchase Photo
        </Button>
        <Price price={price} discount={discount} />
      </div>
    );
  }

  return isLoaded ? (
    <div className="PhotoContents">
      <Container className="container">
        <Row className="PhotoRow">
          <img className="actualPhoto" src={photo} alt="new" />
        </Row>
        <Row className="PhotoInteraction">
          <LikeButton
            u_id={currentUser}
            p_id={props.photoId}
            like_count={likes}
          />
          <BookmarkButton u_id={currentUser} p_id={props.photoId} />
          <DetermineButton />
        </Row>
        <div className="ArtistInfo">
          <Row>
            <h2>
              <b>{titleName}</b>
            </h2>
          </Row>
          <Row>by {nickname}</Row>
          <Row>{email}</Row>
        </div>
        <Row className="ContentRow">
          <Col className="Details">
            <Row>Tags (click tag to search)</Row>
            <Row>
              {tags.map((tag) => (
                <>
                  <Tags tagName={tag} />
                </>
              ))}
            </Row>
          </Col>
        </Row>
      </Container>
      <PhotoComments p_id={props.photoId} />
    </div>
  ) : (
    <div>
      {" "}
      <p>{loadMessage}</p>{" "}
    </div>
  );
}
