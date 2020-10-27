import React, { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import CommentMessage from "./CommentMessage";
import "./PhotoComments.scss";
import axios from 'axios';

interface CommentProps {
    p_id: string;
}

export default function PhotoComments(props: CommentProps) {
    const [comments, setComments] = useState(0);
    const [commentDate, setDate] = useState(new Date());
    const [commentContent, setContent] = useState("");
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
                <Row>
                    <CommentMessage message="Hello" author="dollaking" datePosted={commentDate} />
                </Row>
            </Container>


        </div >
    );
}