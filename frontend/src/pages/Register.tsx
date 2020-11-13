import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import axios from "axios";
import { RouteChildrenProps } from "react-router-dom";
import Toolbar from "../components/Toolbar/Toolbar";
import UserDetails from "../components/AccountManagement/UserDetails";
import countries from "../constants";

export default function Register(props: RouteChildrenProps) {
  const [validateFeedback, setFeedback] = useState(false);

  // Form input
  const [formInput, setFormInput] = useState({
    fname: "",
    lname: "",
    email: "",
    nickname: "",
    location: "Australia",
    aboutMe: "",
  });

  // Placeholder user details
  const [oDetails, setODetails] = useState({
    fname: "Enter first name",
    lname: "Enter last name",
    email: "Enter email address",
    nickname: "Enter nickname",
    location: "Australia",
    aboutMe: "Optional",
  });

  // Password states
  const [validPassword, setValidPass] = useState(false);
  const [password, setPassword] = useState("");

  // Profile pic stuff
  const [profilePicInput, setProfilePicInput] = useState<HTMLElement | null>();
  const [profilePicPreview, setProfilePicPreview] = useState("");
  const [hasProfilePic, setHasProfilePic] = useState(false);

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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    setProfilePic().then((response: any) => {
      if (form.checkValidity() === true) {
        axios
          .post("/accountregistration", {
            fname: formInput.fname,
            lname: formInput.lname,
            email: formInput.email,
            nickname: formInput.nickname,
            password,
            profilePic: response[0],
            extension: response[1],
            location: formInput.location,
            aboutMe: formInput.aboutMe,
          })
          .then((r) => {
            if (r.status !== 200) {
              throw new Error();
            }
            props.history.push("/login");
          })
          .catch(() => {});
        setFeedback(true);
      }
    });
  };

  return (
    <>
      <br />
      <Container>
        <h1>Join PhotoPro</h1>
        <UserDetails
          validateFeedback={validateFeedback}
          validPassword={validPassword}
          countries={countries}
          hasProfilePic={hasProfilePic}
          profilePicPreview={profilePicPreview}
          formInput={formInput}
          oDetails={oDetails}
          required
          setFormInput={setFormInput}
          setValidPass={setValidPass}
          setPassword={setPassword}
          setProfilePicInput={setProfilePicInput}
          setProfilePicPreview={setProfilePicPreview}
          setHasProfilePic={setHasProfilePic}
          handleSubmit={handleSubmit}
        />
      </Container>
    </>
  );
}
