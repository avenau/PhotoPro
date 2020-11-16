import axios from "axios";
import React from "react";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import { RouteComponentProps } from "react-router-dom";
import Discount from "../../components/AlbumDisplay/Discount";
import Tags from "../../components/PhotoEdit/Tags";
import Title from "../../components/PhotoEdit/Title";
import LoadingButton from "../../components/LoadingButton/LoadingButton";

interface Props extends RouteComponentProps<MatchParams> {}
interface MatchParams {
  album_id: string;
}

interface State {
  token: string;
  title: string;
  discount: number;
  tags: string[];
  albumId?: string;
  btnLoading: boolean;
}

class ManageAlbum extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const albumId = this.props.match.params.album_id;
    this.state = {
      token: String(localStorage.getItem("token")),
      title: "",
      discount: 0,
      tags: [],
      albumId,
      btnLoading: false,
    };
    this.setState = this.setState.bind(this);
    this.activateCreateButton = this.activateCreateButton.bind(this);
    this.deactivateCreateButton = this.deactivateCreateButton.bind(this);
  }

  componentDidMount() {
    this.getAlbum();
  }

  getAlbum() {
    const { token } = this.state;
    const { albumId } = this.state;
    if (this.state.albumId !== "") {
      axios
        .get(`/album?token=${token}&album_id=${albumId}`)
        .then((res) => {
          if (res.data) {
            document.title = `Manage ${res.data.title} | PhotoPro`;
            this.setState({
              title: res.data.title,
              discount: res.data.discount,
              tags: res.data.tags,
            });
          }
        })
        .catch(() => {});
    }
  }

  handleSubmit(event: React.FormEvent<HTMLElement>) {
    event.preventDefault();
    if (this.state.tags.length < 1) {
      return;
    }
    this.setState({ btnLoading: true });
    axios
      .put("/albums/update", {
        title: this.state.title,
        discount: this.state.discount,
        tags: JSON.stringify(this.state.tags),
        token: this.state.token,
        albumId: this.state.albumId,
      })
      .then(() => {
        this.setState({ btnLoading: false });
        this.props.history.push(`/album/${this.state.albumId}`);
      })
      .catch(() => {
        this.setState({ btnLoading: false });
      });
  }

  activateCreateButton() {
    const btn = document.getElementById("createButton");
    return btn?.removeAttribute("disabled");
  }

  deactivateCreateButton() {
    const btn = document.getElementById("createButton");
    return btn?.setAttribute("disabled", "true");
  }

  getButton() {
    if (this.state.albumId === "") {
      return (
        <LoadingButton
          loading={this.state.btnLoading}
          id="createButton"
          className="mt-2"
          type="submit"
          onClick={() => {}}
        >
          Create Album
        </LoadingButton>
      );
    }
    return (
      <LoadingButton
        loading={this.state.btnLoading}
        id="createButton"
        className="mt-2"
        type="submit"
        onClick={() => {}}
      >
        Update Album {"  "}
      </LoadingButton>
    );
  }

  render() {
    return (
      <div className="createAlbumPage">
        <Container className="mt-5">
          <h1>Manage your album</h1>
          <Form onSubmit={(e) => this.handleSubmit(e)}>
            <Title
              titleType="Album"
              deactivateUpdateButton={this.deactivateCreateButton}
              activateUploadButton={this.activateCreateButton}
              onChange={(title: string) => this.setState({ title })}
              titleDef={this.state.title}
              prefill={this.state.title}
            />
            <Discount
              deactivateCreateButton={this.deactivateCreateButton}
              activateCreateButton={this.activateCreateButton}
              onChange={(discount: number) => this.setState({ discount })}
              discountDef={this.state.discount}
              prefill={this.state.discount}
              currencyType="Credits"
            />
            <Tags
              tagType="Album"
              deactivateUploadButton={this.deactivateCreateButton}
              activateUploadButton={this.activateCreateButton}
              tagsList={this.state.tags}
              setTagsList={(tags: string[]) => this.setState({ tags })}
              prefill={this.state.tags}
            />
            {this.getButton()}
          </Form>
        </Container>
      </div>
    );
  }
}

export default ManageAlbum;
