import React, { useEffect, useState } from "react";
import axios from "axios";
import _ from "lodash";
import { Trash } from "react-bootstrap-icons";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Row, Col } from "react-bootstrap";
import profilePic from "../../static/profile-pic.png";
import "./CommentMessage.scss";
import HoverText from "../HoverText"

interface MessageProp {
  message: string;
  author: string;
  exact_date: string;
  time_after: string;
  author_id: string;
  comment_id: string;
  photo_id: string;
  getComments: Function;
  profile_pic: string[];
  new_to_old: boolean;
}

export default function CommentMessage(props: MessageProp) {
  const [showingDate, setDate] = useState(props.time_after);
  const [showDelete, setDelete] = useState(false);
  const currentUser = localStorage.getItem("u_id") as string;

  const showExactDate = () => {
    setDate(props.exact_date);
  };
  const showTimeAfter = () => {
    setDate(props.time_after);
  };

  function DetermineDeleteButton() {
    if (currentUser === props.author_id) {
      setDelete(true);
    }
  }

  const DeleteComment = () => {
    const token = localStorage.getItem("token");
    const c_id = props.comment_id;
    const p_id = props.photo_id;
    axios
      .post("/comments/delete_comments", {
        token,
        c_id,
        p_id,
      })
      .then(() => {
        props.getComments(p_id, props.new_to_old);
      });
  };

  function getPic() {
    // Get filetype
    if (_.isEqual(props.profile_pic, ["", ""])) {
      return profilePic;
    }
    if (props.profile_pic !== undefined) {
      // base64 of the tuple profilePic
      const b64 = `${props.profile_pic[0]}`;
      const header = "data:image/";
      // Filetype of the tuple profilePic
      const filetype = `${props.profile_pic[1]}`;
      const footer = ";base64, ";
      const ret = header.concat(filetype.concat(footer.concat(b64)));

      return ret;
    }
    return profilePic;
  }

  useEffect(() => {
    DetermineDeleteButton();
  }, [showDelete]);

  return (
    <Card className="comment">
      <Card.Header>
        <a
          href={`/user/${props.author_id}`}
          style={{textDecoration: "none", backgroundColor: "none", color: "black"}}
        >
          <b>{props.author}</b>
        </a>
        {showDelete ? (
          <div className="DeleteButton">
            <HoverText
              id="deleteCommentButton"
              helpfulText="Delete Comment"
              placement="left"
            >
              <Button
                onClick={DeleteComment}
                variant="light"
              >
                <Trash />
              </Button>
            </HoverText>
          </div>
          ) : (
            <></>
          )}
      </Card.Header>
      <Card.Body>
        <Row>
          <Col md="auto">
            <a href={`/user/${props.author_id}`}>
              <Card.Img
                src={getPic()}
                className="thumbnail"
                alt="userThumbnail" 
              />
            </a>
          </Col>
          <Col>
            <Card.Text>{props.message}</Card.Text>
          </Col>
        </Row>
      </Card.Body>
      <Card.Footer>
        <div
          onMouseOver={showExactDate}
          onMouseLeave={showTimeAfter}
          onFocus={showExactDate}
        >
          <small>{showingDate}</small>
        </div>
      </Card.Footer>
    </Card>
  );
}
