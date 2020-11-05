import React from "react";
import { RouteChildrenProps } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from "axios";

import Toolbar from "../../components/Toolbar/Toolbar";
import Discount from '../../components/Collection/Discount';
import ContentLoader from "../../components/ContentLoader/ContentLoader"

import Title from "../../components/PhotoEdit/Title";
import Tags from "../../components/PhotoEdit/Tags";

class CreateCollection extends React.Component<RouteChildrenProps, any> {
  constructor(props: RouteChildrenProps) {
    super(props);
    this.state = {
      u_id: localStorage.getItem("token"),
      title: '',
      discount: 0,
      photos: [],
      tags: []
    }
    this.setState = this.setState.bind(this);
    this.activateCreateButton = this.activateCreateButton.bind(this);
    this.deactivateCreateButton = this.deactivateCreateButton.bind(this);
  }

  componentDidMount() {
    this.setState = ({
        photos: this.getPhotos()
    })
  }

  // Get the photos that the user created
  getPhotos(){
      return []
  }

  handleSubmit(event: React.FormEvent<HTMLElement>) {
    console.log("SUBMITTING");
    event.preventDefault();
    if (this.state.tags.length < 1) {
      return;
    }
    const token = localStorage.getItem("token");
    axios
      .post("/collection/create", {
        title: this.state.title,
        discount: this.state.discount,
        tags: JSON.stringify(this.state.tags),
        token: token
      })
      .then((res) => {
        console.log(res);
        const uid = localStorage.getItem('u_id');
        this.props.history.push(`/user/${uid}`);
      })
      .catch((err) => {
        console.log(err);
      })
  }

  activateCreateButton() {
    const btn = document.getElementById("createButton");
    return btn?.removeAttribute("disabled");
  }

  deactivateCreateButton() {
    const btn = document.getElementById("createButton");
    return btn?.setAttribute("disabled", "true");
  }

  render() {
    return (
      <div className="createCollectionPage">
        <Toolbar />
        <Container className="mt-5">
        <h1>Create Collection</h1>
          <Form onSubmit={(e) => this.handleSubmit(e)}>
          <Title titleType="Collection"
            deactivateUpdateButton={this.deactivateCreateButton}
            activateUploadButton={this.activateCreateButton}
            onChange={(title: string) => this.setState({ title: title })}
            titleDef={''}
          />
          <Discount
            deactivateCreateButton={this.deactivateCreateButton}
            activateCreateButton={this.activateCreateButton}
            onChange={(discount: number) => this.setState({ discount: discount })}
          />
          <Tags tagType="Collection"
            deactivateUploadButton={this.deactivateCreateButton}
            activateUploadButton={this.activateCreateButton}
            tagsList={this.state.tags}
            setTagsList={(tags: any) =>
              this.setState({ tags: tags })
            }
          />
          <ContentLoader
            query={this.state.userId}
            route="/user/photos"
            type="photo"
          />
          <Button id="createButton" className="mt-2" type="submit">
            Create Collection
          </Button>
          </Form>
        </Container>
      </div>
  )}
};

export default CreateCollection;
