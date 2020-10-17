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
            tags: "",
            tagsList: [],
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
      } else {
        this.setState({titleErrMsg: ""});
      }
    }

    setPriceErrMsg(price: Number) {
      if (!Number.isInteger(price)) { 
        this.setState({priceErrMsg: "Please enter a whole number."});
      } else {
        this.setState({priceErrMsg: ""});
      }
    }

    setTagsList(tags: string) {
      const tagsList = tags.split(" ");
      console.log(tagsList);
      this.setState({tagsList: tagsList});
    }

    handleInputChange(event: any) {
      const id = event.target.id;
      const val = event.target.value;
      this.setState({ [id]: val });

      if (id == "title") {
        this.setTitleErrMsg(val);
      }

      if (id == "price") {
        this.setPriceErrMsg(Number(val));
      }

      if (id == "tags") {
        this.setTagsList(val);
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
      if (path == "") {
        this.setState({hasPickedPhoto: false});
        this.setState({fileErrMsg: ""});
      } else if (fileExtension != ".jpg" &&
                fileExtension != ".png" &&
                fileExtension != ".svg" &&
                fileExtension != ".raw") {
        this.setState({hasPickedPhoto: false});
        this.setState({fileErrMsg: "Sorry, we only support .jpg, .png, .svg, and .raw images."});
        this.setState({imagePreview: null});
        event.target.value = "";
      } else {
        this.setState({hasPickedPhoto: true});
        this.setState({fileErrMsg: ""});
        // Set image preview
        // Source: https://stackoverflow.com/questions/4459379/preview-an-image-before-it-is-uploaded
        event.target.files instanceof FileList ?
        this.setState({imagePreview: URL.createObjectURL(event.target.files[0])}) : 
        this.setState({fileErrMsg: "This should never happen."});
      }
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
                  </Form.Group>
                  <p className="error">{this.state.titleErrMsg}</p>
                  <Form.Group controlId="price">
                    <Form.Label>Photo Price in Credits</Form.Label>
                    <Form.Control 
                      type="number"
                      onChange={(e) => this.handleInputChange(e)}
                    >
                    </Form.Control>
                  </Form.Group>
                  <p className="error">{this.state.priceErrMsg}</p>
                  <Form.Group controlId="tags">
                    <Form.Label>Space-separated keywords, e.g. "cat dog mouse"</Form.Label>
                    <Form.Control 
                      type="text"
                      onChange={(e) => this.handleInputChange(e)}
                    >
                    </Form.Control>
                  </Form.Group>
                  <p>Detected keywords: {this.state.tagsList.toString()}</p>
                  <Form.Group>
                    <Form.File 
                      id="photo" 
                      label="Select A Photo (.jpg, .png, .svg, or .raw)" 
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.handleFileChange(e)}
                    />
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
                    <Button className="mt-2" type="submit">Upload Photo</Button>
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