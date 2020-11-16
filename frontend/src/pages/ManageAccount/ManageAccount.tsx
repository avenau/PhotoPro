import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Container, Form, Modal } from "react-bootstrap";
import UserDetails from "../../components/AccountManagement/UserDetails";
import LoadingPage from "../../pages/LoadingPage";
import LoadingButton from "../../components/LoadingButton/LoadingButton";
import BackButton from "../../components/BackButton/BackButton";
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

  const [btnLoading, setBtnLoading] = useState(false);

  // Profile pic stuff
  const [profilePicInput, setProfilePicInput] = useState<HTMLElement | null>();
  const [profilePicPreview, setProfilePicPreview] = useState("");
  const [hasProfilePic, setHasProfilePic] = useState(false);
  const [originalProfilePic, setOriginalProfilePic] = useState("");
  const [originalExtension, setOriginalExtension] = useState("");

  const [showModal, setShow] = useState(false);
  const [inputPassword, setInputPassword] = useState("");
  const [passwordFeedback, setPassFeedback] = useState("");

  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    getUserInfo();
    document.title = "Manage Account | PhotoPro";
  }, []);
  const getUserInfo = () => {
    const token = localStorage.getItem("token");
    if (token !== null) {
      setBtnLoading(true);
      axios
        .get(`/userdetails?token=${token}`)
        .then((response) => {
          setBtnLoading(false);
          setPageLoading(false);
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
          setBtnLoading(false);
          setPageLoading(false);
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
    setBtnLoading(true);

    axios
      .post("/manageaccount/confirm", {
        password: inputPassword,
        token: localStorage.getItem("token"),
      })
      .then((response) => {
        setBtnLoading(false);
        if (response.data.password === "true") {
          saveDetails();
        } else {
          setPassFeedback("The password you entered is incorrect!");
        }
      })
      .catch(() => {
        setBtnLoading(false);
      });
  }

  function saveDetails() {
    if (password !== "") {
      setFormInput({ ...formInput, password });
    }
    setProfilePic().then((response: any) => {
      setBtnLoading(true);
      axios
        .post("/manageaccount/success", {
          ...oDetails,
          ...formInput,
          profilePic: response[0] ? response[0] : originalProfilePic,
          extension: response[1] ? response[1] : originalExtension,
          token: localStorage.getItem("token"),
        })
        .then((r: any) => {
          if (r.status !== 200) {
            throw new Error();
          }
          setBtnLoading(false);
          const id = localStorage.getItem("u_id");
          if (r.data.nickname)
            localStorage.setItem("nickname", r.data.nickname);
          props.history.push(`/user/${id}`);
        })
        .catch(() => {
          setBtnLoading(false);
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

  return pageLoading ? (
    <LoadingPage />
  ) : (
    <div>
      <BackButton
        href={`/user/${localStorage.getItem("u_id")}`}
        label="Back to Profile"
      />
      <Container>
        <h1>Change Account Details</h1>
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
        {/* Added animation={</div>react-bootstrap/react-bootstrap/issues/5075 */}
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
                loading={btnLoading}
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
    </div>
  );
}
