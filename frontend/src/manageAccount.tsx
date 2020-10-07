import React from "react";
import { Button, Form } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./ManageAccount.scss";


function ManageAccount() {
    return (
        <div className="ManageAccount">
            <Form>
                <Form.Group controlId="firstNameForm">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter first name" />
                </Form.Group>
                <Form.Group controlId="lastNameForm">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter last name" />
                </Form.Group>

                <Form.Group controlId="emailForm">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter new email" />
                </Form.Group>

                <Form.Group controlId="passwordForm">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control type="password" placeholder="Enter New Password" />
                </Form.Group>

                <Form.Group controlId="retypePasswordForm">
                    <Form.Label>Confirm New Password</Form.Label>
                    <Form.Control type="password" placeholder="Confirm New Password" />
                </Form.Group>

                <Form.Group controlId="dobForm">
                    <Form.Label>Date of Birth</Form.Label>
                    <Form.Control type="date"></Form.Control>
                </Form.Group>

                <Form.Group controlId="locationForm">
                    <Form.Label>Select a Country</Form.Label>
                    <Form.Control as="select">
                        <option>Australia</option>
                        <option>United States</option>
                        <option>England</option>
                        <option>China</option>
                        <option>Japan</option>
                    </Form.Control>
                </Form.Group>
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </div>

        /*      <div className="App">
                <Form title="Enter your details here" />
                <MenuButton title="Manage Privacy" destintation="/manage_privacy" />
            </div>*/
    );
}

export default ManageAccount;
