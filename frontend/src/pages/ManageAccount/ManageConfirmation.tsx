import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./ManageAccount.scss";
import { useHistory, useLocation } from "react-router-dom";
import Axios from "axios";


export default function ManageConfirmation() {

    const location = useLocation();
    const history = useHistory();
    let inputPassword = "";

    function mapToObject(map: Map<string, any>) {
        const result = Object.create(null);
        map.forEach((value: any, key: string) => {
            if (value instanceof Map) {
                result[key] = mapToObject(value)
            } else {
                result[key] = value;
            }
        })
        return result
    }

    function updateDB(event: React.FormEvent<HTMLElement>) {
        if (event) {
            event.preventDefault();
        }
        let stateMap = location.state as Map<string, any>;
        console.log(stateMap);
        console.log(JSON.stringify(mapToObject(stateMap)));
        fetch(`http://localhost:8001/manage_account/success`, {
            method: "POST",
            body: JSON.stringify(mapToObject(stateMap))
        });
    }

    function handleChange(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
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
                    //This will lead to profile page when the page is done
                    //Just using home as a filler
                    history.push({
                        pathname: '/home',
                    })
                } else {

                }
            })
    }

    return (
        <div className="ManageConfirmation" >
            <p>Are you sure you want to make these changes?</p>

            <Form onSubmit={(e) => checkPassword(e)}>
                <Form.Group controlId="passwordForm">
                    <Form.Label>Current Password</Form.Label>
                    <Form.Control required type="password" placeholder="Enter Your Password" name="password" onChange={(e) => handleChange(e)} />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Save Change
                </Button>
            </Form>
        </div >
    );
}
