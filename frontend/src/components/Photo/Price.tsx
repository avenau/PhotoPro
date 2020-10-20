import React, { useState } from 'react';
import Form from "react-bootstrap/Form"

interface IPrice {
    deactivateUploadButton: () => void;
    activateUploadButton: () => void;
    handlePrice: (arg0: string) => void;
    priceErrMsg: React.ReactNode
}

export default function Price(props: any) {
    function setPrice(price: number) {
        var priceErrMsg = "Please enter a whole number."
        if (!Number.isInteger(price)) { 
          props.deactivateUploadButton();
        } else if (price < 0) {
          priceErrMsg = "Please enter a positive number.";
          props.deactivateUploadButton();
        } else {
          priceErrMsg = "";
          props.activateUploadButton();
        }
        props.onChange([price, priceErrMsg]);
    }
    return(
        <>
        <Form.Group controlId="price">
            <Form.Label>Photo Price in Credits</Form.Label>
            <Form.Control required type="number" onChange={(e) => setPrice(Number(e.target.value))}>
            </Form.Control>
            <Form.Text className="text-muted priceInfo">
                Price must be a positive whole number, or 0 if you'd like to release your photo for free. 
                <p className="error">{props.priceErrMsg}</p>
            </Form.Text>
        </Form.Group>
        </>
    )
}