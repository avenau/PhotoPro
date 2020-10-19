import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import axios from 'axios';
import { RouteChildrenProps } from 'react-router-dom';
import ValidatePassword from '../components/AccountManagement/ValidatePassword';
import Toolbar from '../components/Toolbar/Toolbar';

export default function Register(props: RouteChildrenProps) {
  const [validateFeedback, setFeedback] = useState(false);

  // Implicitly validates that values are strings
  // and required fields prevent empty forms
  const [fname, setFName] = useState('');
  const [lname, setLName] = useState('');
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [location, setLocation] = useState('Australia');

  // Password states
  const [validPassword, setValidPass] = useState(false);
  const [password, setPassword] = useState('');

  // Privacy states
  const [privFName, setPrivFName] = useState(true);
  const [privLName, setPrivLastName] = useState(true);
  const [privEmail, setPrivEmail] = useState(true);

  // Optional values
  const [aboutMe, setAboutMe] = useState('');
  const [DOB, setDOB] = useState('');

  // Get today's date for max DOB
  const now = new Date();
  const day: number = now.getDate();
  const month: number = now.getMonth() + 1;
  const year: number = now.getFullYear();
  const today = `${year}-${month}-${day}`;

  const countries = ['Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua & Deps', 'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina', 'Burundi', 'Cambodia', 'Cameroon', 'Canada', 'Cape Verde', 'Central African Rep', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Congo {Democratic Rep}', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'East Timor', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland Republic', 'Israel', 'Italy', 'Ivory Coast', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Korea North', 'Korea South', 'Kosovo', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macedonia', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar, {Burma}', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania', 'Russian Federation', 'Rwanda', 'St Kitts & Nevis', 'St Lucia', 'Saint Vincent & the Grenadines', 'Samoa', 'San Marino', 'Sao Tome & Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Swaziland', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Togo', 'Tonga', 'Trinidad & Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'];

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();

    axios.post('/accountregistration',
      {
        fname,
        lname,
        email,
        nickname,
        password,
        privFName,
        privLName,
        privEmail,
        aboutMe,
        DOB,
        location,
      })
      .then((r) => {
        if (r.status !== 200) {
          console.log('Here');
          throw new Error();
        }
        console.log('Success');
        props.history.push('/login');
      })
      . catch((e) => {
        console.log('==========Error occured==========');
        console.log(e);
        console.log('=================================');
      });
    setFeedback(true);
  };

  return (
    <>
      <Toolbar />
      <Container>
        <br />
        <Form noValidate validated={validateFeedback} onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>First name</Form.Label>
            <Form.Control required placeholder="Enter first name" onChange={(e) => setFName(e.target.value)} />
            <Form.Check type="checkbox" label="Hide from my public profile" checked={privFName} onChange={() => setPrivFName(!privFName)} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Last name</Form.Label>
            <Form.Control required placeholder="Enter last name" onChange={(e) => setLName(e.target.value)} />
            <Form.Check type="checkbox" label="Hide from my public profile" checked={privLName} onChange={() => setPrivLastName(!privLName)} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Email address</Form.Label>
            <Form.Control required type="email" placeholder="Enter email address" onChange={(e) => setEmail(e.target.value)} />
            <Form.Check type="checkbox" label="Hide from my public profile" checked={privEmail} onChange={() => setPrivEmail(!privEmail)} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Photopro nickname</Form.Label>
            <Form.Control required placeholder="Enter nickname" onChange={(e) => setNickname(e.target.value)} />
          </Form.Group>
          <ValidatePassword validPass={setValidPass} setPassword={setPassword} />
          <br />
          <Form.Group>
            <Form.Label>About me</Form.Label>
            <Form.Control type="text" placeholder="Optional" onChange={(e) => setAboutMe(e.target.value)} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Date of birth</Form.Label>
            <Form.Control type="date" placeholder="Birthday" max={today} onChange={(e) => setDOB(e.target.value)} />
            <Form.Text className="text-muted">Optional. This will NOT be displayed on your profile.</Form.Text>
          </Form.Group>
          <Form.Group>
            <Form.Label>Location</Form.Label>
            <Form.Control as="select" defaultValue="Australia" onChange={(e) => setLocation(e.target.value)}>
              {countries.map((country) => (
                <option>{country}</option>
              ))}
            </Form.Control>
          </Form.Group>
          <Button disabled={!validPassword} type="submit">Submit</Button>
        </Form>
      </Container>
    </>
  );
}
