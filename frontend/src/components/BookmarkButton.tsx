import React, { useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { Interface } from "readline";

interface BookmarkProps {
  p_id: string;
}

export default function BookmarkButton(props: BookmarkProps) {
  // If photo does not belong in any collections then it will be grey
  // Otherwise the button will be blue

  const [showModal, setShow] = useState(false);
  const openModal = () => setShow(true);
  const closeModal = () => setShow(false);

  const [showNewCol, setNewCol] = useState(false);
  const openNewCol = () => setNewCol(true);
  const closeNewCol = () => setNewCol(false);
  const [collections, setCollections] = useState<string[]>([]);
  const [newCollection, setCollection] = useState<string>("");
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    if (event) {
      event.preventDefault();
    }
    setNewCol(false);
    setCollections((collections) => [...collections, newCollection]);
  };

  return (
    <div>
      <Button variant="light" onClick={openModal}>
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

      <Modal show={showModal} onHide={closeModal} className="BookmarkModal">
        <Modal.Header closeButton />
        <Modal.Title>Add Photo to a Collection</Modal.Title>
        <Form>
          {collections.map((collection) => (
            <Form.Group>
              <Form.Check type="checkbox" label={collection} />
            </Form.Group>
          ))}
        </Form>
        <div className="modalButtons">
          <Button variant="primary" onClick={openNewCol}>
            New Collection
          </Button>
          <Button onClick={closeModal}>Done</Button>
        </div>
      </Modal>
      <Modal
        show={showNewCol}
        onHide={closeNewCol}
        className="NewCollectionModal"
      >
        <Modal.Header closeButton />
        <Modal.Title>Create a Collection</Modal.Title>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Control
              onChange={(e) => setCollection(e.target.value)}
              placeholder="Enter a name for your new Collection"
            />
          </Form.Group>
          <Button variant="primary" onClick={closeNewCol}>
            Cancel
          </Button>
          <Button type="submit">Create</Button>
        </Form>
      </Modal>
    </div>
  );
}
