import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import CommentMessage from "./CommentMessage";
import "./PhotoComments.scss";
import axios from 'axios';

interface CommentProps {
    p_id: string;
}

export default function PhotoComments(props: CommentProps) {
    const [comments, setComments] = useState([]);
    const [commentDate, setDate] = useState(new Date());
    const [commentContent, setContent] = useState("");
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
                console.log(response);
            })
    }

    const getComments = async (photoId: string) => {
        let token = localStorage.getItem('token');
        await axios
            .get(`/comments/get_comments?p_id=${photoId}&token=${token}`)
            .then((response) => {
                /*console.log(response.data);
                var tempComments: object[] = [];
                console.log(response.data.comments);
                for (let comment of response.data.comments) {
                    console.log("Hi");
                    tempComments.push(JSON.parse(comment));

                }
                console.log("COMMENT TEST!");
                console.log(tempComments);
                setComments(tempComments);

                console.log(comments);*/

                console.log(response.data);
                var tempComments = [];
                console.log(response.data.comments);
                for (let comment of response.data.comments) {
                    console.log("Hi");
                    addComments(comment);

                }
                console.log("COMMENT TEST!");
                console.log(comments);

            });
    }

    useEffect(() => {
        getComments(props.p_id);
    }, []);



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
                    {comments.map((comment) => (
                        <><Row>
                            <CommentMessage message={comment['content']} author={comment['commenter']} datePosted={comment['datePosted']} />
                        </Row>
                        </>
                    ))}

                </Row>
            </Container>


        </div >
    );
}
