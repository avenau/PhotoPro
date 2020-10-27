import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Container from 'react-bootstrap/Container';

export default function ValidatePassword(props: { validPass: (arg0: boolean) => void; setPassword: (arg0: string) => void }) {
  const [matchMessage, setMatchMessage] = useState('Enter password');
  const [passInput, setPassInput] = useState('');
  const [confirmInput, setConfirmInput] = useState('');
  const [strength, setStrength] = useState({
    barPercent: 0,
    message: 'Password strength = Bad',
    type: 'danger',
  });

  const validatePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    const form = event.currentTarget;
    const elementType = form.id;
    const input = form.value;

    // Advise password strength
    if (elementType === 'password') passwordStrength(input.length);

    // Advise password length and match
    if (input.length < 8) {
      setMatchMessage('Password must be at least 8 characters');
      props.validPass(false);
    } else if (elementType === 'password') {
      if (confirmInput === input) {
        setMatchMessage('Password matches');
        props.validPass(true);
        props.setPassword(passInput);
      } else {
        props.validPass(false);
        setMatchMessage('Password does not match');
      }
      setPassInput(input);
    } else if (elementType === 'confirmPassword') {
      if (passInput === input) {
        setMatchMessage('Password matches');
        props.validPass(true);
        props.setPassword(passInput);
      } else {
        props.validPass(false);
        setMatchMessage('Password does not match');
      }
      setConfirmInput(input);
    }
  };

  function passwordStrength(passwordLen: number) {
    // Temporary password evaluation
    // Please don't roast me
    if (passwordLen < 5) {
      setStrength({
        barPercent: 0,
        message: 'Password strength = Bad',
        type: 'danger',
      });
    } else if (passwordLen < 8) {
      setStrength({
        barPercent: 33,
        message: 'Password strength = Weak',
        type: 'danger',
      });
    } else if (passwordLen < 12) {
      setStrength({
        barPercent: 66,
        message: 'Password strength = OK',
        type: 'warning',
      });
    } else {
      setStrength({
        barPercent: 100,
        message: 'Password strength = Good',
        type: 'success',
      });
    }
  }

  return (
    <>
      <Form.Group controlId="password">
        <Form.Label>Password</Form.Label>
        <Form.Control required type="password" placeholder="Enter password" onChange={validatePassword} />
      </Form.Group>
      <Form.Group controlId="confirmPassword">
        <Form.Label>Confirm password</Form.Label>
        <Form.Control required type="password" placeholder="Confirm password" onChange={validatePassword} />
        <Form.Text>{matchMessage}</Form.Text>
      </Form.Group>
      <Container>
        <ProgressBar variant={strength.type} now={strength.barPercent} />
        <Form.Text className="text-muted">{strength.message}</Form.Text>
      </Container>
    </>
  );
}
