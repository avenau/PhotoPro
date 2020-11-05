import React, { useState, useEffect } from "react";
import { RouteChildrenProps , RouteComponentProps } from "react-router-dom";
import axios from "axios";
import {
  Button,
  Form,
  Modal,
  Container,
  Row,
  Col,
  Image,
} from "react-bootstrap";


// Functional components
import Title from "../components/PhotoEdit/Title";
import Toolbar from "../components/Toolbar/Toolbar";
import Price from "../components/PhotoEdit/Price";
import Tags from "../components/PhotoEdit/Tags";
import Album from "../components/PhotoEdit/Album";
import Discount from '../components/PhotoEdit/Discount'

export default function EditPhoto(props: any) {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState<number>();
  const [tags, setTags] = useState<string[]>();
  const [discount, setDiscount] = useState<number>();
  const [albums, setAlbums] = useState<string[]>();
  const [metadata, setMetaData] = useState<string>();

  const { params } = props.match;
  const [photoId, setPhotoId] = useState(Object.values(params)[0] as string);

  const [imagePreview, setPreview] = useState<string>();
  const [modalSave, setModalSave] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [loading, setLoading] = useState(true);

  // Original values to display on page
  const [originalVal, setOriginal] = useState({
    oTitle: title,
    oPrice: 0,
    oDiscount: 0,
    oAlbums: albums,
  });

  useEffect(() => {
    console.log("HEEELLLOOOOOO")
    console.log(photoId)
    checkDelete(photoId);
    getPhotoDetails(photoId);
  }, []);

  function handleSave(event: React.FormEvent<HTMLElement>) {
    event.preventDefault();
    const token = localStorage.getItem("token");
    console.log(albums)
    axios
      .put("/user/updatephoto", {
        title,
        price,
        tags: JSON.stringify(tags),
        albums: JSON.stringify(albums),
        discount,
        token,
        photoId,
      })
      .then((response) => {
        props.history.push(`/photo/${photoId}`);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleDelete(event: React.FormEvent<HTMLElement>) {
    // Navigate back to user profile
    const token = localStorage.getItem("token");
    if (token !== null) {
      const u_id = localStorage.getItem("u_id");
      axios
        .delete("/user/updatephoto", {
          params: {
            token,
            imgId: photoId,
          },
        })
        .then((response) => {
          props.history.push(`/user/${u_id}`);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  function checkDelete(photoId: string) {
    const token = localStorage.getItem("token");
    axios
      .get("/user/updatephoto/deleted", {
        params: {
          photoId,
          token,
        },
      })
      .then((response) => {
        console.log(response);
        if (response.data.deleted === true) {
          // Do not navigate to deleted page
          props.history.goBack();
        }
      })
      .catch((err) => {
        console.log(err);
        props.history.goBack();
      });
  }

  function getPhotoDetails(photoId: string) {
    const token = localStorage.getItem("token");
    axios
      .get("/user/updatephoto", {
        params: {
          photoId,
          token,
        },
      })
      .then((response) => {
        console.log(response.data);
        if (response.data.deleted === true) {
          // Do not navigate to deleted page
          props.history.goBack();
        }
        setTitle(response.data.title);
        setPrice(response.data.price);
        setTags(response.data.tags);
        setAlbums(response.data.albums);
        setDiscount(response.data.discount);
        setMetaData(response.data.metadata);

        setOriginal({
          oTitle: response.data.title,
          oPrice: response.data.price,
          oDiscount: response.data.discount,
          oAlbums: response.data.albums,
        });
        // Set image preview
        setPreview(response.data.metadata + response.data.photoStr);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        props.history.goBack();
      });
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
        <Toolbar />
        <Container className="mt-5">
          <h1>Edit Photo</h1>
          <Form>
            <Title 
              onChange={(title: string) => setTitle(title)}
              deactivateUploadButton={deactivateSaveButton}
              activateUploadButton={activateSaveButton}
              titleDef={title}
            />
            <p style={{fontSize: "13px"}}> Current photo title: <b>{originalVal.oTitle}</b> </p>
            <Price
              deactivateUploadButton={deactivateSaveButton}
              activateUploadButton={activateSaveButton}
              onChange={(price: number) => setPrice(price)}
              priceDef={price}
            />
            <p style={{fontSize: "13px"}}> Current price: <b>{originalVal.oPrice} credits</b> </p>
            <Tags
              deactivateUploadButton={deactivateSaveButton}
              activateUploadButton={activateSaveButton}
              tagsList={tags}
              setTagsList={(tagsList: any) => setTags(tagsList)}
            />
            <Discount
              deactivateUploadButton={deactivateSaveButton}
              activateUploadButton={activateSaveButton}
              discountDef={discount}
              price={price}
              oPrice={originalVal.oPrice}
              oDiscount={originalVal.oDiscount}
              onChange={(discount: number) => setDiscount(discount)}
            />
            <Row>
              <Col xs={6}>
                <Image
                  thumbnail
                  id="imagePreview"
                  src={imagePreview}
                />

              </Col>
              <Col>
                <Album 
                  setSelAlbums={(selAlbums: string[]) => {setAlbums(selAlbums)}}
                  selectedAlbums={albums}
                />
              </Col>
            </Row>
            <br />
            <Row>
              <Col>
                <Button id="saveButton" onClick={() => {setModalSave(true)}}>Save photo</Button>
              </Col>
              <Col>
                <Button id="delete" variant="danger" onClick={() => {setModalDelete(true)}}>Delete photo</Button>
              </Col>
            </Row>
            <br />
          </Form>
          <Modal show={modalSave} onHide={() => {setModalSave(false)}} animation={false}>
            <Modal.Header closeButton>
              <Modal.Title>Save photo</Modal.Title>
            </Modal.Header>
            <Modal.Body>Are you sure you want to make changes to your photo?!</Modal.Body>
            <Modal.Footer>
              <Button id="saveConfirmed" variant="primary" onClick={(e) => {handleSave(e)}}>Save photo</Button>
              <Button id="cancelSave" variant="secondary" onClick={() => {setModalSave(false)}}>Cancel</Button>
            </Modal.Footer>
          </Modal>
          <Modal show={modalDelete} onHide={() => {setModalDelete(false)}} animation={false}>
            <Modal.Header closeButton>
              <Modal.Title>Delete photo</Modal.Title>
            </Modal.Header>
            <Modal.Body>Are you sure you want to delete your photo? You cannot recover your photo after deletion</Modal.Body>
            <Modal.Footer>
              <Button id="deleteConfirmed" variant="danger" onClick={(e) => {handleDelete(e)}}>Delete photo</Button>
              <Button id="cancelDelete" variant="secondary" onClick={() => {setModalDelete(false)}}>Cancel</Button>
            </Modal.Footer>
          </Modal>
        </Container>
      </>
    )
}