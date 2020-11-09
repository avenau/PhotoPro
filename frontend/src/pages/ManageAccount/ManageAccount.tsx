import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Container, Form, Modal } from "react-bootstrap";
import UserDetails from "../../components/AccountManagement/UserDetails";
import Toolbar from "../../components/Toolbar/Toolbar";
import countries from "../../constants";
import "./ManageAccount.scss";

function convertProfilePicToBase64(profilePic: [string, string]) {
  // Get filetype
  if (profilePic[0] === "" && profilePic[1] === "") {
    return "";
  }
  // base64 of the tuple profilePic
  const b64 = profilePic[0];
  const metadata1 = "data:image/";
  // Filetype of the tuple profilePic
  const metadata2 = profilePic[1];
  const metadata3 = ";base64, ";

  const ret = `${metadata1}${metadata2}${metadata3} ${b64}`;
  return ret;
}

export default function ManageAccount(props: any) {
  const [validateFeedback, setFeedback] = useState(false);
  // Original user details
  const [oDetails, setODetails] = useState({
    fname: "",
    lname: "",
    email: "",
    nickname: "",
    location: "Australia",
    aboutMe: "",
  });

  // Changed input
  const [formInput, setFormInput] = useState({});

  // Password states
  const [validPassword, setValidPass] = useState(true);
  const [password, setPassword] = useState("");

  // Profile pic stuff
  const [profilePicInput, setProfilePicInput] = useState<HTMLElement | null>();
  const [profilePicPreview, setProfilePicPreview] = useState("");
  const [hasProfilePic, setHasProfilePic] = useState(false);

  const [showModal, setShow] = useState(false);
  const [inputPassword, setInputPassword] = useState("");
  const [passwordFeedback, setPassFeedback] = useState("");

  useEffect(() => {
    getUserInfo();
  }, []);
  const getUserInfo = () => {
    const token = localStorage.getItem("token");
    if (token !== null) {
      axios
        .get(`http://localhost:8001/userdetails?token=${token}`)
        .then((response) => {
          setODetails({
            fname: response.data.fname,
            lname: response.data.lname,
            email: response.data.email,
            nickname: response.data.nickname,
            aboutMe: response.data.aboutMe,
            location: response.data.location,
          });
          if (response.data.profilePic[0]) {
            setProfilePicPreview(
              convertProfilePicToBase64(response.data.profilePic)
            );
            setHasProfilePic(true);
          }
        })
        .catch(() => {});
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setShow(true);
  };

  function checkPassword(event: React.FormEvent<HTMLElement>) {
    if (event) {
      event.preventDefault();
    }

    axios
      .post("http://localhost:8001/manageaccount/confirm", {
        password: inputPassword,
        token: localStorage.getItem("token"),
      })
      .then((response) => {
        if (response.data.password === "true") {
          saveDetails();
        } else {
          setPassFeedback("The password you entered is incorrect!");
        }
      })
      .catch(() => {});
  }

  function saveDetails() {
    if (password !== "") {
      setFormInput({ ...formInput, password });
    }
    setProfilePic().then((response: any) => {
      axios
        .post("/manageaccount/success", {
          ...oDetails,
          ...formInput,
          profilePic: response[0],
          extension: response[1],
          token: localStorage.getItem("token"),
        })
        .then((r) => {
          if (r.status !== 200) {
            throw new Error();
          }
          const id = localStorage.getItem("u_id");
          props.history.push(`/user/${id}`);
        })
        .catch(() => {});
      setFeedback(true);
    });
  }

  function setProfilePic() {
    return new Promise((resolve, reject) => {
      const fileInput = profilePicInput as HTMLInputElement;
      if (fileInput && fileInput.files && fileInput.files[0]) {
        const thePhotoFile = fileInput.files[0];
        const photoFileName = thePhotoFile.name;
        const match = photoFileName.toLowerCase().match(/\.[^.]*$/);
        const photoExtension = match !== null ? match[0] : "";
        const reader = new FileReader();
        reader.readAsDataURL(thePhotoFile);
        reader.onload = () => resolve([reader.result, photoExtension]);
        reader.onerror = (err) => reject(err);
      } else {
        resolve(["", ""]);
      }
    });
  }

  return (
    <>
      <Toolbar />
      <br />
      <Container>
        <h1>Change account details</h1>
        <UserDetails
          validateFeedback={validateFeedback}
          validPassword={validPassword}
          countries={countries}
          hasProfilePic={hasProfilePic}
          profilePicPreview={profilePicPreview}
          formInput={formInput}
          oDetails={oDetails}
          required={false}
          setFormInput={setFormInput}
          setValidPass={setValidPass}
          setPassword={setPassword}
          setProfilePicInput={setProfilePicInput}
          setProfilePicPreview={setProfilePicPreview}
          setHasProfilePic={setHasProfilePic}
          handleSubmit={handleSubmit}
        />
        {/* Added animation={false} due to bug in bootstrap-React
          https://github.com/react-bootstrap/react-bootstrap/issues/5075 */}
        <Modal show={showModal} onHide={() => setShow(false)} animation={false}>
          <Modal.Header closeButton />
          <Form onSubmit={(e) => checkPassword(e)} className="p-3">
            <Form.Group controlId="passwordForm">
              <Form.Label>
                Are you sure you want to make these changes?
              </Form.Label>
              <Form.Text>Enter your current password to make changes</Form.Text>
              <Form.Control
                required
                type="password"
                placeholder="Enter Your Password"
                name="password"
                onChange={(e) => {
                  setInputPassword(e.target.value);
                }}
              />
              <Form.Text id="passwordFeedback">{passwordFeedback}</Form.Text>
            </Form.Group>
            <Button variant="primary" type="submit">
              Save Change
            </Button>{" "}
            <Button
              variant="primary"
              onClick={() => {
                setShow(false);
              }}
            >
              Cancel
            </Button>{" "}
          </Form>
        </Modal>
      </Container>
    </>
  );
}
