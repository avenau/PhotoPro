import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ManageAccount.scss';

import { useHistory } from 'react-router-dom';
import Axios from 'axios';
import Toolbar from '../../components/Toolbar/Toolbar';

/*
TODO
Put users current details as placeholders of inputs
List all the changes that the user is making on the confirmation page
*/

export default function ManageAccount() {
  const history = useHistory();
  const [inputState, setInput] = useState(new Map());
  const updateInput = (key: string, value: any) => {
    setInput(inputState.set(key, value));
  };

  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [dob, setDob] = useState('');
  const [about_me, setAbout] = useState('');

  const getUserInfo = () => {
    const user_id = localStorage.getItem('u_id');
    Axios.post('http://localhost:8001/get_user_info', { u_id: user_id })
      .then((response) => {
        //  console.log(response.data.current_user);
        setFname(response.data.fname);
        setLname(response.data.lname);
        setEmail(response.data.email);
        setNickname(response.data.nickname);
        setDob(new Date(response.data.dob).toLocaleDateString('en-AU'));
        setAbout(response.data.aboutMe);
      });
  };

  getUserInfo();

  function handleChange(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name } = event.target;
    updateInput(name, event.target.value);
  }

  function handleSubmit(event: React.FormEvent<HTMLElement>) {
    if (event) {
      event.preventDefault();
    }
  }


  /* All of Modal Stuff below *************************************************
  */

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
    const stateMap = inputState;

    stateMap.set('u_id', localStorage.getItem('u_id'));
    console.log("Stringified JSON: " + JSON.stringify(mapToObject(stateMap)));
    fetch('http://localhost:8001/manage_account/success', {
      method: 'POST',
      body: JSON.stringify(mapToObject(stateMap)),
    })
    .then(() => {
      history.push({
        pathname: '/user/'.concat(u_id),
      })
    })
    .catch((err) => {
      console.log(err);
    });
  }

  function handleChangeModal(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    inputPassword = event.target.value;
  }

  function checkPassword(event: React.FormEvent<HTMLElement>) {
    console.log("Reached Check Password");
    if (event) {
      event.preventDefault();
    }

    Axios.post('http://localhost:8001/manage_account/confirm', { password: inputPassword, u_id: localStorage.getItem('u_id') })
      .then((response) => {
        if (response.data.password == 'true') {
          updateDB(event, response.data.u_id);
        } else {
          setFeedback('The password you entered is incorrect!');
        }
      });
  }


  const [showModal, setShow] = useState(false);
  const openModal = () => setShow(true);
  const closeModal = () => setShow(false);

  return (
    <div>
      <Toolbar />
      <div className="ManageAccount">

        <Form onSubmit={(e) => handleSubmit(e)}>
          <Form.Group controlId="firstNameForm">
            <Form.Label>First Name</Form.Label>
            <Form.Control type="text" placeholder={fname} name="fname" onChange={(e) => handleChange(e)} />
          </Form.Group>
          <Form.Group controlId="lastNameForm">
            <Form.Label>Last Name</Form.Label>
            <Form.Control type="text" placeholder={lname} name="lname" onChange={(e) => handleChange(e)} />
          </Form.Group>

          <Form.Group controlId="emailForm">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder={email} name="email" onChange={(e) => handleChange(e)} />
          </Form.Group>

          <Form.Group controlId="nicknameForm">
            <Form.Label>PhotoPro Nickname</Form.Label>
            <Form.Control type="text" placeholder={nickname} name="nickname" onChange={(e) => handleChange(e)} />
          </Form.Group>

          <Form.Group controlId="passwordForm">
            <Form.Label>New Password</Form.Label>
            <Form.Control type="password" placeholder="Enter New Password" name="password" onChange={(e) => handleChange(e)} />
          </Form.Group>

          <Form.Group controlId="retypePasswordForm">
            <Form.Label>Confirm New Password</Form.Label>
            <Form.Control type="password" placeholder="Confirm New Password" />
          </Form.Group>

          <Form.Group controlId="dobForm">
            <Form.Label>Date of Birth</Form.Label>
            <Form.Control type="date" name="DOB" placeholder={dob} onChange={(e) => handleChange(e)} />
          </Form.Group>

          <Form.Group controlId="profilePicURL">
            <Form.Label>Profile Picture URL</Form.Label>
            <Form.Control type="text" name="profilePic" placeholder="Enter a URL" onChange={(e) => handleChange(e)} />
          </Form.Group>

          <Form.Group controlId="locationForm">
            <Form.Label>Select a Country</Form.Label>
            <Form.Control as="select" name="location" onChange={(e) => handleChange(e)}>
              {/* <option disabled>{location}</option> */}
              <option>Australia</option>
              <option>United States</option>
              <option>England</option>
              <option>China</option>
              <option>Japan</option>
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="aboutMeForm">
            <Form.Label>About Me</Form.Label>
            <Form.Control placeholder={about_me} as="textarea" name="about_me" onChange={(e) => handleChange(e)} />
          </Form.Group>
          <Button variant="primary" type="submit" onClick={openModal}>
            Save
          </Button>

        </Form>

        <div className="ManageConfirmation">
          {/* Added animation={false} due to bug in bootstrap-React
            https://github.com/react-bootstrap/react-bootstrap/issues/5075*/}
          <Modal show={showModal} onHide={closeModal} animation={false}>
            <Modal.Header closeButton></Modal.Header>
            <Form onSubmit={(e) => checkPassword(e)}>
              <Form.Group controlId="passwordForm">
                <Form.Label>Are you sure you want to make these changes?</Form.Label>
                <Form.Control required type="password" placeholder="Enter Your Password" name="password" onChange={(e) => handleChangeModal(e)} />
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
      </div>

    </div >
  );
}
