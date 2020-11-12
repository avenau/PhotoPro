import { RouteComponentProps, withRouter } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from "axios";
import React from "react";

interface Props extends RouteComponentProps {
  onCatalogueChange: (active: boolean) => void;
  active: boolean;
  type: "album" | "collection";
}

interface State {
}

class CreateCatalogueModal extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
    };
  }

  handleChange(active: boolean) {
    this.props.onCatalogueChange(active);
  }

  private createAlbum(event: any) {
    const { type } = this.props;
    event.preventDefault();
    const data = new FormData(event.currentTarget as HTMLFormElement);
    axios
      .post(`/${type}/add`, {
        token: localStorage.getItem("token"),
        title: data.get("title"),
      })
      .then((res) => {
        if (res) {
          this.props.history.push(`/user/${localStorage.getItem("u_id")}`);
        }
      })
      .catch(() => {
      });
  }

  render() {
    return (
      <Modal
        show={this.props.active}
        backdrop="static"
        onHide={() => this.props.history.goBack()}
        animation={false}
        centered
      >
        <Modal.Body>
          <Form onSubmit={(e) => this.createAlbum(e)}>
            <Form.Group controlId="formNewAlbum">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="title"
                name="title"
                placeholder={`Enter ${this.props.type} title`}
              />
              <Form.Text className="text-muted">
                Enter a unique {this.props.type} title.
              </Form.Text>
            </Form.Group>
            <Button variant="primary" type="submit">
              Save
            </Button>
            <Button
              variant="danger"
              type="reset"
              onClick={() => this.handleChange(false)}
              className="newCatalogueCancelButton ml-2"
            >
              Cancel
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    );
  }
}
export default withRouter(CreateCatalogueModal);
