import React, { useState } from "react";
import { Button, Col, Container, Dropdown, Form, Row } from "react-bootstrap";
import CommentMessage from "./CommentMessage";
import "./PhotoComments.scss";
import axios from "axios";
import _ from "lodash";
import PhotoContents from "../PhotoContents/PhotoContents";

interface CommentObject {
  content: string;
  datePosted: string;
  commenter: string;
  commenter_id: string;
  exact_time: string;
  time_after: string;
  comment_id: string;
  profile_pic: string[];
}

interface CommentProps {
  p_id: string;
  comments: CommentObject[];
}

export default function PhotoComments(props: CommentProps) {
  const [comments, setComments] = useState<CommentObject[]>(props.comments);
  const [limitMessage, setLimitMessage] = useState("");
  const [validComment, setValidComment] = useState(false);
  const [commentDate, setDate] = useState(new Date());
  const [commentContent, setContent] = useState("");
  const [new_to_old, setOrder] = useState(true);
  const [status, setStatus] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    setDate(new Date());
    const token = localStorage.getItem("token");
    const photoId = props.p_id;
    event.preventDefault();
    event.stopPropagation();
    if (commentContent.length > 0) {
      axios
        .post("/comments/postcomment", {
          token,
          photoId,
          commentContent,
          commentDate,
        })
        .then(() => {
          clearCommentInput();
          getComments(photoId, new_to_old);
        })
        .catch(()=>{});
    }
  };

   // Order is newest to oldest then true
   const getComments = async (photoId: string, order: boolean) => {
    await axios
      .get(`/comments/get_comments?p_id=${photoId}&new_to_old=${order}`)
      .then((response) => {
        const tempComments: CommentObject[] = [];
        for (const comment of response.data.comments) {
          tempComments.push(JSON.parse(comment));
        }
        setComments(tempComments);
        setStatus(response.data.status);
      })
      .catch(()=>{});
  };

  function clearCommentInput() {
    const commentInput = document.getElementById(
      "CommentInput"
    ) as HTMLInputElement;
    commentInput.value = "";
    setContent("");
  }

  const changeFunction = (value: string) => {
    setContent(value);
    if (value.length >= 8000) {
      setLimitMessage("Comments MUST be less than 8000 characters long!");
      setValidComment(true);
    } else {
      setLimitMessage("");
      setValidComment(false);
    }
  };

  const sortCommentNewest = async () => {
    setOrder(true);
    getComments(props.p_id, true);
  };

  const sortCommentOldest = async () => {
    setOrder(false);
    getComments(props.p_id, false);
  };

  

  return (
    <div className="PhotoComments">
      <Container className="container">
        <h3>Comments</h3>
        <Form onSubmit={handleSubmit}>
          <Form.Row id="commentTextArea">
            <Col>
              <Form.Control
                id="CommentInput"
                as="textarea"
                rows={4}
                onChange={(e) => changeFunction(e.target.value)}
                placeholder="Add a comment..."
              />
              <Form.Text id="WarningMessage" muted>
                {limitMessage}
              </Form.Text>
            </Col>
            <Col>
              <Button
                disabled={validComment}
                variant="primary"
                type="submit"
                className="commentButton"
              >
                Comment
              </Button>
            </Col>
          </Form.Row>
        </Form>
        <Dropdown>
          <br />
          <Dropdown.Toggle
            variant="outline-dark"
            id="dropdown-custom-components"
            className="sort"
          >
            <span>Sort Comments By</span>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item
              as="button"
              onClick={() => {
                sortCommentNewest();
              }}
            >
              Newest To Oldest
            </Dropdown.Item>
            <Dropdown.Item
              as="button"
              onClick={() => {
                sortCommentOldest();
              }}
            >
              Oldest To Newest
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Row className="CommentDisplay">
          {comments.map((comment) => (
            <CommentMessage
              author_id={comment.commenter_id}
              message={comment.content}
              author={comment.commenter}
              exact_date={comment.exact_time}
              time_after={comment.time_after}
              comment_id={comment.comment_id}
              photo_id={props.p_id}
              profile_pic={comment.profile_pic}
              key={comment.comment_id}
              getComments={getComments}
              new_to_old={new_to_old}
            />
          ))}
        </Row>
      </Container>
    </div>
  );
}
