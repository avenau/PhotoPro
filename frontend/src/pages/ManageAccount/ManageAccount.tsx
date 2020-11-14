import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Container, Form, Modal } from "react-bootstrap";
import UserDetails from "../../components/AccountManagement/UserDetails";
import LoadingButton from "../../components/LoadingButton/LoadingButton";
import Toolbar from "../../components/Toolbar/Toolbar";
import countries from "../../constants";
import "./ManageAccount.scss";

function addMetadataToBase64(profilePic: [string, string]) {
  return `data:image/${profilePic[1]};base64,${profilePic[0]}`;
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

  const [loading, setLoading] = useState(false);

  // Profile pic stuff
  const [profilePicInput, setProfilePicInput] = useState<HTMLElement | null>();
  const [profilePicPreview, setProfilePicPreview] = useState("");
  const [hasProfilePic, setHasProfilePic] = useState(false);
  const [originalProfilePic, setOriginalProfilePic] = useState("");
  const [originalExtension, setOriginalExtension] = useState("");

  const [showModal, setShow] = useState(false);
  const [inputPassword, setInputPassword] = useState("");
  const [passwordFeedback, setPassFeedback] = useState("");

  useEffect(() => {
    getUserInfo();
    document.title = "Manage Account | PhotoPro";
  }, []);
  const getUserInfo = () => {
    const token = localStorage.getItem("token");
    if (token !== null) {
      setLoading(true);
      axios
        .get(`/userdetails?token=${token}`)
        .then((response) => {
          setLoading(false);
          setODetails({
            fname: response.data.fname,
            lname: response.data.lname,
            email: response.data.email,
            nickname: response.data.nickname,
            aboutMe: response.data.aboutMe,
            location: response.data.location,
          });
          if (response.data.profilePic[0]) {
            setProfilePicPreview(addMetadataToBase64(response.data.profilePic));
            setOriginalProfilePic(
              addMetadataToBase64(response.data.profilePic)
            );
            setOriginalExtension(response.data.profilePic[1]);
            setHasProfilePic(true);
          }
        })
        .catch(() => {
          setLoading(false);
        });
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
    setLoading(true);

    axios
      .post("/manageaccount/confirm", {
        password: inputPassword,
        token: localStorage.getItem("token"),
      })
      .then((response) => {
        setLoading(false);
        if (response.data.password === "true") {
          saveDetails();
        } else {
          setPassFeedback("The password you entered is incorrect!");
        }
      })
      .catch(() => {
        setLoading(false);
      });
  }

  function saveDetails() {
    if (password !== "") {
      setFormInput({ ...formInput, password });
    }
    setProfilePic().then((response: any) => {
      console.log("here");
      console.log(response);
      setLoading(true);
      axios
        .post("/manageaccount/success", {
          ...oDetails,
          ...formInput,
          profilePic: response[0] ? response[0] : originalProfilePic,
          extension: response[1] ? response[1] : originalExtension,
          token: localStorage.getItem("token"),
        })
        .then((r) => {
          if (r.status !== 200) {
            throw new Error();
          }
          setLoading(false);
          const id = localStorage.getItem("u_id");
          props.history.push(`/user/${id}`);
        })
        .catch(() => {
          setLoading(false);
          setShow(false);
        });
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
        reader.onload = () => {
          resolve([reader.result, photoExtension]);
        };
        reader.onerror = (err) => reject(err);
      } else {
        resolve(["", ""]);
      }
    });
  }

  return (
    <>
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
            <div style={{ display: "flex" }}>
              <LoadingButton
                variant="primary"
                type="submit"
                onClick={() => {}}
                loading={loading}
                className="mr-2"
              >
                Save Change
              </LoadingButton>{" "}
              <Button
                variant="danger"
                onClick={() => {
                  setShow(false);
                }}
              >
                Cancel
              </Button>{" "}
            </div>
          </Form>
        </Modal>
      </Container>
    </>
  );
}
