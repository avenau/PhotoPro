import React, { useEffect, useState } from "react";
import { Button, Col, Container, Dropdown, Form, Row } from "react-bootstrap";
//import CommentMessage from "./CommentMessage";
import "./PhotoComments.scss";
import axios from 'axios';
import _ from "lodash";
import profilePic from "../../static/profile-pic.png";

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

interface MessageProp {
  message: string;
  author: string
  exact_date: string;
  time_after: string;
  className: string;
  author_id: string;
  comment_id: string;
  photo_id: string;
  get_comments: Function;
  profile_pic: string[];
}

export default function PhotoComments(props: CommentProps) {
  const [comments, setComments] = useState<CommentObject[]>([]);
  const [commentDate, setDate] = useState(new Date());
  const [commentContent, setContent] = useState("");
  const [status, setStatus] = useState(false);
  const [limitMessage, setLimitMessage] = useState("");
  const [validComment, setValidComment] = useState(false);
  const [new_to_old, setOrder] = useState(true);
  const addComments = async (comment: string) => {
    setComments(comments.concat(JSON.parse(comment)));

  }
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    setDate(new Date());
    const token = localStorage.getItem('token');
    const photoId = props.p_id;
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
        getComments(photoId, new_to_old);
      })
  }

  //Order is newest to oldest then true
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

      });
  }

  useEffect(() => {
    getComments(props.p_id, true);
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
    getComments(props.p_id, true);
  }

  const sortCommentOldest = async () => {
    setOrder(false);
    getComments(props.p_id, false);
  }

  function CommentMessage(props: MessageProp) {
    const [showingDate, setDate] = useState(props.time_after);
    const [showDelete, setDelete] = useState(false);
    const currentUser = localStorage.getItem('u_id') as string
    const showExactDate = () => {
      setDate(props.exact_date)
    }
    const showTimeAfter = () => {
      setDate(props.time_after)
    }

    function DetermineDeleteButton() {

      if (currentUser === props.author_id) {
        setDelete(true);
      }
    }

    const DeleteComment = () => {
      const token = localStorage.getItem('token');
      const c_id = props.comment_id;
      const p_id = props.photo_id

      axios.post('/comments/delete_comments',
        {
          token,
          c_id,
          p_id,
        })
        .then((response) => {
          getComments(p_id, new_to_old);
        })
    }

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
      <div className={props.className}>
        <div>
          <img src={getPic()} className="image" />

          <Button className="DeleteButton" variant="light" onClick={DeleteComment}>
            {showDelete ? <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-trash-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5a.5.5 0 0 0-1 0v7a.5.5 0 0 0 1 0v-7z" />
            </svg> : ''}
          </Button>
        </div>
        <b>{props.author}</b>
        <div>{props.message}</div>


        <br />
        <div onMouseOver={showExactDate} onMouseLeave={showTimeAfter}>{showingDate}</div>
      </div>
    );
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
