import React, {useState} from "react"
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Container from 'react-bootstrap/Container'
import axios from "axios";
import ValidatePassword from "./ValidatePassword";

export default function Register() {
    const [validateFeedback, setFeedback] = useState(false)

    // Implicitly validates that values are strings
    // and required fields prevent empty forms
    const [firstName, setFName] = useState('')
    const [lastName, setLName] = useState('')
    const [email, setEmail] = useState('')
    const [nickname, setNickname] = useState('')

    // Password states
    const [validPassword, setValidPass] = useState(false)
    const [password, setPassword] = useState('')

    // Privacy states
    const [privFName, setPrivFName] = useState(true)
    const [privLastName, setPrivLastName] = useState(true)
    const [privEmail, setPrivEmail] = useState(true)


    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
          event.preventDefault();
          event.stopPropagation();
          console.log('false')
      } else {
          // All inputs are valid
          axios.post('/accountregistration', 
            {firstName: firstName,
            lastName: lastName,
            email: email,
            nickname: nickname,
            password: password,
            privFName: privFName,
            privLastName: privLastName,
            privEmail: privEmail
        })
      }
      setFeedback(true)
    };

    // TODO
    // DOB
    // About me
    // Location
    return (
        <Container>
        <Form noValidate validated={validateFeedback} onSubmit={handleSubmit}>
            <Form.Group>
            <Form.Group>
                <Form.Label>First name</Form.Label>
                <Form.Control required placeholder="Enter first name" onChange={e => setFName(e.target.value)}/>
                <Form.Check type="checkbox" label="Hide from my public profile" checked={privFName} onChange={() => setPrivFName(!privFName)}/>
            </Form.Group>
            <Form.Group>
                <Form.Label>Last name</Form.Label>
                <Form.Control required placeholder="Enter last name" onChange={e => setLName(e.target.value)}/>
                <Form.Check type="checkbox" label="Hide from my public profile" checked={privLastName} onChange={() => setPrivLastName(!privLastName)}/>
            </Form.Group>
            <Form.Group>
                <Form.Label>Email address</Form.Label>
                <Form.Control required type="email" placeholder="Enter email address" onChange={e => setEmail(e.target.value)}/>
                <Form.Check type="checkbox" label="Hide from my public profile" checked={privEmail} onChange={() => setPrivEmail(!privEmail)}/>
            </Form.Group>
            <Form.Group>
                <Form.Label>Photopro nickname</Form.Label>
                <Form.Control required placeholder="Enter nickname" onChange={e => setNickname(e.target.value)}/>
            </Form.Group>
            </Form.Group>
            <ValidatePassword validPass={setValidPass} setPassword={setPassword}/>
            <Button disabled={!validPassword} type='submit'>Submit</Button>
        </Form>
        </Container>
    )
}
