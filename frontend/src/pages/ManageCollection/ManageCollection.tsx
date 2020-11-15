import axios from "axios";
import React from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import { RouteComponentProps } from "react-router-dom";
import Tags from "../../components/PhotoEdit/Tags";
import Title from "../../components/PhotoEdit/Title";

interface Props extends RouteComponentProps<MatchParams> {}
interface MatchParams {
  collection_id: string;
}

interface State {
  token: string;
  title: string;
  tags: string[];
  collectionId?: string;
  private: boolean;
}

class ManageCollection extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const collectionId = this.props.match.params.collection_id;
    this.state = {
      token: String(localStorage.getItem("token")),
      title: "",
      tags: [],
      collectionId,
      private: true,
    };
    this.setState = this.setState.bind(this);
    this.activateCreateButton = this.activateCreateButton.bind(this);
    this.deactivateCreateButton = this.deactivateCreateButton.bind(this);
  }

  componentDidMount() {
    this.getCollection();
  }

  getCollection() {
    const { token } = this.state;
    const { collectionId } = this.state;
    if (this.state.collectionId !== "") {
      axios
        .get(`/collection/get?token=${token}&collectionId=${collectionId}`)
        .then((res) => {
          if (res.data) {
            document.title = `Manage ${res.data.title} | PhotoPro`;
            this.setState({
              title: res.data.title,
              tags: res.data.tags,
              private: res.data.private,
            });
          }
        });
    }
  }

  handleSubmit(event: React.FormEvent<HTMLElement>) {
    event.preventDefault();
    if (this.state.tags.length < 1) {
      return;
    }
    axios
      .put("/collection/update", {
        title: this.state.title,
        tags: JSON.stringify(this.state.tags),
        token: localStorage.getItem("token"),
        collectionId: this.state.collectionId,
        private: this.state.private,
      })
      .then(() => {
        this.props.history.push(`/collection/${this.state.collectionId}`);
      })
      .catch();
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
    if (this.state.collectionId === "") {
      return (
        <Button id="createButton" className="mt-2" type="submit">
          Create Collection
        </Button>
      );
    }
    return (
      <Button id="createButton" className="mt-2" type="submit">
        Update Collection {"  "}
      </Button>
    );
  }

  render() {
    return (
      <div className="createAlbumPage">
        <Container className="mt-5">
          <h1>Manage your collection</h1>
          <Form onSubmit={(e) => this.handleSubmit(e)}>
            <Title
              titleType="Collection"
              deactivateUpdateButton={this.deactivateCreateButton}
              activateUploadButton={this.activateCreateButton}
              onChange={(title: string) => this.setState({ title })}
              titleDef={this.state.title}
              prefill={this.state.title}
            />
            <Tags
              tagType="Collection"
              deactivateUploadButton={this.deactivateCreateButton}
              activateUploadButton={this.activateCreateButton}
              tagsList={this.state.tags}
              setTagsList={(tags: string[]) => this.setState({ tags })}
              prefill={this.state.tags}
            />
            <Form.Group controlId="formBasicCheckbox">
              <Form.Check
                checked={this.state.private}
                type="checkbox"
                label="Make collection private"
                onClick={() =>
                  this.setState((prevState) => ({
                    private: !prevState.private,
                  }))
                }
              />
            </Form.Group>
            {this.getButton()}
          </Form>
        </Container>
      </div>
    );
  }
}

export default ManageCollection;
