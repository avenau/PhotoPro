import React from "react";
import { RouteComponentProps } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from "axios";

import Toolbar from "../../components/Toolbar/Toolbar";
import Discount from '../../components/Collection/Discount';
import ContentLoader from "../../components/ContentLoader/ContentLoader"

import Title from "../../components/PhotoEdit/Title";
import Tags from "../../components/PhotoEdit/Tags";

interface Props extends RouteComponentProps<MatchParams> {}
interface MatchParams {
  album_id: string,
}

interface State {
  uId: string,
  token: string,
  title: string,
  discount: number,
  tags: string[],
  albumId?: string,
}

class ManageAlbum extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const albumId = this.props.match.params.album_id
    this.state = {
      uId: String(localStorage.getItem('u_id')),
      token: String(localStorage.getItem('token')),
      title: '',
      discount: 0,
      tags: [],
      albumId: albumId
    }
    this.setState = this.setState.bind(this);
    this.activateCreateButton = this.activateCreateButton.bind(this);
    this.deactivateCreateButton = this.deactivateCreateButton.bind(this);
  }

  componentDidMount() {
    this.getAlbum()
  }

  getAlbum(){
    const token = this.state.token;
    const albumId = this.state.albumId;
    if (this.state.albumId != '') {
      axios
      .get(`/album?token=${token}&album_id=${albumId}`)
      .then((res) => {
        console.log(res.data);
        if (res.data) {
          this.setState ({
            'title': res.data.title,
            'discount': res.data.discount,
            'tags': res.data.tags
          });
        }
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
    .put("/albums/update", {
        title: this.state.title,
        discount: this.state.discount,
        tags: JSON.stringify(this.state.tags),
        token: this.state.token,
        albumId: this.state.albumId
      })
      .then((res) => {
        console.log(res);
        this.props.history.push(`/user/${this.state.uId}`);
      })
      .catch((err) => {})
  }

  activateCreateButton() {
    const btn = document.getElementById("createButton");
    return btn?.removeAttribute("disabled");
  }

  deactivateCreateButton() {
    const btn = document.getElementById("createButton");
    return btn?.setAttribute("disabled", "true");
  }

  getButton(){
    if (this.state.albumId == '') {
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
              titleDef={this.state.title}
            />
            <Discount
              deactivateCreateButton={this.deactivateCreateButton}
              activateCreateButton={this.activateCreateButton}
              onChange={(discount: number) => this.setState({ discount: discount })}
              discountDef={this.state.discount}
            />
            <Tags
              tagType="Album"
              deactivateUploadButton={this.deactivateCreateButton}
              activateUploadButton={this.activateCreateButton}
              tagsList={this.state.tags}
              setTagsList={(tags: string[]) => this.setState({ tags: tags })}
            />
            {this.getButton()}
          </Form>
        </Container>
      </div>
  )}
};

export default ManageAlbum;
