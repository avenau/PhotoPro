import React from "react";
import { Row } from "react-bootstrap";
interface MessageProp {
    message: string;
    author: string
    datePosted: Date;
}

export default function CommentMessage(props: MessageProp) {

    return (
        <div>
            <Row><p><b>{props.author}</b> </p></Row>
            <Row>{props.message}</Row>
        </div>
    );
}