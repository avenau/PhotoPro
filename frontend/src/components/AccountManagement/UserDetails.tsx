import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import FileUpload from "../PhotoEdit/FileUpload";
import ValidatePassword from "./ValidatePassword";

export default function UserDetails(props: any) {
  return (
    <Form
      noValidate
      validated={props.validateFeedback}
      onSubmit={props.handleSubmit}
    >
      <Form.Group>
        <Form.Label>First name</Form.Label>
        <Form.Control
          required={props.required}
          placeholder={props.oDetails.fname}
          onChange={(e) =>
            props.setFormInput({ ...props.formInput, fname: e.target.value })
          }
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Last name</Form.Label>
        <Form.Control
          required={props.required}
          placeholder={props.oDetails.lname}
          onChange={(e) =>
            props.setFormInput({ ...props.formInput, lname: e.target.value })
          }
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Email address</Form.Label>
        <Form.Control
          required={props.required}
          type="email"
          placeholder={props.oDetails.email}
          onChange={(e) =>
            props.setFormInput({ ...props.formInput, email: e.target.value })
          }
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Photopro nickname</Form.Label>
        <Form.Control
          required={props.required}
          placeholder={props.oDetails.nickname}
          onChange={(e) =>
            props.setFormInput({ ...props.formInput, nickname: e.target.value })
          }
        />
      </Form.Group>
      <ValidatePassword
        validPass={props.setValidPass}
        setPassword={props.setPassword}
        required={props.required}
      />
      <br />
      <Form.Group>
        <Form.Label>About me</Form.Label>
        <Form.Control
          type="text"
          placeholder={props.oDetails.aboutMe}
          onChange={(e) =>
            props.setFormInput({ ...props.formInput, aboutMe: e.target.value })
          }
        />
      </Form.Group>
      <FileUpload
        deactivateUploadButton={() => {}}
        activateUploadButton={() => {}}
        onChange={(photoInput: HTMLElement | null) =>
          props.setProfilePicInput(photoInput)
        }
        setPreview={(preview: string) => {
          props.setProfilePicPreview(preview);
        }}
        pickedPhoto={(hasPickedPhoto: boolean) => {
          props.setHasProfilePic(hasPickedPhoto);
        }}
        label="Set your profile picture (Optional)"
      />
      {props.hasProfilePic ? (
        <div>
          <Row>
            <Col xs={6}>
              <Image
                thumbnail
                id="imagePreview"
                src={props.profilePicPreview}
              />
            </Col>
          </Row>
        </div>
      ) : (
        <></>
      )}
      <Form.Group>
        <Form.Label>Location</Form.Label>
        <Form.Control
          as="select"
          defaultValue={props.oDetails.location}
          onChange={(e) =>
            props.setFormInput({ ...props.formInput, location: e.target.value })
          }
        >
          {props.countries.map((country: string) => (
            <option key={country}>{country}</option>
          ))}
        </Form.Control>
      </Form.Group>
      {props.required ? (
        <Button disabled={!props.validPassword} type="submit">
          Submit
        </Button>
      ) : (
        <Button disabled={!props.validPassword} type="submit">
          Submit
        </Button>
      )}
    </Form>
  );
}
