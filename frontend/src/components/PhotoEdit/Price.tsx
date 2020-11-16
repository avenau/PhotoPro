import React, { useState } from "react";
import Form from "react-bootstrap/Form";

export default function Price(props: any) {
  const [priceErrMsg, setErrMsg] = useState("");

  function setPrice(price: number) {
    if (!Number.isInteger(price)) {
      props.deactivateUploadButton();
      setErrMsg("Please enter a whole number.");
    } else if (price < 0) {
      props.deactivateUploadButton();
      setErrMsg("Please enter a positive number.");
    } else {
      props.activateUploadButton();
      setErrMsg("");
    }
    props.onChange(price);
  }
  return (
    <>
      <Form.Group controlId="price">
        <Form.Label>Photo Price in Credits</Form.Label>
        <Form.Control
          required
          placeholder={props.priceDef}
          type="number"
          onChange={(e) => setPrice(Number(e.target.value))}
        />
        <Form.Text className="text-muted priceInfo">
          Price must be a positive whole number, or 0 if you&apos;d like to
          release your photo for free.
          <p className="error">{priceErrMsg}</p>
        </Form.Text>
      </Form.Group>
    </>
  );
}
