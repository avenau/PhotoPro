import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import BookmarkButton from "../BookmarkButton";
import LikeButton from "../LikeButton";
import "./PhotoContents.scss";
import axios from "axios";
import { Link } from "react-router-dom";
import PhotoComments from "../../components/PhotoComments/PhotoComments";

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
  //TODO
  const [photo, setPhoto] = useState("");
  const [purchased, setPurchase] = useState<boolean>();
  const currentUser = localStorage.getItem("u_id") as string;
  const updateTags = (tag: string) => {
    if (tag) {
      setTags((tags) => [...tags, tag]);
    } else if (tag !== "") {
      setTags((tags) => [...tags, tag]);
    }
  };

  const getPhotoDetails = async (photoId: string) => {
    await axios
      .get(`/photo_details?p_id=${photoId}&u_id=${currentUser}`)
      .then((response) => {
        console.log(response.data);
        setArtist(response.data.u_id);
        setNick(response.data.nickname);
        setEmail(response.data.email);
        setLikes(response.data.likes);
        setTags(response.data.tagsList);
        setPurchase(response.data.purchased);
        setTitle(response.data.title);
        setPhoto(response.data.path);
        setLoad(true);
      });
  };

  useEffect(() => {
    getPhotoDetails(props.photoId);

    console.log("Purchased: " + purchased);
  }, [purchased]);

  function DetermineButton() {
    if (artist === currentUser) {
      return (
        <div>
          <Button>Download Full Photo</Button>
          <Link to="/edit">
            <Button>Manage Photo</Button>
          </Link>
        </div>
      );
    } else if (purchased === true) {
      return <Button>Download Full Photo</Button>;
    }
    return (
      <div>
        <Button>Download Watermarked Photo</Button>
        <Button>Purchase Photo</Button>
      </div>
    );
  }

  return isLoaded ? (
    <div className="PhotoContents">
      <Container className="container">
        <Row className="PhotoRow">
          <img
            className="actualPhoto"
            src="https://scontent.fsyd8-1.fna.fbcdn.net/v/t1.0-9/121219614_3529427603766814_3815530349844701512_o.jpg?_nc_cat=111&ccb=2&_nc_sid=e3f864&_nc_ohc=Yc5BU7mBfcIAX-SBR2q&_nc_ht=scontent.fsyd8-1.fna&oh=fb9406ff6f5fbfa7136dc7930dc5c7fd&oe=5FBB9523"
            alt="new"
          />
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
                  <Button className="mr-1" variant="secondary">
                    {tag}
                  </Button>{" "}
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
      <p>Photo does not exist!</p>{" "}
    </div>
  );
}
