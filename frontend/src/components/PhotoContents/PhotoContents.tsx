import React, { useEffect, useState } from "react";
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
    const [tags, setTags] = useState<string[]>([]);
    //const [currentUser, setCurrentUser] = useState("Current User")
    //TODO: Use Verify Tokens For this
    const currentUser = localStorage.getItem('u_id') as string;
    const updateTags = (tag: string) => {
        if (tag) {
            setTags(tags => [...tags, tag]);
        } else if (tag !== "") {
            setTags(tags => [...tags, tag]);
        }
    }


    const getPhotoDetails = async (photoId: string) => {
        await axios.get(`/photo_details?p_id=${photoId}`)
            .then((response) => {
                console.log(response.data);

                setNick(response.data.nickname);
                setEmail(response.data.email);
                setLikes(response.data.likes);
                setTags(response.data.tagsList);
                setTitle(response.data.title);
                setLoad(true);
            })
    }



    useEffect(() => {
        getPhotoDetails(props.photoId);
    }, [titleName])





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
                                <LikeButton u_id={currentUser} p_id={props.photoId} />
                                <BookmarkButton u_id={currentUser} p_id={props.photoId} />
                            </Row>
                            <Row>
                                <Button>Download Picture</Button>
                            </Row>
                            <Row>
                                <Button>Tags</Button>

                            </Row>
                            {tags.map((tag) => (
                                <Button variant="secondary"> {tag}</Button>
                            ))}
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