import React, { useState } from 'react';
import Form from "react-bootstrap/Form"

// Import Coen's photo listing functionality


export default function PhotoList(props: any) {
  const [errMsg, setErrMsg] = useState("")
  
  return(
    <>
      <Form.Group controlId="photoList">
        <Form.Label>Available Photos</Form.Label>
      </Form.Group>
    </>
  )
}
