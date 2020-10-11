import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./ManageAccount.scss";

import { Link, useHistory, useLocation } from "react-router-dom";

/*
TODO
Put users current details as placeholders of inputs
Find out how to know who is currently logged in so I know which user's database to change
Display error message when password is wrong
Redirect user to profile when changes are successful
List all the changes that the user is making on the confirmation page
*/

export default function ManageAccount() {
    const [validateFeedback, setFeedback] = useState(false);

    const [inputState, setInput] = useState(new Map());
    const updateInput = (key: string, value: any) => {
        setInput(inputState.set(key, value));
    }
    const location = useLocation();
    const history = useHistory();

    function handleSubmit(event: React.FormEvent<HTMLElement>) {
        if (event) {
            event.preventDefault();
        }
        setFeedback(true);
        history.push({
            pathname: '/manage_confirmation',
            state: inputState
        })

    }

    function handleChange(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
        const name = event.target.name;
        updateInput(name, event.target.value);
    }

    return (
        <div className="ManageAccount" >
            <Form onSubmit={(e) => handleSubmit(e)}>
                <Form.Group controlId="firstNameForm">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter first name" name="fname" onChange={(e) => handleChange(e)} />
                </Form.Group>
                <Form.Group controlId="lastNameForm">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter last name" name="lname" onChange={(e) => handleChange(e)} />
                </Form.Group>

                <Form.Group controlId="emailForm">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter new email" name="email" onChange={(e) => handleChange(e)} />
                </Form.Group>

                <Form.Group controlId="nicknameForm">
                    <Form.Label>PhotoPro Nickname</Form.Label>
                    <Form.Control type="text" placeholder="Enter a nickname" name="nickname" onChange={(e) => handleChange(e)} />
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
                    <Form.Control type="date" name="birth_date" onChange={(e) => handleChange(e)}></Form.Control>
                </Form.Group>

                <Form.Group controlId="locationForm">
                    <Form.Label>Select a Country</Form.Label>
                    <Form.Control as="select" name="country" onChange={(e) => handleChange(e)}>
                        <option>Australia</option>
                        <option>United States</option>
                        <option>England</option>
                        <option>China</option>
                        <option>Japan</option>
                    </Form.Control>
                </Form.Group>
                <Form.Group controlId="aboutMeForm">
                    <Form.Label>About Me</Form.Label>
                    <Form.Control as="textarea" name="about_me" onChange={(e) => handleChange(e)} />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Save
                    </Button>

            </Form>
        </div >
    );

}
