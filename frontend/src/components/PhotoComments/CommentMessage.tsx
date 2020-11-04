import React from "react";
import { Row } from "react-bootstrap";
interface MessageProp {
    message: string;
    author: string
    datePosted: string;
    className: string;
}

export default function CommentMessage(props: MessageProp) {

    return (
        <div className={props.className}>
            <div><b>{props.author}</b></div>
            <div>{props.message}</div>
        </div>
    );
}