import React, { useState, useEffect } from 'react'
import { RouteChildrenProps } from "react-router-dom";
import axios from "axios";
import { Button, Form, Modal, Container, Row, Col, Image } from 'react-bootstrap';

// Functional components
import Title from "../components/Photo/Title";
import Toolbar from "../components/Toolbar/Toolbar";
import Price from "../components/Photo/Price";
import Tags from "../components/Photo/Tags";
import Album from "../components/Photo/Album";
import AlbumList from '../components/ProfileLists/AlbumList';


export default function EditPhoto(props: any) {
    const [title, setTitle] = useState("")
    const [price, setPrice] = useState<number>()
    const [tags, setTags] = useState<string[]>()
    const [discount, setDiscount] = useState("")
    const [albums, setAlbums] = useState<string[]>()
    const [photoId, setPhotoId] = useState("5f94554463aa81c7b0cd57ed")
    const [metadata, setMetaData] = useState<string>()

    const [imagePreview, setPreview] = useState<string>()
    const [modalSave, setModalSave] = useState(false)
    const [modalDelete, setModalDelete] = useState(false)
    const [loading, setLoading] = useState(false)

    const token = localStorage.getItem("token");
    console.log("photoid", photoId)
    console.log("token", token)

    useEffect(() => {
        console.log('start')
        getPhotoDetails(photoId)
        console.log("in use effect")
    }, [])

    function handleSave(event: React.FormEvent<HTMLElement>) {
        event.preventDefault();
        const token = localStorage.getItem("token");
        axios.put('/user/updatephoto', {
            title: title,
            price: price,
            tags: tags,
            albums: albums, 
            discount: discount,
            token: token,
            photoId: photoId
        })
        .then((response) => {
            props.history.push(`/photo/${photoId}`)
        })
        .catch((err) => {
            console.log(err)
        })
    }

    function handleDelete(event: React.FormEvent<HTMLElement>) {
        // Call Joe's method to delete photo/set deleted flag
        // Navigate back to user profile
        const uid = localStorage.getItem("u_id");
        props.history.push(`/photo/${uid}`)
        console.log("Not deleted yet, but in handleDelete")
    }

    function getPhotoDetails(photoId: string) {
        const token = localStorage.getItem("token");
        setLoading(true)
        console.log("photoid", photoId)
        console.log("token", token)
        axios.get('/user/updatephoto', {params: {
            photoId: photoId,
            token: token
        }})
        .then((response) => {
            console.log(response.data);
            setLoading(false)
            setTitle(response.data.title);
            setPrice(response.data.price);
            setTags(response.data.tags);
            setAlbums(response.data.albums);
            setDiscount(response.data.discount);
            setMetaData(response.data.metadata);

            // Set image preview
            setPreview(response.data.metadata + response.data.photoStr.replace("b'", "").slice(0,-1));
        })
        .catch((err) => {
            console.log(err)
            setLoading(false)
        })
    }
    
    function activateSaveButton() {
        const btn = document.getElementById("saveButton");
        return btn?.removeAttribute("disabled");
    }
    
    function deactivateSaveButton() {
        const btn = document.getElementById("saveButton");
        return btn?.setAttribute("disabled", "true");
    }

    return loading ? (<div>Loading...</div>) : (
        <>
        <Toolbar/>
        <Container className="mt-5">
            <h1>Edit Photo</h1>
            <Form>
                <Title 
                    onChange={(title: string) => setTitle(title)}
                    deactivateUploadButton={deactivateSaveButton}
                    activateUploadButton={activateSaveButton}
                    titleDef={title}/>
                <Price
                    deactivateUploadButton={deactivateSaveButton}
                    activateUploadButton={activateSaveButton}
                    onChange={(price: number) => setPrice(price)}
                    priceDef={price}/>
                <Tags
                    deactivateUploadButton={deactivateSaveButton}
                    activateUploadButton={activateSaveButton}
                    tagsList={tags}
                    setTagsList={(tagsList: any) => setTags(tagsList)}/>
                <Row>
                  <Col xs={6}>
                    <Image
                      thumbnail
                      id="imagePreview"
                      src={imagePreview}/>
                  </Col>
                  <Col>
                    <Album setAlbums={(albums: string[]) => {setAlbums(albums)}}/>
                    <Row>
                      <Col>
                        <Button>Create a new album</Button>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row>
                    <Col>
                        <Button id="saveButton" onClick={() => {setModalSave(true)}}>Save photo</Button>
                    </Col>
                    <Col>
                        <Button id="delete" variant="danger" onClick={() => {setModalDelete(true)}}>Delete photo</Button>
                    </Col>
                </Row>
            </Form>
            <Modal show={modalSave} onHide={() => {setModalSave(false)}} animation={false}>
                <Container>
                    <h3>Are you sure you want to make changes to your photo?</h3>
                    <Row>
                    <Col>
                        <Button id="saveConfirmed" variant="secondary" onClick={(e) => {handleSave(e)}}>Save photo</Button>
                    </Col>
                    <Col>
                        <Button id="cancelSave" variant="danger" onClick={() => {setModalSave(false)}}>Cancel</Button>
                    </Col>
                    </Row>
                </Container>
            </Modal>
            <Modal show={modalDelete} onHide={() => {setModalDelete(false)}} animation={false}>
                <Container>
                    <h3>Are you sure you want to delete your photo?</h3>
                    <h4>You cannot recover your photo after deletion</h4>
                    <Row>
                    <Col>
                        <Button id="deleteConfirmed" variant="danger" onClick={(e) => {handleDelete(e)}}>Delete photo</Button>
                    </Col>
                    <Col>
                        <Button id="cancelDelete" variant="secondary" onClick={() => {setModalSave(false)}}>Cancel</Button>
                    </Col>
                    </Row>
                </Container>
            </Modal>
        </Container>
        </>
    )
}