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

interface Props {
  uId: string,
  token: string,
  title: string,
  discount: number,
  tags: string[],
  albumId: string,
}

interface State {
  uId: string,
  token: string,
  title: string,
  discount: number,
  tags: string[],
  albumId: string,
}

class ManageAlbum extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      uId: String(localStorage.getItem('u_id')),
      token: String(localStorage.getItem('token')),
      title: '',
      discount: 0,
      tags: [],
      albumId: props.albumId ? props.albumId : ''
    }
    this.setState = this.setState.bind(this);
    this.activateCreateButton = this.activateCreateButton.bind(this);
    this.deactivateCreateButton = this.deactivateCreateButton.bind(this);
  }

  componentDidMount() {
    this.getAlbum()
  }

  getAlbum(){
    if (this.state.albumId != '') {
      axios
      .get('/album', 
        params: {
          token: this.state.token,
          albumId: this.state.albumId
      })
      .then((res) => {
        console.log(res);
        /*
        if (album) {
          this.setState ({
            'title': album.title,
            'discount': album.discount,
            'tags': album.tags
          });
        }
        */
      })
    }

  }

  handleSubmit(event: React.FormEvent<HTMLElement>) {
    console.log(this.state.tags);
    event.preventDefault();
    if (this.state.tags.length < 1) {
      return;
    }
    axios
    .post("/albums/update", {
        title: this.state.title,
        discount: this.state.discount,
        tags: JSON.stringify(this.state.tags),
        token: this.state.token
      })
      .then((res) => {
        console.log(res);
        this.props.history.push(`/user/${this.state.uId}`);
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

  getButton(){
    if (this.albumId == '') {
      return (
        <Button id="createButton" className="mt-2" type="submit">
          Create Album
        </Button>
      )
    } else {
      return (
        <Button id="createButton" className="mt-2" type="submit">
          Update Album
        </Button>
      )

    }
  }

  render() {
    return (
      <div className="createAlbumPage">
        <Toolbar />
        <Container className="mt-5">
          <h1>Album</h1>
          <Form onSubmit={(e) => this.handleSubmit(e)}>
            <Title 
              titleType="Album"
              deactivateUpdateButton={this.deactivateCreateButton}
              activateUploadButton={this.activateCreateButton}
              onChange={(title: string) => this.setState({ title: title })}
              titleDef=''
            />
            <Discount
              deactivateCreateButton={this.deactivateCreateButton}
              activateCreateButton={this.activateCreateButton}
              onChange={(discount: number) => this.setState({ discount: discount })}
            />
            <Tags 
              tagType="Album"
              deactivateUploadButton={this.deactivateCreateButton}
              activateUploadButton={this.activateCreateButton}
              tagsList={this.state.tags}
              setTagsList={(tags: string[]) => this.setState({ tags: tags })}
            />
            <ContentLoader
              query={this.state.uId}
              route="/user/photos"
              type="photo"
              addPhotoId={(newPhotoId: string) => this.addPhotoToList(newPhotoId)}
            />
            {this.getButton()}
          </Form>
        </Container>
      </div>
  )}
};

export default ManageAlbum;
