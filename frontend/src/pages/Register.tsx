import axios from "axios";
import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import { RouteChildrenProps } from "react-router-dom";
import UserDetails from "../components/AccountManagement/UserDetails";
import countries from "../constants";

export default function Register(props: RouteChildrenProps) {
  useEffect(() => {
    document.title = "Register | PhotoPro";
  });
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
  const [oDetails] = useState({
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

  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    setProfilePic().then((response: any) => {
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
          setLoading(false);
          localStorage.setItem("token", r.data.token);
          localStorage.setItem("u_id", r.data.id);
          localStorage.setItem("nickname", r.data.nickname);
          props.history.push("/");
        })
        .catch(() => {
          setLoading(false);
        });
      setFeedback(true);
    });
  };

  return (
    <>
      <br />
      <Container>
        <h1>Join PhotoPro</h1>
        <UserDetails
          loading={loading}
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
