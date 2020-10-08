import React, {useState} from "react"
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Container from 'react-bootstrap/Container'

export default function Register() {
    const [validated, setValidated] = useState(false)
    const [validPassword, setValidPass] = useState(false)
    // Implicitly validates that values are strings
    // and required fields prevent empty forms
    const [firstName, setFName] = useState('')
    const [lastName, setLName] = useState('')
    const [email, setEmail] = useState('')
    const [nickname, setNickname] = useState('')
    const [password, setPassword] = useState('')
    const [matchMessage, setMatchMessage] = useState('')

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
          event.preventDefault();
          event.stopPropagation();
        }
        // if (validPassword) {
        setValidated(true);
        // }
        // Do fetch call here
    };

    const validatePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        const form = event.currentTarget
        const elementType = form.id
        const input = form.value

    }

    // TODO validate email format, contains [ > 1 char string] + [@] + domain + [.com]
    // TODO add other elements too
    return (
        <Container>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group>
                <Form.Label>First name</Form.Label>
                <Form.Control required placeholder="Enter first name"/>
                <Form.Check type="checkbox" label="Hide from my public profile"/>
                <Form.Control.Feedback type="invalid">Required</Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
                <Form.Label>Last name</Form.Label>
                <Form.Control required placeholder="Enter last name"/>
                <Form.Check type="checkbox" label="Hide from my public profile"/>
                <Form.Control.Feedback type="invalid">Required</Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
                <Form.Label>Email address</Form.Label>
                <Form.Control required type="email" placeholder="Enter email address"/>
                <Form.Check type="checkbox" label="Hide from my public profile"/>
            </Form.Group>
            <Form.Group>
                <Form.Label>Photopro nickname</Form.Label>
                <Form.Control required placeholder="Enter nickname"/>
                <Form.Check type="checkbox" label="Hide from my public profile"/>
            </Form.Group>
            <Form.Group controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control required type="password" placeholder="Enter password" onChange={validatePassword}/>
            </Form.Group>
            <Form.Group controlId="confirmPassword">
                <Form.Label>Confirm password</Form.Label>
                <Form.Control required type="password" placeholder="Confirm password" onChange={validatePassword}/>
                <Form.Text>{matchMessage}</Form.Text>
            </Form.Group>
            <Button type='submit'>Submit</Button>
        </Form>
        </Container>

    )


}
