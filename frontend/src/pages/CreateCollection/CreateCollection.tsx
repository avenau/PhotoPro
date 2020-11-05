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
interface State {
  u_id: string,
  token: string,
  title: string,
  discount: number,
  photos: string[],
  tags: string[],
  dne: boolean
}

class CreateCollection extends React.Component<RouteChildrenProps, State> {
  constructor(props: RouteChildrenProps) {
    super(props);
    this.state = {
      u_id: String(localStorage.getItem('u_id')),
      token: String(localStorage.getItem('token')),
      title: '',
      discount: 0,
      photos: [],
      tags: [],
      dne: false
    }
    this.setState = this.setState.bind(this);
    this.activateCreateButton = this.activateCreateButton.bind(this);
    this.deactivateCreateButton = this.deactivateCreateButton.bind(this);
  }

  componentDidMount() {
  }

  // Get the photos that the user created
  getPhotos(){
  }

  handleSubmit(event: React.FormEvent<HTMLElement>) {
    console.log(this.state.tags);
    event.preventDefault();
    if (this.state.tags.length < 1) {
      return;
    }
    axios
      .post("/collection/create", {
        title: this.state.title,
        discount: this.state.discount,
        tags: JSON.stringify(this.state.tags),
        token: this.state.token
      })
      .then((res) => {
        console.log(res);
        this.props.history.push(`/user/${this.state.u_id}`);
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

  // Pass in a list of photos and add new photo to list
  addPhotoToList(newPhotoId: string) {
    this.setState((prevState) => ({
      photos: [...prevState.photos, newPhotoId]
    }));
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
            setTagsList={(tags: string[]) =>
              this.setState({ tags: tags })
            }
          />
          <ContentLoader
            query={this.state.u_id}
            route="/user/photos"
            type="photo"
            addPhotoId={(newPhotoId: string) => this.addPhotoToList(newPhotoId)}
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
