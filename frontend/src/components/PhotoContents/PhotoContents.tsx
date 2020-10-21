import React, { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import BookmarkButton from "../BookmarkButton";
import LikeButton from "../LikeButton";
import "./PhotoContents.scss";
import axios from "axios";

interface ContentProps {
    photoId: string,
}

export default function PhotoContents(props: ContentProps) {

    const [titleName, setTitle] = useState('Photo Title');
    const [nickname, setNick] = useState('Artist Nickname');
    const [email, setEmail] = useState('Artist Email');
    const [likes, setLikes] = useState(0);
    const [isLoaded, setLoad] = useState(false);

    async function getPhotoDetails(photoId: string) {
        axios.get(`/photo_details?p_id=${photoId}`)
            .then((response) => {
                console.log(response.data);
                setTitle(response.data.title);
                setNick(response.data.nickname);
                setEmail(response.data.email);
                setLikes(response.data.likes);
                setLoad(true);
            })
    }
    getPhotoDetails(props.photoId);




    return (
        isLoaded ?
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
                                <LikeButton u_id="user_id" p_id="photo_id" likeCount={likes} />
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

            </div> : <div> <p>Still Loading</p> </div>
    );
}