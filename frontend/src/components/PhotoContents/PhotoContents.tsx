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
    const [photo, setPhoto] = useState("");
    const [currentUser, setUser] = useState("No Id");
    const [purchased, setPurchase] = useState(false);
    //const [currentUser, setCurrentUser] = useState("Current User")
    //TODO: Use Verify Tokens For this
    //const currentUser = localStorage.getItem('u_id') as string;
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
                setPurchase(response.data.purchased);
                setTitle(response.data.title);
                setPhoto(response.data.pathToImg);
                setLoad(true);
            })
    }

    const getCurrentUser = async () => {
        await axios.get(`/get_current_user?token=${localStorage.getItem('token')}`)
            .then((response) => {
                if (response.data.u_id !== "false") {
                    setUser(response.data.u_id);
                }

            })
    }

    const isPurchased = async (photoId: string) => {
        await axios.get(`/photo_details/isPurchased?p_id=${photoId}&u_id=${currentUser}`)
            .then((response) => {
                if (response.data.isPurchased === true) {
                    setPurchase(true);
                } else {
                    setPurchase(false);
                }
            })
    }



    useEffect(() => {
        getPhotoDetails(props.photoId);
        getCurrentUser();
        isPurchased(props.photoId);
        console.log("Current User: " + currentUser);
        console.log("Purchased: " + purchased);
    }, [titleName, currentUser, purchased])

    function DetermineButton() {
        if (currentUser === "" || purchased === false) {
            return (
                <div><Button>Download Watermarked Photo</Button>
                    <Button>Purchase Photo</Button></div>

            )
        } else if (purchased === true) {
            return (
                <Button>Download Full Photo</Button>
            )
        }
    }





    return (
        isLoaded ?
            <div className="PhotoContents">
                <Container className="container">
                    <Row className="PhotoRow">
                        <img className="actualPhoto" src="https://scontent.fsyd8-1.fna.fbcdn.net/v/t1.0-9/121219614_3529427603766814_3815530349844701512_o.jpg?_nc_cat=111&ccb=2&_nc_sid=e3f864&_nc_ohc=Yc5BU7mBfcIAX-SBR2q&_nc_ht=scontent.fsyd8-1.fna&oh=fb9406ff6f5fbfa7136dc7930dc5c7fd&oe=5FBB9523" alt="new" />
                    </Row>
                    <Row className="PhotoInteraction">
                        <LikeButton u_id={currentUser} p_id={props.photoId} />
                        <BookmarkButton u_id={currentUser} p_id={props.photoId} />
                        <Button>Download Picture</Button>
                        <Button>Manage Photo</Button>
                    </Row>
                    <div className="ArtistInfo">
                        <Row>
                            <h2><b>{titleName}</b></h2>
                        </Row>
                        <Row>
                            by {nickname}
                        </Row>
                        <Row>
                            {email}
                        </Row>
                    </div>
                    <Row className="ContentRow">
                        <Col className="Details">
                            <Row>
                                <Button>Tags</Button>

                            </Row>
                            <Row>{tags.map((tag) => (
                                <><Button variant="secondary">{tag}</Button>{'  '}</>
                            ))}</Row>


                        </Col>
                    </Row>
                </Container>

            </div > : <div> <p>Still Loading</p> </div>
    );
}