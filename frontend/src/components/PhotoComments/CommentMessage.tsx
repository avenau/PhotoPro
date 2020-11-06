import React, { useState } from "react";

interface MessageProp {
  message: string;
  author: string
  exact_date: string;
  time_after: string;
  className: string;
  author_id: string;

}


export default function CommentMessage(props: MessageProp) {
  const [showingDate, setDate] = useState(props.time_after);
  const showExactDate = () => {
    setDate(props.exact_date)
  }
  const showTimeAfter = () => {
    setDate(props.time_after)
  }
  return (
    <div className={props.className}>
      <div><b>{props.author}</b></div>
      <div>{props.message}</div>
      <br />
      <div onMouseOver={showExactDate} onMouseLeave={showTimeAfter}>{showingDate}</div>
    </div>
  );
}