import React from "react";
import { Button, Form } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./ManageAccount.scss";
import ManageConfirmationProps from "./ManageConfirmationProps";
import ManageConfirmationStates from "./ManageConfirmationStates";
import { useHistory, useLocation } from "react-router-dom";
import Axios from "axios";


export default function ManageConfirmation() {
    const location = useLocation();
    const history = useHistory();
    let inputPassword = "";

    function updateDB(event: React.FormEvent<HTMLElement>) {
        if (event) {
            event.preventDefault();
        }
        fetch(`http://localhost:8001/manage_account/success`, {
            method: "POST",
            body: JSON.stringify(location.state),
        });
    }

    function handleChange(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
        //const name = event.target.name;
        inputPassword = event.target.value;
    }

    function checkPassword(event: React.FormEvent<HTMLElement>) {
        if (event) {
            event.preventDefault();
        }
        Axios.post('http://localhost:8001/manage_account/confirm', { password: inputPassword })
            .then(function (response) {
                if (response.data.password == "true") {
                    updateDB(event);
                } else {

                }
            })


        /* fetch(`http://localhost:8001/manage_account/confirm`, {
                method: "GET",
                body: JSON.stringify({ password: { inputPassword } }),
            }).then(function (response) {
                console.log(response)
            });*/
    }

    return (
        <div className="ManageConfirmation" >
            <p>Are you sure you want to make these changes?</p>

            <Form onSubmit={(e) => checkPassword(e)}>
                <Form.Group controlId="passwordForm">
                    <Form.Label>Current Password</Form.Label>
                    <Form.Control type="password" placeholder="Enter Your Current Password" name="password" onChange={(e) => handleChange(e)} />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Save Change
                </Button>
            </Form>
        </div >
    );
}
