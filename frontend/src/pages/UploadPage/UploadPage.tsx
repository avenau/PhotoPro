import React from "react";
import "./UploadPage.css";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import { RouteChildrenProps } from "react-router-dom";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Toolbar from "../../components/Toolbar/Toolbar";

// Functional components
import Title from "../../components/PhotoEdit/Title";
import Price from "../../components/PhotoEdit/Price";
import Tags from "../../components/PhotoEdit/Tags";
import Album from "../../components/PhotoEdit/Album";
import FileUpload from "../../components/PhotoEdit/FileUpload";

class UploadPage extends React.Component<RouteChildrenProps, any> {
  constructor(props: RouteChildrenProps) {
    super(props);
    this.state = {
      title: "",
      price: 0,
      /** 'tagsList' is the current list of tags attached to the photo,
             which will eventaully be sent to the back end */
      tagsList: [],
      /** Whether the user has selected a photo yet.
            Used to display "Upload Photo" button. */
      hasPickedPhoto: false,
      imagePreview: null,
      albums: [],
      photoElement: "",
    };
    this.setState = this.setState.bind(this);
    this.activateUploadButton = this.activateUploadButton.bind(this);
    this.deactivateUploadButton = this.deactivateUploadButton.bind(this);
  }

  setPhoto() {
    return new Promise((resolve, reject) => {
      const fileInput = this.state.photoElement as HTMLInputElement;
      if (fileInput.files && fileInput.files[0]) {
        const thePhotoFile = fileInput.files[0];
        const photoFileName = thePhotoFile.name;
        const match = photoFileName.toLowerCase().match(/\.[^\.]*$/);
        const photoExtension = match !== null ? match[0] : "";
        const reader = new FileReader();
        reader.readAsDataURL(thePhotoFile);
        reader.onload = () => resolve([reader.result, photoExtension]);
        reader.onerror = (err) => reject(err);
      }
    });
  }

  handleSubmit(event: React.FormEvent<HTMLElement>) {
    event.preventDefault();
    if (this.state.tagsList.length < 1) {
      return;
    }
    this.setPhoto().then((response: any) => {
      const token = localStorage.getItem("token");
      axios
        .post("/user/uploadphoto", {
          title: this.state.title,
          price: this.state.price,
          tags: JSON.stringify(this.state.tagsList),
          albums: JSON.stringify(this.state.albums),
          // The photo, encoded as a base64 string
          photo: response[0],
          // The file extension e.g. ".jpg"
          extension: response[1],
          token,
        })
        .then((response) => {
          const uid = localStorage.getItem("u_id");
          this.props.history.push(`/user/${uid}`);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }

  activateUploadButton() {
    const btn = document.getElementById("uploadButton");
    return btn?.removeAttribute("disabled");
  }

  deactivateUploadButton() {
    const btn = document.getElementById("uploadButton");
    return btn?.setAttribute("disabled", "true");
  }

  render() {
    return (
      <div className="uploadPage">
        <Toolbar />
        <Container className="mt-5">
          <h1>Upload Photo</h1>
          <Form onSubmit={(e) => this.handleSubmit(e)}>
            <Title
              deactivateUploadButton={this.deactivateUploadButton}
              activateUploadButton={this.activateUploadButton}
              onChange={(title: string) => this.setState({ title })}
              titleDef=""
            />
            <Price
              deactivateUploadButton={this.deactivateUploadButton}
              activateUploadButton={this.activateUploadButton}
              onChange={(price: number) => this.setState({ price })}
            />
            <Tags
              deactivateUploadButton={this.deactivateUploadButton}
              activateUploadButton={this.activateUploadButton}
              tagsList={this.state.tagsList}
              setTagsList={(tagsList: any) => this.setState({ tagsList })}
            />
            <FileUpload
              deactivateUploadButton={this.deactivateUploadButton}
              activateUploadButton={this.activateUploadButton}
              onChange={(photo: HTMLElement | null) =>
                this.setState({ photoElement: photo })
              }
              setPreview={(preview: string) =>
                this.setState({ imagePreview: preview })
              }
              pickedPhoto={(selectedPhoto) =>
                this.setState({ hasPickedPhoto: selectedPhoto })
              }
              label="Select a photo"
            />
            {this.state.hasPickedPhoto ? (
              <div>
                <Row>
                  <Col xs={6}>
                    <Image
                      thumbnail
                      id="imagePreview"
                      src={this.state.imagePreview}
                    />
                  </Col>
                  <Col>
                    <Album
                      setSelAlbums={(selAlbums: string[]) => {
                        this.setState({ albums: selAlbums });
                      }}
                      selectedAlbums={this.state.albums}
                    />
                  </Col>
                </Row>
                <Button id="uploadButton" className="mt-2" type="submit">
                  Upload Photo
                </Button>
              </div>
            ) : (
                <></>
              )}
          </Form>
        </Container>
      </div>
    );
  }
}

export default UploadPage;
