import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import axios from 'axios';
import _ from "lodash";
import profilePic from "../../static/profile-pic.png";
import "./CommentMessage.scss";

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


export default function CommentMessage(props: MessageProp) {
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
    console.log("CHECKING IDSSSS")
    console.log(currentUser)
    console.log(props.author_id);
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
        //props.get_comments();
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