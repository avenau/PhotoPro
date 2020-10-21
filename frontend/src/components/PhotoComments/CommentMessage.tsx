import React from "react";
interface MessageProp {
    message: string;
    author: string
    datePosted: Date;
}

export default function CommentMessage(props: MessageProp) {

    return (
        <div>
            <p><b>{props.author}</b> posted 30 days ago</p>
            <p>{props.message}</p>
        </div>
    );
}