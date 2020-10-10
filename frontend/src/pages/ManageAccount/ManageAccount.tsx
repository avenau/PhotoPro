import React from "react";
import { Button, Form } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./ManageAccount.scss";
import ManageAccountProps from "./ManageAccountProps";
import ManageAccountStates from "./ManageAccountStates";

export default class ManageAccount extends React.Component<ManageAccountProps, ManageAccountStates> {
    constructor(props: ManageAccountProps) {
        super(props);
        this.state = {};
    }

    handleSubmit(event: React.FormEvent<HTMLElement>) {
        if (event) {
            event.preventDefault();
        }
        fetch(`http://localhost:8001/manage_account`, {
            method: "POST",
            body: JSON.stringify(this.state),
        });
    }

    handleChange(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
        const name = event.target.name;
        console.log(name);
        this.setState({ [name]: event.target.value });
    }

    render() {
        return (
            <div className="ManageAccount">
                <Form onSubmit={(e) => this.handleSubmit(e)}>
                    <Form.Group controlId="firstNameForm">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter first name" name="fname" onChange={(e) => this.handleChange(e)} />
                    </Form.Group>
                    <Form.Group controlId="lastNameForm">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter last name" name="lname" onChange={(e) => this.handleChange(e)} />
                    </Form.Group>

                    <Form.Group controlId="emailForm">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" placeholder="Enter new email" name="email" onChange={(e) => this.handleChange(e)} />
                    </Form.Group>

                    <Form.Group controlId="passwordForm">
                        <Form.Label>New Password</Form.Label>
                        <Form.Control type="password" placeholder="Enter New Password" name="password" onChange={(e) => this.handleChange(e)} />
                    </Form.Group>

                    <Form.Group controlId="retypePasswordForm">
                        <Form.Label>Confirm New Password</Form.Label>
                        <Form.Control type="password" placeholder="Confirm New Password" onChange={(e) => this.handleChange(e)} />
                    </Form.Group>

                    <Form.Group controlId="dobForm">
                        <Form.Label>Date of Birth</Form.Label>
                        <Form.Control type="date" name="birth_date" onChange={(e) => this.handleChange(e)}></Form.Control>
                    </Form.Group>

                    <Form.Group controlId="locationForm">
                        <Form.Label>Select a Country</Form.Label>
                        <Form.Control as="select" name="country" onChange={(e) => this.handleChange(e)}>
                            <option>Australia</option>
                            <option>United States</option>
                            <option>England</option>
                            <option>China</option>
                            <option>Japan</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="aboutMeForm">
                        <Form.Label>About Me</Form.Label>
                        <Form.Control as="textarea" name="about_me" onChange={(e) => this.handleChange(e)} />
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
}
