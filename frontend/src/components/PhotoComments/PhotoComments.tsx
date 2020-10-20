import React, { useState } from "react";
import { Button, Col, Form } from "react-bootstrap";
import CommentMessage from "./CommentMessage";
import "./PhotoComments.scss";

export default function PhotoComments() {
    const [comments, setComments] = useState(0);
    let fakeDate = new Date(50000000)
    return (
        <div className="PhotoComments">
            <Form>
                <Form.Row id="commentTextArea">
                    <Col>
                        <Form.Control as="textarea" rows={4} placeholder="Add a comment..." />
                    </Col>
                    <Col>
                        <Button variant="primary" type="submit" className="commentButton">
                            Comment
                        </Button>
                    </Col>
                </Form.Row>
                <Form.Row>
                    <CommentMessage message="Hello" author="dollaking" datePosted={fakeDate} />
                </Form.Row>
            </Form >

        </div >
    );
}