import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import BookmarkButton from "../BookmarkButton";
import LikeButton from "../LikeButton";
import "./PhotoContents.scss";
import axios from "axios";
import { Link } from "react-router-dom";
import PhotoComments from "../../components/PhotoComments/PhotoComments";
import Price from "../Price";
import Tags from "../Tags";

interface ContentProps {
  photoId: string;
}

export default function PhotoContents(props: ContentProps) {
  const [titleName, setTitle] = useState("Photo Title");
  const [nickname, setNick] = useState("Artist Nickname");
  const [email, setEmail] = useState("Artist Email");
  const [likes, setLikes] = useState(0);
  const [isLoaded, setLoad] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [artist, setArtist] = useState("");
  const [status, setStatus] = useState(0);
  //TODO
  const [photo, setPhoto] = useState("");
  const [purchased, setPurchase] = useState<boolean>();
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
    console.log(token);
    await axios
      .get(`/photo_details?p_id=${photoId}&token=${token}`)
      .then((response) => {
        //console.log(response.data);
        setArtist(response.data.u_id);
        setNick(response.data.nickname);
        setEmail(response.data.email);
        setLikes(response.data.likes);
        setTags(response.data.tagsList);
        setPurchase(response.data.purchased);
        setDeleted(response.data.deleted);
        setStatus(response.data.status);
        setMeta(response.data.metadata);
        setTitle(response.data.title);
        setPrice(response.data.price);
        setPhoto(`${response.data.metadata}${response.data.photoStr}`);

        //console.log("deleted" + response.data.deleted);
        //console.log(response.status);
      });
  };

  useEffect(() => {
    getPhotoDetails(props.photoId);
    if (purchased === true) {
      //console.log("Purchased Section");
      setLoad(true);
    } else if (deleted === true || artist === "") {
      //console.log("IN deleted Section");
      setLoad(false);
      setLoadMessage("The photo does not exist");
    } else {
      //console.log("Everything Else");
      setLoad(true);
    }
    if (status === 0) {
      setLoadMessage("Loading...");
    }
    console.log("STATUS UPDATE");
    console.log(status);
    //console.log("Purchased: " + purchased);
  }, [purchased, deleted, status]);

  function DetermineButton() {
    if (artist === currentUser) {
      return (
        <div>
          <Button>Download Full Photo</Button>
          <Link to={`/edit/${props.photoId}`}>
            <Button className="ml-1">Manage Photo</Button>
          </Link>
          <Price price={price} discount={discount} />
        </div>
      );
    } else if (purchased === true) {
      return (
        <div>
          <Button className="ml-1">Download Full Photo</Button>
          <Price price={price} discount={discount} />
        </div>
      );
    }
    return (
      <div>
        <Button className="ml-1">Download Watermarked Photo</Button>
        <Button className="ml-1">Purchase Photo</Button>
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
          <LikeButton u_id={currentUser} p_id={props.photoId} />
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
            <Row>
              <Button>Tags</Button>
            </Row>
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
