import React, { useEffect, useState } from "react";
import axios from "axios";
import _ from "lodash";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button"
import profilePic from "../../static/profile-pic.png";
import "./CommentMessage.scss";
import { Row, Col, Container } from "react-bootstrap";


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
      .then((response) => {
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
    <div className="comment">
      <Row>
        <Col>
          <Container>
            <Row>
              <Link to={`/user/${props.author_id}`}>
                <img src={getPic()} className="thumbnail" />
              </Link>
            </Row>
            <Row>
              <a href={`/user/${props.author_id}`}>
                <b>{props.author}</b>
              </a>
            </Row>
          </Container>
        </Col>
        <Col xs={9}>
          <div>{props.message}</div>
        </Col>
        <Col>
          {showDelete ? 
            <Button
              className="DeleteButton"
              variant="light"
              onClick={DeleteComment}
            >
              <svg
                width="1em"
                height="1em"
                viewBox="0 0 16 16"
                className="bi bi-trash-fill"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5a.5.5 0 0 0-1 0v7a.5.5 0 0 0 1 0v-7z"
                />
              </svg>
            </Button>
            :
            <></>
          }
        </Col>
      </Row>
      <Row className="time">
        <div onMouseOver={showExactDate} onMouseLeave={showTimeAfter}>
          {showingDate}
        </div>
      </Row>
    </div>
  );
}