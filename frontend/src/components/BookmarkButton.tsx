import React from "react";
import { Button, Form, Modal } from "react-bootstrap";
import axios from "axios";
import HoverText from "./HoverText";

interface Collection {
  title: string;
  authorId?: string;
  author?: string;
  created?: string;
  id?: string;
  photoExists: boolean;
}

interface BookmarkProps {
  pId: string;
  collections: Collection[];
}

interface State {
  showModal: boolean;
  showNewCol: boolean;
  collections: Collection[];
  uId?: string;
}

const divStyle = {
  marginTop: `10px`,
  marginBottom: `10px`
}

export default class BookmarkButton extends React.Component<BookmarkProps, State> {
  // If photo does not belong in any collections then it will be grey
  // Otherwise the button will be blue
  constructor(props: BookmarkProps) {
    super(props);
    this.state = {
      showModal: false,
      showNewCol: false,
      collections: props.collections,
    };
  }

  onComponentMount() { }

  openModal = () => this.setState({ showModal: true });

  closeModal = () => this.setState({ showModal: false });

  openNewCol = () => this.setState({ showNewCol: true });

  closeNewCol = () => this.setState({ showNewCol: false });

  handleNewCollection = (event: React.FormEvent<HTMLFormElement>) => {
    if (event) {
      event.preventDefault();
    }
    const data = new FormData(event.currentTarget as HTMLFormElement);
    this.closeNewCol();
    axios
      .post(`/collection/add`, {
        token: localStorage.getItem("token"),
        title: data.get("title"),
      })
      .then((res) => {
        const newCollection = res.data;
        this.setState((prevState) => ({
          collections: [...prevState.collections, newCollection],
        }));
      })
      .catch(() => { });
  };

  updateCollections = (event: React.FormEvent<HTMLFormElement>) => {
    if (event) {
      event.preventDefault();
    }
    const data = new FormData(event.currentTarget as HTMLFormElement);
    const collections = [] as string[];
    Array.from(data.entries()).map((el) => collections.push(el[0]));
    axios
      .put(`/collection/updatephotos`, {
        token: localStorage.getItem('token'),
        collectionIds: JSON.stringify(collections),
        photoId: this.props.pId
      })
      .then((res) => this.setState({ collections: res.data }))
      .then(() => this.closeModal())
      .catch(() => { });

  }

  render() {
    return (
      <div>
        <HoverText
          id="BookmarkButtonHoverText"
          helpfulText="Add photo to Collection"
          placement="bottom"
        >
          <Button variant="light" onClick={this.openModal} className="m-2">
            <svg
              width="1em"
              height="1em"
              viewBox="0 0 16 16"
              className="bi bi-bookmark"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5V2zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1H4z"
              />
            </svg>
          </Button>
        </HoverText>
        <Modal
          animation={false}
          show={this.state.showModal}
          onHide={this.closeModal}
          className="BookmarkModal"
        >
          {localStorage.getItem("token") ? (
            <div className="BookmarkForm p-3">
              <Modal.Title className="text-muted">Add to Collection</Modal.Title>
              <Modal.Body>
                <Form 
                  className="updateCollection p-3" 
                  onSubmit={this.updateCollections}
                >
                  {this.state.collections.map((collection: Collection) => (
                    <Form.Group
                      key={collection.id}
                      className="text-muted"
                    >
                      <Form.Check
                        name={collection.id}
                        type="checkbox"
                        label={String(collection.title)}
                        onClick={((e: any) => e.target.removeAttribute("check"))}
                        defaultChecked={collection.photoExists}
                      />
                    </Form.Group>
                  ))}
                  {this.state.collections.length > 0 &&
                  <div style={divStyle}>
                    <Button
                      className="updateCollectionButton"
                      type="submit"
                    >
                      Update Collections
                    </Button>
                  </div>
                  }
                  <Button
                    className="createNewCollectionbutton"
                    variant="primary"
                    onClick={this.openNewCol}
                  >
                    Create New Collection
                  </Button>
                  <Button
                    className="cancelCollectionButton ml-2"
                    variant="danger"
                    onClick={this.closeModal}
                  >
                    Cancel
                  </Button>
                </Form>
              </Modal.Body>
            </div>
          ) : (
            <div>
              <p style={{ textAlign: "center" }}>
                Please log in to create a collection
              </p>
            </div>
            )}
        </Modal>
        <Modal
          animation={false}
          show={this.state.showNewCol}
          backdrop="static"
          onHide={this.closeNewCol}
          className="NewCollectionModal"
          centred
        >
          <div className="createNewCollectionModal p-3">
            <Modal.Title className="text-muted">Title</Modal.Title>
            <Modal.Body>
              <Form onSubmit={this.handleNewCollection}>
                <Form.Group controlId="formNewCollection">
                  <Form.Control
                    type="title"
                    name="title"
                    placeholder="Enter Collection title"
                  />
                  <Form.Text className="text-muted">
                    Enter a unique Collection title.
                  </Form.Text>
                </Form.Group>
                <Button
                  type="submit"
                  className="bookmarkButtonCreateButton"
                >
                  Create
                </Button>
                <Button
                  className="boomarkButtonCancelButton ml-2"
                  variant="danger"
                  type="reset"
                  onClick={this.closeNewCol}
                >
                  Cancel
                </Button>
              </Form>
            </Modal.Body>
          </div>
        </Modal>
      </div>
    );
  }
}
