import React, { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import BookmarkButton from "../BookmarkButton";
import LikeButton from "../LikeButton";
import "./PhotoContents.scss";

export default function PhotoContents() {
    const [titleName, setTitle] = useState('Photo Title');
    const [nickname, setNick] = useState('Artist Nickname');
    const [email, setEmail] = useState('Artist Email');

    return (
        <div className="PhotoContents">
            <Container>
                <p>{titleName}</p>
                <Row className="ContentRow">
                    <Col className="PhotoRow">
                        This is where Picture is
                    </Col>
                    <Col className="Details">
                        <p>This is where all the rest of the buttons are at</p>
                        <Row className="RowOne">
                            <LikeButton u_id="user_id" p_id="photo_id" />
                            <BookmarkButton u_id="user_id" p_id="photo_id" />
                        </Row>
                        <Row>
                            <Button>Download Picture</Button>
                        </Row>
                        <Row>
                            <Button>Tags</Button>
                        </Row>
                        <Row>
                            by {nickname}
                        </Row>
                        <Row>
                            {email}
                        </Row>
                    </Col>
                </Row>
            </Container>

        </div>
    );
}