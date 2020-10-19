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


export default class UploadPage extends React.Component<RouteChildrenProps, any> {
    constructor(props: RouteChildrenProps) {
      super(props);
      this.state = {
        title: "",
        price: 0,
        // 'tags' is the current state of the 'tags' input field
        tags: "",
        /* 'tagsList' is the current list of tags attached to the photo, 
        * which will eventaully be sent to the back end
        **/
        tagsList: [],
        tagButtons: [],
        /* Whether the user has selected a photo yet.
        *  Used to display "Upload Photo" button.
        */
        hasPickedPhoto: false,
        imagePreview: null,
        albumsToAddTo: [],
        titleErrMsg: "",
        priceErrMsg: "",
        tagsErrMsg: "",
        // File extension error message string
        fileErrMsg: ""
      };
    }

    handleSubmit(event: React.FormEvent<HTMLElement>) {
      return;
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

    // TODO: do not allow negative prices
    setPriceErrMsg(price: Number) {
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
        console.log("nothing");
        // this.setTagsList();
      }

      this.setState({tagsErrMsg: ""})
      console.log(this.state);
    }

    handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
      const path = event.target.value;
      const fileExtension = path.substr(path.length - 4);
      // If no file, or file removed, remove "Upload" button and remove error msg
      // Else if file is not accepted, remove "Upload" button and display error msg
      // Else (i.e. good file) display image preview and "Upload" button
      if (path === "") {
        this.setState({
          hasPickedPhoto: false,
          fileErrMsg: ""});
      } else if (fileExtension !== ".jpg" &&
                fileExtension !== ".png" &&
                fileExtension !== ".svg" &&
                fileExtension !== ".raw") {
        this.setState({
          hasPickedPhoto: false,
          fileErrMsg: "Sorry, we only support .jpg, .png, .svg, and .raw images at the moment.",
          imagePreview: null
        });
        this.deactivateUploadButton();
        event.target.value = "";
      } else {
        this.setState({
          hasPickedPhoto: true,
          fileErrMsg: ""
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
      btn?.removeAttribute("disabled");
    }

    deactivateUploadButton() {
      const btn = document.getElementById("uploadButton");
      btn?.setAttribute("disabled", "true");
    }

    deleteTagFromTagsList(tagToDelete: string) {
      const tagsListAfterDeletion = this.state.tagsList.filter((tag: string) => {
        return tag !== tagToDelete;
      });
      this.setState({tagsList: tagsListAfterDeletion}, this.refreshTagButtons);
    }

    // TODO: remove the tag from this.state.tagsList and this.state.tagButtons
    deleteTag(event: React.MouseEvent<HTMLElement, MouseEvent>) {
      const target = event.target as HTMLElement;
      const tagName = target.id;
      // target.remove();
      this.deleteTagFromTagsList(tagName);
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

    async updateTagsList(tagsToAdd: string[]) {
      const updatedTagsList = this.state.tagsList.concat(tagsToAdd);
      this.setState({tagsList: updatedTagsList}, this.refreshTagButtons);
    }

    clearTagInput() {
      const tagInput = document.getElementById("tags") as HTMLInputElement;
      tagInput.value = "";
      this.setState({tags: ""})
    }

    // TODO: do not allow duplicate tags to be added
    // TODO: only allow alphanumeric tags
    // TODO: enforce 1 <= ntags <= 10
    handleAddTags() {
      const tagsToAdd = this.stateTagsToList();
      this.updateTagsList(tagsToAdd);
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
                      type="text" 
                      onChange={(e) => this.handleInputChange(e)}
                    >
                    </Form.Control>
                    <Form.Text className="text-muted titleInfo">
                      Title must be between 1 and 40 characters long. 
                      <p className="error">{this.state.titleErrMsg}</p>
                    </Form.Text>
                  </Form.Group>
                  <Form.Group controlId="price">
                    <Form.Label>Photo Price in Credits</Form.Label>
                    <Form.Control 
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
                    </Form.Text>
                  </Form.Group>
                  <p className="error">{this.state.fileErrMsg}</p>
                  {this.state.hasPickedPhoto ? (
                    <div>
                    <Row>
                    <Col xs={6}>
                      <Image thumbnail id="imagePreview" src={this.state.imagePreview}/>
                    </Col>
                    <Col>
                      <Dropdown>
                        <Dropdown.Toggle variant="outline-secondary" id="albumDropdown">
                          Add to Albums
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          {/* TODO: actually show the current user's albums */}
                          <Dropdown.Item >Album1</Dropdown.Item>
                          <Dropdown.Item >Album2</Dropdown.Item>
                          <Dropdown.Item >Something else</Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
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