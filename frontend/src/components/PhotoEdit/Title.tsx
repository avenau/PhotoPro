import React, { useState } from "react";
import Form from "react-bootstrap/Form";

// Todo fix types
export default function Title(props: any) {
  const [titleErrMsg, setErrMsg] = useState("");

  function setTitle(title: string) {
    if (title.length > 40) {
      props.deactivateUploadButton();
      setErrMsg(
        "Please keep your title under 40 characters to be concise. Consider adding more keywords instead."
      );
    } else {
      props.activateUploadButton();
      setErrMsg("");
    }
    props.onChange(title);
  }
  let prefill = "";
  if (props.titleDef) prefill = props.titleDef;
  return (
    <>
      <Form.Group controlId="title">
        <Form.Label>{props.titleType} Title</Form.Label>
        <Form.Control
          required
          placeholder={props.titleDef}
          type="text"
          onChange={(e) => setTitle(e.target.value)}
          defaultValue={prefill}
        />
        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        <Form.Text className="text-muted titleInfo">
          Title must be between 1 and 40 characters long.
          <p className="error">{titleErrMsg}</p>
        </Form.Text>
      </Form.Group>
    </>
  );
}
