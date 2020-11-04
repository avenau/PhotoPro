import React, { useState, useEffect } from 'react';
import { Button, Form, Modal, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ManageAccount.scss';

import axios from 'axios';
import Toolbar from '../../components/Toolbar/Toolbar';
import UserDetails from '../../components/AccountManagement/UserDetails';

export default function ManageAccount(props: any) {
  const [validateFeedback, setFeedback] = useState(false);

  // Original user details
  const [oDetails, setODetails] = useState({
    fname: "",
    lname: "",
    email: "",
    nickname: "",
    location: "Australia",
    aboutMe: ""
  });

  // Changed input
  const [formInput, setFormInput] = useState({})
  
  // Password states
  const [validPassword, setValidPass] = useState(true);
  const [password, setPassword] = useState("");

  // Location options
  var constants = require('../../constants');
  const countries = constants.countries;

  // Profile pic stuff
  const [profilePicInput, setProfilePicInput] = useState<HTMLElement | null>();
  const [profilePicPreview, setProfilePicPreview] = useState("");
  const [hasProfilePic, setHasProfilePic] = useState(false);

  const [showModal, setShow] = useState(false);
  const [inputPassword, setInputPassword] = useState('') 
  const [passwordFeedback, setPassFeedback] = useState('');

  useEffect(
    () => {
      getUserInfo()
    }, []
  )
  const getUserInfo = () => {
    const token = localStorage.getItem('token');
    if (token !== null) {
      axios.get(`http://localhost:8001/userdetails?token=${token}`)
        .then((response) => {
          setODetails({
            fname: response.data.fname,
            lname: response.data.lname,
            email: response.data.email,
            nickname: response.data.nickname,
            aboutMe: response.data.aboutMe,
            location: response.data.location
          })
        })
        .catch(() => {
          }
        );
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    console.log('here')
    setShow(true)
    console.log('there')
  };

  function checkPassword(event: React.FormEvent<HTMLElement>) {
    if (event) {
      event.preventDefault();
    }

    axios.post('http://localhost:8001/manageaccount/confirm', { password: inputPassword, token: localStorage.getItem('token') })
      .then((response) => {
        if (response.data.password === 'true') {
          saveDetails();
        } else {
          setPassFeedback('The password you entered is incorrect!');
        }
      })
      .catch(() => {
      });
  }

  function saveDetails() {
    if (password !== "") {
      setFormInput({...formInput, password})
    }
    setProfilePic()
    .then((response: any) => {
      axios.post("/manageaccount/success", {
          ...oDetails,
          ...formInput,
          profilePic: response[0],
          extension: response[1],
          token: localStorage.getItem('token')
        })
        .then((r) => {
          if (r.status !== 200) {
            throw new Error();
          }
          const u_id = localStorage.getItem('u_id')
          props.history.push(`/user/${u_id}`);
        })
        .catch((e) => {
          console.log("==========Error occured==========");
          console.log(e);
          console.log("=================================");
        });
      setFeedback(true);
    });
  }

  function setProfilePic() {
    return new Promise((resolve, reject) => {
      const fileInput = profilePicInput as HTMLInputElement;
      if (fileInput && fileInput.files && fileInput.files[0]) {
        const thePhotoFile = fileInput.files[0];
        const photoFileName = thePhotoFile.name;
        const match = photoFileName.toLowerCase().match(/\.[^\.]*$/);
        const photoExtension = match !== null ? match[0] : "";
        const reader = new FileReader();
        reader.readAsDataURL(thePhotoFile);
        reader.onload = () => resolve([reader.result, photoExtension]);
        reader.onerror = (err) => reject(err);
      } else {
        resolve(["", ""]);
      }
    });
  }

  return (
    <>
      <Toolbar />
      <br/>
      <Container>
      <h1>Change account details</h1>
        <UserDetails
          validateFeedback={validateFeedback}
          validPassword={validPassword}
          countries={countries}
          hasProfilePic={hasProfilePic}
          profilePicPreview={profilePicPreview}
          formInput={formInput}
          oDetails={oDetails}
          required={false}
          setFormInput={setFormInput}
          setValidPass={setValidPass}
          setPassword={setPassword}
          setProfilePicInput={setProfilePicInput}
          setProfilePicPreview={setProfilePicPreview}
          setHasProfilePic={setHasProfilePic}
          handleSubmit={handleSubmit}
        />
        { /* Added animation={false} due to bug in bootstrap-React
          https://github.com/react-bootstrap/react-bootstrap/issues/5075 */ }
        <Modal show={showModal} onHide={() => setShow(true)} animation={false}>
          <Modal.Header closeButton></Modal.Header>
          <Form onSubmit={(e) => checkPassword(e)}>
            <Form.Group controlId="passwordForm">
              <Form.Label>Are you sure you want to make these changes?</Form.Label>
              <Form.Text>Enter your current password to make changes</Form.Text>
              <Form.Control required type="password" placeholder="Enter Your Password" name="password" onChange={(e) => {setInputPassword(e.target.value)}} />
              <Form.Text id="passwordFeedback">
                {passwordFeedback}
              </Form.Text>
            </Form.Group>
            <Button variant="primary" type="submit">
              Save Change
            </Button>
            <Button variant="primary" onClick={() => {setShow(false)}}>
              Cancel
            </Button>
          </Form>
        </Modal>
        </Container>
        </>
  );
}
