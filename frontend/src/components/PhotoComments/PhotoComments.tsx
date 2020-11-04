import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
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
}

export default function PhotoComments(props: CommentProps) {
    const [comments, setComments] = useState<CommentObject[]>([]);
    const [commentDate, setDate] = useState(new Date());
    const [commentContent, setContent] = useState("");
    const [status, setStatus] = useState(false);
    const [limitMessage, setLimitMessage] = useState("");
    const [validComment, setValidComment] = useState(false);
    const addComments = async (comment: string) => {
        console.log("ADD COMMENTS");
        //console.log(comment);
        // console.log(JSON.parse(comment));
        setComments(comments.concat(JSON.parse(comment)));

        console.log(comments)
    }
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        setDate(new Date());
        let token = localStorage.getItem('token');
        let photoId = props.p_id;
        /* photoId: string
         userId: string(Commenter)
         posted: date
         content: string*/
        event.preventDefault();
        event.stopPropagation();
        console.log(token);
        console.log(photoId);
        axios.post('/comments/comment',
            {
                token,
                photoId,
                commentContent,
                commentDate,
            })
            .then((response) => {
                //console.log("PRINTING RESPONSE STATUS POST COMMENT");
                //console.log(response);
                clearCommentInput();
            })
    }

    const getComments = async (photoId: string) => {
        let token = localStorage.getItem('token');
        await axios
            .get(`/comments/get_comments?p_id=${photoId}&token=${token}`)
            .then((response) => {
                console.log(response.data);
                var tempComments: CommentObject[] = [];
                console.log(response.data.comments);
                for (let comment of response.data.comments) {
                    console.log("Hi");
                    tempComments.push(JSON.parse(comment));

                }
                console.log("COMMENT TEST!");
                console.log(tempComments);
                setComments(tempComments);
                console.log("Printing Comments");
                console.log(comments);
                setStatus(response.data.status);

                /*console.log(response.data);
                console.log(response.data.comments);
                for (let comment of response.data.comments) {
                    console.log("Hi");
                    addComments(comment);
                    console.log(comment);

                }
                console.log("COMMENT TEST!");
                console.log(comments);
                setStatus(response.data.status);*/

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
        //console.log("CHANGING");
        //console.log(value.length);
        if (value.length >= 8000) {
            setLimitMessage("Comments MUST be less than 8000 characters long!");
            setValidComment(true);
            console.log("OVER 8000");
        } else {
            setLimitMessage("");
            setValidComment(false);
        }
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
                </Form >
                <Row className="CommentDisplay">
                    {comments.map((comment) => (

                        <CommentMessage message={comment.content} author={comment.commenter} datePosted={comment.datePosted} />


                    ))}

                </Row>
            </Container>


        </div >
    );
}
