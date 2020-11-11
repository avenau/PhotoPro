import React from "react";
import { Button, Form, Modal } from "react-bootstrap";
import axios from 'axios';

interface Collection {
  title : string;
  authorId?: string;
  author?: string;
  created?: string;
  id?: string;
}

interface BookmarkProps {
  pId: string;
  collections: Collection[];
}

interface State {
  showModal: boolean;
  showNewCol: boolean;
  collections: Collection[];
  token?: string;
  uId?: string;
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

  onComponentMount(){
  }

  openModal = () => this.setState({ showModal: true });

  closeModal = () => this.setState({ showModal: false });

  openNewCol = () => this.setState({ showNewCol: true });

  closeNewCol = () => this.setState({ showNewCol: false });

  handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    if (event) {
      event.preventDefault();
    }
    const data = new FormData(event.currentTarget as HTMLFormElement)
    this.closeNewCol();
    axios
      .post(`/collection/add`, {params: {token: this.state.token,
                                         title: data.get('title')}})
      .then((res) => {
              const newCollection = res.data;
              this.setState(prevState => ({
                collections: [...prevState.collections, newCollection],
              }));
            })
      .catch(()=>{});
  };

  render() {
    return (
      <div>
        <Button
          variant="light"
          onClick={this.openModal}
        >
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
        <Modal
          animation={false}
          show={this.state.showModal}
          onHide={this.closeModal}
          className="BookmarkModal"
        >
          <Modal.Header closeButton />
          <div className="BookmarkForm p-3">
            <Modal.Title>Add Photo to a Collection</Modal.Title>
            <Form className="p-3">
              {this.state.collections.map((collection: Collection) => (
                <Form.Group key={collection.id}>
                  <Form.Check
                    type="checkbox"
                    label={collection.title}
                  />
                </Form.Group>
              ))}
            </Form>
            <div className="modalButtons">
              <Button variant="primary" onClick={this.openNewCol}>
                New Collection
              </Button>
              <Button onClick={this.closeModal}>Done</Button>
            </div>
          </div>
        </Modal>
        <Modal
          animation={false}
          show={this.state.showNewCol}
          onHide={this.closeNewCol}
          className="NewCollectionModal"
        >
          <Modal.Header closeButton />
          <Modal.Title>Create a Collection</Modal.Title>
          <Form onSubmit={this.handleSubmit}>
            <Form.Group>
              <Form.Control
                placeholder="Enter a name for your new Collection"
                name="title"
              />
            </Form.Group>
            <Button variant="primary" onClick={this.closeNewCol}>
              Cancel
            </Button>
            <Button type="submit">Create</Button>
          </Form>
        </Modal>
      </div>
    );
  }
}
