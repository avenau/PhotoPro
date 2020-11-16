import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  Image,
  Modal,
  Row,
} from "react-bootstrap";
import LoadingButton from "../components/LoadingButton/LoadingButton";
import Album from "../components/PhotoEdit/Album";
import Discount from "../components/PhotoEdit/Discount";
import Price from "../components/PhotoEdit/Price";
import Tags from "../components/PhotoEdit/Tags";
// Functional components
import Title from "../components/PhotoEdit/Title";
import LoadingPage from "./LoadingPage";
import BackButton from "../components/BackButton/BackButton";

export default function EditPhoto(props: any) {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState<number>();
  const [tags, setTags] = useState<string[]>();
  const [discount, setDiscount] = useState<number>();
  const [albums, setAlbums] = useState<string[]>();

  const { params } = props.match;
  const [photoId] = useState(Object.values(params)[0] as string);

  const [imagePreview, setPreview] = useState<string>();
  const [modalSave, setModalSave] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);

  // Original values to display on page
  const [originalVal, setOriginal] = useState({
    oTitle: title,
    oPrice: 0,
    oDiscount: 0,
    oAlbums: albums,
  });

  useEffect(() => {
    checkDelete(photoId);
    getPhotoDetails(photoId);
  }, []);

  function handleSave(event: React.FormEvent<HTMLElement>) {
    event.preventDefault();
    const token = localStorage.getItem("token");
    setSaveLoading(true);
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
      .then(() => {
        setSaveLoading(false);
        props.history.push(`/photo/${photoId}`);
      })
      .catch(() => {
        setSaveLoading(false);
      });
  }

  function handleDelete() {
    // Navigate back to user profile
    const token = localStorage.getItem("token");
    if (token !== null) {
      const uId = localStorage.getItem("u_id");
      axios
        .delete("/user/updatephoto", {
          params: {
            token,
            imgId: photoId,
          },
        })
        .then(() => {
          props.history.push(`/user/${uId}`);
        })
        .catch(() => {});
    }
  }

  function checkDelete(pId: string) {
    const token = localStorage.getItem("token");
    axios
      .get("/user/updatephoto/deleted", {
        params: {
          photoId: pId,
          token,
        },
      })
      .then((response) => {
        if (response.data.deleted === true) {
          // Do not navigate to deleted page
          props.history.goBack();
        }
      })
      .catch(() => {
        props.history.goBack();
      });
  }

  function getPhotoDetails(pId: string) {
    const token = localStorage.getItem("token");
    axios
      .get("/user/updatephoto", {
        params: {
          photoId: pId,
          token,
        },
      })
      .then((response) => {
        if (response.data.deleted === true) {
          // Do not navigate to deleted page
          props.history.goBack();
        }
        setTitle(response.data.title);
        setPrice(response.data.price);
        setTags(response.data.tags);
        setAlbums(response.data.albums);
        setDiscount(response.data.discount);

        setOriginal({
          oTitle: response.data.title,
          oPrice: response.data.price,
          oDiscount: response.data.discount,
          oAlbums: response.data.albums,
        });
        // Set image preview
        setPreview(response.data.metadata + response.data.photoStr);
        setLoading(false);
        document.title = `Manage ${response.data.title} | PhotoPro`;
      })
      .catch(() => {
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

  return loading ? (
    <LoadingPage />
  ) : (
    <>
      <BackButton href={`/photo/${photoId}`} label="Back to Details Page" />
      <Container>
        <h1>Edit Photo</h1>
        <Form>
          <Title
            titleType="Photo"
            onChange={(newTitle: string) => setTitle(newTitle)}
            deactivateUploadButton={deactivateSaveButton}
            activateUploadButton={activateSaveButton}
            titleDef={title}
          />
          <p style={{ fontSize: "13px" }}>
            {" "}
            Current photo title: <b>{originalVal.oTitle}</b>{" "}
          </p>
          <Price
            deactivateUploadButton={deactivateSaveButton}
            activateUploadButton={activateSaveButton}
            onChange={(newPrice: number) => setPrice(newPrice)}
            priceDef={price}
          />
          <p style={{ fontSize: "13px" }}>
            {" "}
            Current price: <b>{originalVal.oPrice} credits</b>{" "}
          </p>
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
            onChange={(newDiscount: number) => setDiscount(newDiscount)}
          />
          <Row>
            <Col xs={6}>
              <Image thumbnail id="imagePreview" src={imagePreview} />
            </Col>
            <Col>
              <Album
                setSelAlbums={(selAlbums: string[]) => {
                  setAlbums(selAlbums);
                }}
                selectedAlbums={albums}
              />
            </Col>
          </Row>
          <br />
          <Row>
            <Col>
              <Button
                id="saveButton"
                onClick={() => {
                  setModalSave(true);
                }}
              >
                Save photo
              </Button>
            </Col>
            <Col>
              <Button
                id="delete"
                variant="danger"
                onClick={() => {
                  setModalDelete(true);
                }}
              >
                Delete photo
              </Button>
            </Col>
          </Row>
          <br />
        </Form>
        <Modal
          show={modalSave}
          onHide={() => {
            setModalSave(false);
          }}
          animation={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Save photo</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to make changes to your photo?!
          </Modal.Body>
          <Modal.Footer>
            <LoadingButton
              loading={saveLoading}
              id="saveConfirmed"
              variant="primary"
              onClick={(e) => {
                handleSave(e);
              }}
            >
              Save photo
            </LoadingButton>
            <Button
              id="cancelSave"
              variant="secondary"
              onClick={() => {
                setModalSave(false);
              }}
            >
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal
          show={modalDelete}
          onHide={() => {
            setModalDelete(false);
          }}
          animation={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Delete photo</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete your photo? You cannot recover your
            photo after deletion
          </Modal.Body>
          <Modal.Footer>
            <Button
              id="deleteConfirmed"
              variant="danger"
              onClick={() => {
                handleDelete();
              }}
            >
              Delete photo
            </Button>
            <Button
              id="cancelDelete"
              variant="secondary"
              onClick={() => {
                setModalDelete(false);
              }}
            >
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
}
