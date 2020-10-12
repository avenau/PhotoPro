import React, {useState} from "react"
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Container from 'react-bootstrap/Container'
import axios from "axios";
import ValidatePassword from "../components/AccountManagement/ValidatePassword";

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

    // Optional values
    const [aboutMe, setAboutMe] = useState('')
    const [DOB, setDOB] = useState('')


    // Get today's date for max DOB
    const now = new Date()
    const day: number = now.getDate()
    const month: number = now.getMonth() + 1
    const year: number = now.getFullYear()
    const today = year + '-' + month + '-' + day


    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
            console.log('false')
      } else {
          // Check if email is already registered for photopro

          // All inputs are valid
          axios.post('/accountregistration', 
            {firstName: firstName,
            lastName: lastName,
            email: email,
            nickname: nickname,
            password: password,
            privFName: privFName,
            privLastName: privLastName,
            privEmail: privEmail,
            aboutMe: aboutMe,
            DOB: DOB
            })
            .then((r) => {
                if(r.status !== 200) {
                    throw new Error()
                }
                console.log('Success')
            })
            . catch((e) => {
                console.log(e)
                alert(e.message)
            })
      }
      setFeedback(true)
    };

    // TODO
    // Location

    return (
        <Container>
        <Form noValidate validated={validateFeedback} onSubmit={handleSubmit}>
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
            <ValidatePassword validPass={setValidPass} setPassword={setPassword}/>
            <br/>
            <Form.Group>
                <Form.Label>About me</Form.Label>
                <Form.Control type="text" placeholder="Optional" onChange={e => setAboutMe(e.target.value)} />
            </Form.Group>
            <Form.Group>
                <Form.Label>Date of birth</Form.Label>
                <Form.Control type="date" placeholder="Birthday" max={today} onChange={e => setDOB(e.target.value)} />
                <Form.Text className="text-muted">Optional. This will NOT be displayed on your profile.</Form.Text>
            </Form.Group>
            <Button disabled={!validPassword} type='submit'>Submit</Button>
        </Form>
        </Container>
    )
}
