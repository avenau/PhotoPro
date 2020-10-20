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
import fs from 'fs'

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
    }

    setPhoto() {
      return new Promise((resolve, reject) => {
        const fileInput = document.getElementById("photo") as HTMLInputElement;
        if (fileInput.files && fileInput.files[0]) {
          const reader = new FileReader();
          reader.readAsDataURL(fileInput.files[0]);
          reader.onload = () => resolve(reader.result);
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
      const photo = this.setPhoto()
        .then((response) => {
          console.log(response);
        })
    // const config = {headers: {'Content-Type': 'multipart/form-data'}}
    axios.post("/user/profile/uploadphoto/details", {
      title: this.state.title,
      price: this.state.price,
      tagsList: JSON.stringify(this.state.tagsList),
      albumsToAddTo: JSON.stringify(this.state.albumsToAddTo),
    })
    .then((response:any) => {
      const instance = axios.create({
        baseURL: 'http://localhost:8001/',
        timeout: 1000,
        headers: {'Content-Type': 'multipart/form-data'}
      });
      alert('Successfully uploaded photo details. Now sending photo...')
      // const {data} = response
      // const photo_id = data.id      
      // const config = {headers: {'Content-Type': 'multipart/form-data'}}
      const form_data = new FormData()
      form_data.append("image", this.state.photo[0])
      instance.post("/user/profile/uploadphoto", form_data)
      .then((response: any) => {
        console.log('Uploaded photo')
      })
      .catch((e) => {
        console.log(e)
      })
    })
    .catch((e) => {
      console.log(e)
    })
    }

    setTitleErrMsg(title: string) {
      if (title.length > 40) { 
        this.setState({titleErrMsg: "Please keep your title under 40 characters to be concise. Consider adding more keywords instead."});
        this.deactivateUploadButton();
      } else {
        this.setState({titleErrMsg: ""});
        this.activateUploadButton();
      }
    }

    setPriceErrMsg(price: number) {
      if (!Number.isInteger(price)) { 
        this.setState({priceErrMsg: "Please enter a whole number."});
        this.deactivateUploadButton();
      } else if (price < 0) {
        this.setState({priceErrMsg: "Please enter a positive number."});
        this.deactivateUploadButton();
      } else {
        this.setState({priceErrMsg: ""});
        this.activateUploadButton();
      }
    }

    handleInputChange(event: any) {
      event.preventDefault();
      const id = event.target.id;
      const val = event.target.value;
      this.setState({ [id]: val });

      if (id === "title") {
        this.setTitleErrMsg(val);
      }

      if (id === "price") {
        this.setPriceErrMsg(Number(val));
      }

      if (id === "tags") {
        this.setState({tagsErrMsg: ""});
      }
    }

    handleTagEnterPress(event: React.KeyboardEvent<HTMLInputElement>) {
      if (event.key === "Enter") {
        event.preventDefault();
        this.handleAddTags();
      }
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

    deleteTagFromTagsList(tagToDelete: string) {
      const tagsListAfterDeletion = this.state.tagsList.filter((tag: string) => {
        return tag !== tagToDelete;
      });
      this.setState({tagsList: tagsListAfterDeletion}, this.refreshTagButtons);
    }

    deleteTag(event: React.MouseEvent<HTMLElement, MouseEvent>) {
      event.preventDefault();
      const target = event.target as HTMLElement;
      const tagToDelete = target.id;
      const tagsListAfterDeletion = this.state.tagsList.filter((tag: string) => {
        return tag !== tagToDelete;
      });
      this.setState({tagsList: tagsListAfterDeletion}, this.refreshTagButtons);
    }

    stateTagsToList() {
      const tagsList = this.state.tags.trim().split(" ").filter(Boolean);
      console.log(tagsList);
      return tagsList;
    }

    refreshTagButtons() {
      console.log("A");
      console.log(this.state.tagsList);
      const newTagButtons = this.state.tagsList.map((tag: string) => {
        return  <Button 
                  key={tag} 
                  id={tag} 
                  onClick={(e)=>this.deleteTag(e)}
                >
                  {tag}
                </Button>
      });
      this.setState({tagButtons: newTagButtons}, this.clearTagInput);
    }

    updateTagsList(tagsToAdd: string[]) {
      // Remove tags from tagsToAdd which already exist in tagsList to avoid duplicate tags
      this.state.tagsList.forEach((tag: string) => {
        const matchIndex = tagsToAdd.indexOf(tag);
        if (matchIndex !== -1) {
          tagsToAdd.splice(matchIndex, 1);
        }
      });
      let updatedTagsList = this.state.tagsList.concat(tagsToAdd);

      // Allow 10 keywords maximum per photo
      if (updatedTagsList.length > 10) {
        updatedTagsList = updatedTagsList.slice(0,10);
        this.setState({tagsErrMsg: "You are allowed a maximum of 10 keywords."})
      }

      this.setState({tagsList: updatedTagsList}, this.refreshTagButtons);
    }

    clearTagInput() {
      const tagInput = document.getElementById("tags") as HTMLInputElement;
      tagInput.value = "";
      this.setState({tags: ""})
    }

    handleAddTags() {
      const tagsToAdd = this.stateTagsToList();
      // Remove dups
      const tagsToAddWithoutDups = tagsToAdd.filter((tag: string, index: Number) => tagsToAdd.indexOf(tag) === index);
      // Remove non-alphanumeric
      this.checkTagsAreAlphaNumeric(tagsToAddWithoutDups);
      // Remove tags which are > 20 characters long
      this.checkTagsAreWithinLength(tagsToAddWithoutDups);
      this.updateTagsList(tagsToAddWithoutDups);
    }

    checkTagsAreAlphaNumeric(tagsToAdd: string[]) {
      tagsToAdd.forEach((tag: string, index: number) => {
        if (!tag.match(/^[a-z0-9]+$/i)) {
          tagsToAdd.splice(index, 1);
          this.setState({tagsErrMsg: "Please only include letters and numbers in your keywords."});
        }
      });
    }

    checkTagsAreWithinLength(tagsToAdd: string[]) {
      tagsToAdd.forEach((tag: string, index: number) => {
        if (tag.length > 20) {
          tagsToAdd.splice(index, 1);
          this.setState({tagsErrMsg: "Please keep each keyword under 20 characters long."})
        }
      });
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
    render() {
        return (
            <div className="uploadPage">
              <Toolbar />
              <Container className="mt-5">
                <Form onSubmit={(e)=>this.handleSubmit(e)}>
                  <Form.Group controlId="title">
                    <Form.Label>Photo Title</Form.Label>
                    <Form.Control 
                      required
                      type="text" 
                      onChange={(e) => this.handleInputChange(e)}
                    >
                    </Form.Control>
                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    <Form.Text className="text-muted titleInfo">
                      Title must be between 1 and 40 characters long. 
                      <p className="error">{this.state.titleErrMsg}</p>
                    </Form.Text>
                  </Form.Group>
                  <Form.Group controlId="price">
                    <Form.Label>Photo Price in Credits</Form.Label>
                    <Form.Control 
                      required
                      type="number"
                      onChange={(e) => this.handleInputChange(e)}
                    >
                    </Form.Control>
                    <Form.Text className="text-muted priceInfo">
                      Price must be a positive whole number, or 0 if you'd like to release your photo for free. 
                      <p className="error">{this.state.priceErrMsg}</p>
                    </Form.Text>
                  </Form.Group>
                  <Form.Group controlId="tags">
                    <Form.Label>Space-separated keywords, e.g. "cat dog mouse". Click "Add Tags" to detect your keywords.</Form.Label>
                    <Row>
                      <Col xs={9}>
                        <Form.Control 
                          type="text"
                          onChange={(e) => this.handleInputChange(e)}
                          onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => this.handleTagEnterPress(e)}
                        >
                        </Form.Control>
                      </Col>
                      <Button 
                        onClick={this.handleAddTags.bind(this)}
                      >
                        Add Tags
                      </Button>
                    </Row>
                    <Form.Text className="text-muted tagsInfo">
                      You can include 1 to 10 keywords. Keywords should describe the main aspects of your photo.
                      <p>{this.state.tagsList.length} Detected keywords (click keyword to delete): {this.state.tagButtons}</p>
                      <p className="error">{this.state.tagsErrMsg}</p>
                    </Form.Text>
                  </Form.Group>
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
                        {this.state.tempAlbums.map((album: String) => {
                          return <option>{album}</option>
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