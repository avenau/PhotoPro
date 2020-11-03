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
    const addComments = async (comment: string) => {
        console.log("ADD COMMENTS");
        //console.log(comment);
        // console.log(JSON.parse(comment));
        setComments(comments.concat(JSON.parse(comment)));

        console.log(comments)
    }
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        setDate(new Date());
        let currentUser = localStorage.getItem('u_id');
        let photoId = props.p_id;
        /* photoId: string
         userId: string(Commenter)
         posted: date
         content: string*/
        event.preventDefault();
        event.stopPropagation();
        console.log(currentUser);
        console.log(photoId);
        axios.post('/comments/comment',
            {
                currentUser,
                photoId,
                commentContent,
                commentDate,
            })
            .then((response) => {
                console.log(response);
            })
    }

    const getComments = async (photoId: string) => {
        await axios
            .get(`/comments/get_comments?p_id=${photoId}`)
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



    return (
        <div className="PhotoComments">
            <Container className="container">
                <Form onSubmit={handleSubmit}>
                    <Form.Row id="commentTextArea">
                        <Col>
                            <Form.Control as="textarea" rows={4} onChange={(e) => setContent(e.target.value)} placeholder="Add a comment..." />
                        </Col>
                        <Col>
                            <Button variant="primary" type="submit" className="commentButton">
                                Comment
                            </Button>
                        </Col>
                    </Form.Row>
                </Form >
                <Row className="CommentDisplay">
                    {comments.map((comment) => (

                        {/*} <CommentMessage message={comment.content} author={comment.commenter} datePosted={comment.datePosted} /> */ }


                    ))}

                </Row>
            </Container>


        </div >
    );
}