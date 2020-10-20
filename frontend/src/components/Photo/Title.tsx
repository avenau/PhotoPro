import React, { useState } from 'react';
import Form from "react-bootstrap/Form"

// Todo fix types
export default function Title(props: any) {
    function setTitle(title: string) {
        var titleErrMsg = "Please keep your title under 40 characters to be concise. Consider adding more keywords instead."
        if (title.length > 40) { 
          props.deactivateUploadButton();
        } else {
          titleErrMsg = ""
          props.activateUploadButton();
        }
        props.onChange([title, titleErrMsg])
    }
    return (
        <>
        <Form.Group controlId="title">
            <Form.Label>Photo Title</Form.Label>
            <Form.Control required type="text" onChange={(e) => setTitle(e.target.value)}/>
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            <Form.Text className="text-muted titleInfo">
                Title must be between 1 and 40 characters long. 
                <p className="error">{props.titleErrMsg}</p>
            </Form.Text>
        </Form.Group>
        </>
    )
}