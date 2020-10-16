import React from "react";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import Image from "react-bootstrap/Image"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Toolbar from "../components/Toolbar/Toolbar"
import { RouteChildrenProps } from "react-router-dom";


export default class UploadPage extends React.Component<RouteChildrenProps, any> {
    constructor(props: RouteChildrenProps) {
        super(props);
        this.state = {
            title: "",
            price: 0,
            tags: [],
            /* Whether the user has selected a photo yet.
            *  Used to display "Upload Photo" button.
            */
            hasPickedPhoto: false,
            imagePreview: null,
            // File extension error message string
            extErrMsg: ""
        };
    }

    handleSubmit(event: React.FormEvent<HTMLElement>) {
      return;
    }

    handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
      const path = event.target.value;
      const fileExtension = path.substr(path.length - 4);
      // If no file, or file removed
      // Else if file is not accepted, remove "Upload" button and display error msg
      // Else display image preview and "Upload" button
      if (path == "") {
        this.setState({hasPickedPhoto: false});
        this.setState({extErrMsg: ""});
      } else if (fileExtension != ".jpg" &&
                fileExtension != ".png" &&
                fileExtension != ".svg" &&
                fileExtension != ".raw") {
        this.setState({hasPickedPhoto: false});
        this.setState({extErrMsg: "Sorry, we only support .jpg, .png, .svg, and .raw images."});
        this.setState({imagePreview: null});
        event.target.value = "";
      } else {
        this.setState({hasPickedPhoto: true});
        this.setState({extErrMsg: ""});
        // Set image preview
        // Source: https://stackoverflow.com/questions/4459379/preview-an-image-before-it-is-uploaded
        event.target.files instanceof FileList ?
        this.setState({imagePreview: URL.createObjectURL(event.target.files[0])}) : 
        this.setState({extErrMsg: "This should never happen."});
      }
    }

    render() {
        return (
            <div className="uploadPage">
              <Toolbar />
              <Container className="mt-5">
                <Row>
                  <Form onSubmit={(e)=>this.handleSubmit(e)}>
                    <Form.Group controlId="title">
                      <Form.Label>Photo Title</Form.Label>
                      <Form.Control type="text"></Form.Control>
                    </Form.Group>
                    <Form.Group controlId="price">
                      <Form.Label>Photo Price</Form.Label>
                      <Form.Control type="number"></Form.Control>
                    </Form.Group>
                    <Form.Group controlId="tags">
                      <Form.Label>Comma-separated tags</Form.Label>
                      <Form.Control type="text"></Form.Control>
                    </Form.Group>
                    <Form.Group>
                      <Form.File 
                        id="photo" 
                        label="Select A Photo (.jpg, .png, .svg, or .raw)" 
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.handleFileChange(e)}
                      />
                    </Form.Group>
                    <p style={{color: 'red'}}>{this.state.extErrMsg}</p>
                    {this.state.hasPickedPhoto ? (
                      <div>
                      <Col xs={6}>
                        <Image thumbnail id="imagePreview" src={this.state.imagePreview}/>
                      </Col>
                      <Button className="mt-2" type="submit">Upload Photo</Button>
                      </div>
                    ) : (
                      <></>
                    )}
                  </Form>
                </Row>
              </Container>
            </div>
        );
    }
}