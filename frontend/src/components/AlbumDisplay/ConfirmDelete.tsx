import React from 'react'
import { Modal, Button } from "react-bootstrap"

interface ConfirmDeleteProps {
  modalDelete: boolean;
  catalogue: string;
  setModalDelete: (arg0: boolean) => void;
  handleDelete: (arg0: void) => void
}

export default function ConfirmDelete(props: ConfirmDeleteProps) {
    return (<Modal show={props.modalDelete} onHide={() => {props.setModalDelete(false)}} animation={false}>
      <Modal.Header closeButton>
        <Modal.Title>Delete {props.catalogue}</Modal.Title>
      </Modal.Header>
      <Modal.Body>Are you sure you want to delete your {props.catalogue}? You cannot recover your {props.catalogue} after deletion.</Modal.Body>
      <Modal.Footer>
        <Button id="deleteConfirmed" variant="danger" onClick={() => {props.handleDelete()}}>Delete {props.catalogue}</Button>
        <Button id="cancelDelete" variant="secondary" onClick={() => {props.setModalDelete(false)}}>Cancel</Button>
      </Modal.Footer>
    </Modal>)
}