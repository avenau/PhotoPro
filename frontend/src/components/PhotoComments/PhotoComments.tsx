import React, { useEffect, useState } from "react";
import { Button, Col, Container, Dropdown, Form, Row } from "react-bootstrap";
import CommentMessage from "./CommentMessage";
import "./PhotoComments.scss";
import axios from 'axios';

interface CommentProps {
  p_id: string;
}

interface CommentObject {
  content: string,
  datePosted: string,
  commenter: string,
  commenter_id: string,
  exact_time: string,
  time_after: string,
  comment_id: string,
  profile_pic: string[]
}

export default function PhotoComments(props: CommentProps) {
  const [comments, setComments] = useState<CommentObject[]>([]);
  const [commentDate, setDate] = useState(new Date());
  const [commentContent, setContent] = useState("");
  const [status, setStatus] = useState(false);
  const [limitMessage, setLimitMessage] = useState("");
  const [validComment, setValidComment] = useState(false);
  const [new_to_old, setOrder] = useState(true);
  //const [profilePic, setProfilePic] = useState(["", ""]);
  const addComments = async (comment: string) => {
    setComments(comments.concat(JSON.parse(comment)));

  }
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    setDate(new Date());
    const token = localStorage.getItem('token');
    const photoId = props.p_id;
    /* photoId: string
     userId: string(Commenter)
     posted: date
     content: string */
    event.preventDefault();
    event.stopPropagation();
    axios.post('/comments/comment',
      {
        token,
        photoId,
        commentContent,
        commentDate,
      })
      .then((response) => {
        clearCommentInput();
        getComments(photoId);
      })
  }

  const getComments = async (photoId: string) => {
    const token = localStorage.getItem('token');
    await axios
      .get(`/comments/get_comments?p_id=${photoId}&new_to_old=${new_to_old}`)
      .then((response) => {
        const tempComments: CommentObject[] = [];
        for (const comment of response.data.comments) {
          tempComments.push(JSON.parse(comment));

        }
        setComments(tempComments);
        setStatus(response.data.status);

      });
  }

  useEffect(() => {
    getComments(props.p_id);
  }, [status]);

  function clearCommentInput() {
    const commentInput = document.getElementById("CommentInput") as HTMLInputElement;
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
  }

  const sortCommentNewest = async () => {
    setOrder(true);
    getComments(props.p_id);
  }

  const sortCommentOldest = async () => {
    setOrder(false);
    getComments(props.p_id);
  }


  return (
    <div className="PhotoComments">
      <Container className="container">
        <Form onSubmit={handleSubmit}>
          <Form.Row id="commentTextArea">
            <Col>
              <Form.Control id="CommentInput" as="textarea" rows={4} onChange={(e) => changeFunction(e.target.value)} placeholder="Add a comment..." />
              <Form.Text id="WarningMessage" muted>{limitMessage}</Form.Text>
            </Col>
            <Col>
              <Button disabled={validComment} variant="primary" type="submit" className="commentButton">
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
            style={{
              fontSize: "12pt",
              padding: "0rem 0.2rem",
              lineHeight: "20pt",
            }}
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
            <CommentMessage className="CommentMessages" author_id={comment.commenter_id} message={comment.content} author={comment.commenter} exact_date={comment.exact_time} time_after={comment.time_after} comment_id={comment.comment_id} photo_id={props.p_id} get_comments={getComments} profile_pic={comment.profile_pic} />

          ))}

        </Row>
      </Container>


    </div>
  );
}
