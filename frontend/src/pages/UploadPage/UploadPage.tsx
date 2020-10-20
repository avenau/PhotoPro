import React from "react";
import "./UploadPage.css"
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import Image from "react-bootstrap/Image"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Dropdown from "react-bootstrap/Dropdown"
import Toolbar from "../../components/Toolbar/Toolbar"
import { RouteChildrenProps } from "react-router-dom";
import axios from 'axios';

// Functional components
import Title from "../../components/Photo/Title"
import Price from "../../components/Photo/Price"
import Tags from "../../components/Photo/Tags"

export default class UploadPage extends React.Component<RouteChildrenProps, any> {
    constructor(props: RouteChildrenProps) {
      super(props);
      this.state = {
        title: "",
        price: 0,
        /**  'tags' is the current state of the 'tags' input field */
        tags: "",
        /** 'tagsList' is the current list of tags attached to the photo, 
             which will eventaully be sent to the back end */
        tagsList: [],
        tagButtons: [],
        /** Whether the user has selected a photo yet.
            Used to display "Upload Photo" button. */
        hasPickedPhoto: false,
        imagePreview: null,
        albumsToAddTo: [],
        tempAlbums: ["College Dropout", "Late Registration", "Graduation"],
        photo: "",
        titleErrMsg: "",
        priceErrMsg: "",
        tagsErrMsg: "",
        fileErrMsg: ""
      };
      this.setState = this.setState.bind(this);
      this.activateUploadButton = this.activateUploadButton.bind(this)
      this.deactivateUploadButton = this.deactivateUploadButton.bind(this)
    }

    setPhoto() {
      return new Promise((resolve, reject) => {
        const fileInput = document.getElementById("photo") as HTMLInputElement;
        if (fileInput.files && fileInput.files[0]) {
          const thePhotoFile = fileInput.files[0];
          const photoFileName = thePhotoFile.name;
          const photoExtension = photoFileName.substr(photoFileName.length - 4)
          const reader = new FileReader();
          reader.readAsDataURL(thePhotoFile);
          reader.onload = () => resolve([reader.result, photoExtension]);
          reader.onerror = err => reject(err);
        }
      });
    }
    
    handleSubmit(event: React.FormEvent<HTMLElement>) {
      event.preventDefault();
      if (this.state.tagsList.length < 1) {
        this.setState({tagsErrMsg: "Please enter at least one keyword before uploading."});
        return;
      }
      this.setPhoto()
        .then((response: any) => {
          console.log(response);
          axios.post("/user/profile/uploadphoto/details", {
            title: this.state.title,
            price: this.state.price,
            tagsList: JSON.stringify(this.state.tagsList),
            albumsToAddTo: JSON.stringify(this.state.albumsToAddTo),
            photo: response[0],
            extension: response[1]
          })
          .then((response) => {
            console.log(response);
          })
          .catch((err) => {
            console.log(err);
          });
        })
    }

    handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
      event.preventDefault();
      const path = event.target.value;
      const fileExtension = path.substr(path.length - 4);
      // If no file, or file removed, remove "Upload" button and remove error msg
      // Else if file is not accepted, remove "Upload" button and display error msg
      // Else (i.e. good file) display image preview and "Upload" button
      if (path === "") {
        this.setState({
          hasPickedPhoto: false,
          fileErrMsg: "",
          photo: ""});
      } else if (fileExtension !== ".jpg" &&
                fileExtension !== ".png" &&
                fileExtension !== ".svg" &&
                fileExtension !== ".raw") {
        this.setState({
          hasPickedPhoto: false,
          fileErrMsg: "Sorry, we only support .jpg, .png, .svg, and .raw images at the moment.",
          imagePreview: null,
          photo: ""
        });
        this.deactivateUploadButton();
        event.target.value = "";
      } else {
        this.setState({
          hasPickedPhoto: true,
          fileErrMsg: "",
          photo: event.target.files
        });
        this.activateUploadButton();
        // Set image preview
        // Source: https://stackoverflow.com/questions/4459379/preview-an-image-before-it-is-uploaded
        event.target.files instanceof FileList ?
        this.setState({imagePreview: URL.createObjectURL(event.target.files[0])}) : 
        this.setState({fileErrMsg: "This should never happen."});
      }
    }

    activateUploadButton() {
      const btn = document.getElementById("uploadButton");
      return btn?.removeAttribute("disabled");
    }

    deactivateUploadButton() {
      const btn = document.getElementById("uploadButton");
      return btn?.setAttribute("disabled", "true");
    }

    handleAlbums(event: any) {
      const options = event.target.options
      const albums = []
      for (var i = 0; i < options.length; i++) {
        if (options[i].selected) {
          albums.push(options[i].value)
        }
      }
      this.setState({albumsToAddTo: albums})
      console.log(albums)
    }
    // Set title variables from component changes
    handleTitle = (titleList: any[]) => {
      console.log(titleList)
      this.setState({
        title: titleList[0],
        titleErrMsg: titleList[1]
      })
    }

    handlePrice = (priceList: any[]) => {
      this.setState({
        price: priceList[0],
        priceErrMsg: priceList[1]
      })
    }
    setTagsList = (updateTag : any, funcTag: any) => {
      this.setState(updateTag, funcTag)
    }
    handleTagsErr = (errMsg: string) => {
      this.setState({tagsErrMsg: errMsg})
    }
    render() {
        return (
            <div className="uploadPage">
              <Toolbar />
              <Container className="mt-5">
                <Form onSubmit={(e)=>this.handleSubmit(e)}>
                  <Title 
                    deactivateUploadButton={this.deactivateUploadButton}
                    activateUploadButton={this.activateUploadButton}
                    titleErrMsg= {this.state.titleErrMsg}
                    onChange={this.handleTitle}/>
                  <Price
                    deactivateUploadButton={this.deactivateUploadButton}
                    activateUploadButton={this.activateUploadButton}
                    priceErrMsg={this.state.priceErrMsg}
                    onChange={this.handlePrice}/>
                  <Tags
                    onChange={(tags:string) => this.setState({tags:tags})}
                    tags = {this.state.tags}
                    tagsList={this.state.tagsList}
                    setTagsList={this.setTagsList}
                    handleTagsErr={this.handleTagsErr}/>
                  <Form.Group>
                    <Form.File 
                      id="photo" 
                      label="Select A Photo" 
                      accept=".jpg, .png, .svg, .raw"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.handleFileChange(e)}
                    />
                    <Form.Text className="text-muted">
                      We accept .jpg, .png, .svg, and .raw images.
                      <p className="error">{this.state.fileErrMsg}</p>
                    </Form.Text>
                  </Form.Group>
                  {this.state.hasPickedPhoto ? (
                    <div>
                    <Row>
                    <Col xs={6}>
                      <Image thumbnail id="imagePreview" src={this.state.imagePreview}/>
                    </Col>
                    <Col>
                    <Form.Group controlId="exampleForm.ControlSelect2" onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.handleAlbums(e)}>
                      <Form.Label>Select album(s) to add this photo to</Form.Label>
                      <Form.Control as="select" multiple>
                        {this.state.tempAlbums.map((album: string) => {
                          return <option key={album}>{album}</option>
                        })}  
                      </Form.Control>
                    </Form.Group>
                    <Row>
                      <Col>
                      <Button> Create a new album</Button>
                      </Col>
                    </Row>
                    </Col>
                    </Row>
                    <Button id="uploadButton" className="mt-2" type="submit">Upload Photo</Button>
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