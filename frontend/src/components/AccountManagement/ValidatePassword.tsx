import React, {useState} from "react"
import Form from 'react-bootstrap/Form'

export default function ValidatePassword(props: { validPass: (arg0: boolean) => void; setPassword: (arg0: string) => void }) {
    const [matchMessage, setMatchMessage] = useState('')
    const [passInput, setPassInput] = useState('')
    const [confirmInput, setConfirmInput] = useState('')

     // TODO Clean up later
     const validatePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        const form = event.currentTarget
        const elementType = form.id
        const input = form.value

        if (elementType === 'password') {
            if (confirmInput === input) {
                setMatchMessage('Password matches')
                props.validPass(true)
                props.setPassword(passInput)
            } else {
                props.validPass(false)
                setMatchMessage('Password does not match')
            }
            setPassInput(input)
        } else if (elementType === 'confirmPassword') {
            if (passInput === input) {
                setMatchMessage('Password matches')
                props.validPass(true)
                props.setPassword(passInput)

            } else {
                props.validPass(false)
                setMatchMessage('Password does not match')
            }
            setConfirmInput(input)
        }
    }

    return(
        <>
        <Form.Group controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control required type="password" placeholder="Enter password" onChange={validatePassword}/>
        </Form.Group>
        <Form.Group controlId="confirmPassword">
            <Form.Label>Confirm password</Form.Label>
            <Form.Control required type="password" placeholder="Confirm password" onChange={validatePassword}/>
            <Form.Text>{matchMessage}</Form.Text>
        </Form.Group>
        </>
    )
}