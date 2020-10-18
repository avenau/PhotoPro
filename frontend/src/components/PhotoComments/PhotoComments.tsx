import React, { useState } from "react";
import { Button, Col, Form } from "react-bootstrap";
import "./PhotoComments.scss";

export default function PhotoComments() {
    const [comments, setComments] = useState(0);
    return (
        <div className="PhotoComments">
            <Form>
                <Form.Row>
                    <Col>
                        <Form.Control as="textarea" rows={4} placeholder="Add a comment..." />
                        <Button variant="primary" type="submit">
                            Comment
                        </Button>
                    </Col>
                </Form.Row>
            </Form >

        </div >
    );
}