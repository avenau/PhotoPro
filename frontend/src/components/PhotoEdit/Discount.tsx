import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";

interface IDiscount {
  price: number | undefined;
  oPrice: number;
  oDiscount: number;
  deactivateUploadButton: () => void;
  activateUploadButton: () => void;
  onChange: (arg0: number) => void;
  discountDef: number | undefined;
}

export default function Discount(props: IDiscount) {
  const [discountErrMsg, setErrMsg] = useState("");
  const [discountedPrice, setDiscountPrice] = useState(props.price);
  const [valid, setValid] = useState(true);

  useEffect(() => {
    if (props.discountDef !== undefined) {
      setDiscount(props.discountDef);
    }
  }, [props.price]);

  function setDiscount(discount: number) {
    // Check if discount is valid
    if (!Number.isInteger(discount)) {
      props.deactivateUploadButton();
      setErrMsg("Please enter a whole number.");
      setValid(false);
    } else if (discount < 0 || discount > 100) {
      props.deactivateUploadButton();
      setErrMsg("Please enter a positive number between 0 and 100.");
      setValid(false);
    } else {
      props.activateUploadButton();
      setErrMsg("");
      setValid(true);
    }
    if (props.price !== undefined) {
      setDiscountPrice(calDiscount(discount, props.price));
      props.onChange(discount);
    }
  }

  function calDiscount(discount: number, price: number) {
    return Math.round((1 - discount / 100) * price);
  }

  return (
    <>
      <Form.Group controlId="exampleForm.ControlSelect2">
        <Form.Label>Discount</Form.Label>
        <Form.Control
          required
          placeholder={props.discountDef?.toString()}
          type="number"
          onChange={(e) => setDiscount(Number(e.target.value))}
        />
        <Form.Text className="text-muted titleInfo">
          Discount must be a percentage between 0 to 100. Discount is rounded
          down.
          <p className="error">{discountErrMsg}</p>
        </Form.Text>
      </Form.Group>
      <p style={{ fontSize: "13px" }}>
        Current discount: <b>{props.oDiscount}% off </b>of {props.oPrice}{" "}
        credits ...
        <b>{calDiscount(props.oDiscount, props.oPrice)} credits.</b>
      </p>
      {valid ? (
        <p style={{ fontSize: "13px" }}>
          {props.discountDef}% off original price: <s>{props.price} credits</s>{" "}
          ... NOW <b>{discountedPrice} credits.</b>
        </p>
      ) : (
        <></>
      )}
    </>
  );
}
