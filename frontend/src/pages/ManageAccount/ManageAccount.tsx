import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ManageAccount.scss';

import { Link, useHistory, useLocation } from 'react-router-dom';
import Axios from 'axios';
import Toolbar from '../../components/Toolbar/Toolbar';

/*
TODO
Put users current details as placeholders of inputs
List all the changes that the user is making on the confirmation page
*/

export default function ManageAccount() {
  const location = useLocation();
  const history = useHistory();
  const [inputState, setInput] = useState(new Map());
  const updateInput = (key: string, value: any) => {
    setInput(inputState.set(key, value));
  };
  const place = 'place';

  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [dob, setDob] = useState('');
  const [current_location, setLocation] = useState('');
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
        setDob(new Date(response.data.dob).toLocaleDateString('en-US'));
        setLocation(response.data.location);
        setAbout(response.data.aboutMe);
      });
  };
  getUserInfo();
  // console.log(userInfo);
  // console.log(userInfo.)

  function handleSubmit(event: React.FormEvent<HTMLElement>) {
    if (event) {
      event.preventDefault();
    }
    console.log(inputState);
    history.push({
      pathname: '/manage_confirmation',
      state: inputState,
    });
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name } = event.target;
    updateInput(name, event.target.value);
  }

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
            <Form.Control type="password" placeholder="Confirm New Password" onChange={(e) => handleChange(e)} />
          </Form.Group>

          <Form.Group controlId="dobForm">
            <Form.Label>Date of Birth</Form.Label>
            <Form.Control type="date" name="birth_date" placeholder={dob} onChange={(e) => handleChange(e)} />
          </Form.Group>

          <Form.Group controlId="locationForm">
            <Form.Label>Select a Country</Form.Label>
            <Form.Control as="select" name="country" onChange={(e) => handleChange(e)}>
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
          <Button variant="primary" type="submit">
            Save
          </Button>

        </Form>
      </div>
    </div>
  );
}
