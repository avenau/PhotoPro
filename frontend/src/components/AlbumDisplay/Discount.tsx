import React, { useState } from "react";
import Form from "react-bootstrap/Form";

export default function Discount(props: any) {
  const [discountErrMsg, setDiscountErrMsg] = useState("");

  function setDiscount(discount: number) {
    if (!Number.isInteger(discount)) {
      props.deactivateCreateButton();
      setDiscountErrMsg("Enter a whole number.");
    } else if (discount < 0) {
      props.deactivateCreateButton();
      setDiscountErrMsg("Enter a positive number between 0 and 100.");
    } else if (discount > 100) {
      props.deactivateCreateButton();
      setDiscountErrMsg("Enter a percent value between 0 and 100");
    } else {
      props.activateCreateButton();
      setDiscountErrMsg("");
    }
    props.onChange(discount);
  }
  return (
    <>
      <Form.Group controlId="price">
        <Form.Label>Album Discount as a percentage</Form.Label>
        <Form.Control
          value={props.discountDef}
          type="number"
          onChange={(discount) => {
            discount.preventDefault();
            setDiscount(Number(discount.target.value));
          }}
        />
        <Form.Text className="text-muted priceInfo">
          Discount must be between 0 and 100.
          <p className="error">{discountErrMsg}</p>
        </Form.Text>
      </Form.Group>
    </>
  );
}
