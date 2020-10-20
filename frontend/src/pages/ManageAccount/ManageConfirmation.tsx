import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ManageAccount.scss';
import { useHistory, useLocation } from 'react-router-dom';
import Axios from 'axios';
import Toolbar from '../../components/Toolbar/Toolbar';
interface ConfirmationProps {
  inputStates: Map<string, any>;
}

export default function ManageConfirmation(props: ConfirmationProps) {
  //const location = useLocation();
  //console.log("Prop Test");
  //console.log(props);
  const history = useHistory();
  let inputPassword = '';
  const [passwordFeedback, setFeedback] = useState('');

  function mapToObject(map: Map<string, any>) {
    const result = Object.create(null);
    map.forEach((value: any, key: string) => {
      if (value instanceof Map) {
        result[key] = mapToObject(value);
      } else {
        result[key] = value;
      }
    });
    return result;
  }

  function updateDB(event: React.FormEvent<HTMLElement>, u_id: string) {
    if (event) {
      event.preventDefault();
    }
    const stateMap = props.inputStates;

    stateMap.set('u_id', localStorage.getItem('u_id'));
    // console.log(stateMap);
    console.log(JSON.stringify(mapToObject(stateMap)));
    fetch('http://localhost:8001/manage_account/success', {
      method: 'POST',
      body: JSON.stringify(mapToObject(stateMap)),
    });
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    inputPassword = event.target.value;
  }

  function checkPassword(event: React.FormEvent<HTMLElement>) {
    if (event) {
      event.preventDefault();
    }
    Axios.post('http://localhost:8001/manage_account/confirm', { password: inputPassword, u_id: localStorage.getItem('u_id') })
      .then((response) => {
        if (response.data.password == 'true') {
          updateDB(event, response.data.u_id);
          // This will lead to profile page when the page is done
          // Just using home as a filler
          const user_id = localStorage.getItem('u_id');
          history.push({
            pathname: '/user/'.concat(response.data.u_id),
          });
        } else {
          setFeedback('The password you entered is incorrect!');
        }
      });
  }

  const [showModal, setShow] = useState(false);
  const openModal = () => setShow(true);
  const closeModal = () => setShow(false);

  return (
    <div className="ManageConfirmation">

      <p>Are you sure you want to make these changes?</p>
      <Modal show={showModal} onHide={closeModal}>
        <Form onSubmit={(e) => checkPassword(e)}>
          <Form.Group controlId="passwordForm">
            <Form.Label>Current Password</Form.Label>
            <Form.Control required type="password" placeholder="Enter Your Password" name="password" onChange={(e) => handleChange(e)} />
            <Form.Text id="passwordFeedback">
              {passwordFeedback}
            </Form.Text>
          </Form.Group>
          <Button variant="primary" type="submit">
            Save Change
          </Button>
          <Button variant="primary" onClick={closeModal}>
            Cancel
          </Button>
        </Form>
      </Modal>
    </div>
  );
}
