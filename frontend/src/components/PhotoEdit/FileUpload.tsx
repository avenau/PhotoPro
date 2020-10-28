import React, { useState } from "react";
import Form from "react-bootstrap/Form";

interface InterfaceFile {
  pickedPhoto: (arg0: boolean) => void;
  onChange: (arg0: HTMLElement | null) => void;
  deactivateUploadButton: () => void;
  activateUploadButton: () => void;
  setPreview: (arg0: string) => any;
  label: string;
}

export default function FileUpload(props: InterfaceFile) {
  const [fileErrMsg, setErrMsg] = useState("");

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault();

    const path = event.target.value;
    const match = path.toLowerCase().match(/\.[^\.]*$/);
    const fileExtension = match !== null ? match[0] : "";
    if (!fileExtension) {
      setErrMsg(
        "Couldn't get file extension. Make sure your file is a .jpg, .png, ,.gif, .svg."
      );
      return;
    }
    // If no file, or file removed, remove "Upload" button and remove error msg
    // Else if file is not accepted, remove "Upload" button and display error msg
    // Else (i.e. good file) display image preview and "Upload" button
    if (path === "") {
      setErrMsg("");
      props.pickedPhoto(false);
    } else if (
      ![".jpg", ".jpeg", ".png", ".gif", ".svg"].includes(fileExtension)
    ) {
      setErrMsg(
        "Sorry, we only support .jpg, .png, ,.gif, and .svg images at the moment."
      );
      props.pickedPhoto(false);
      props.onChange(null);
      props.deactivateUploadButton();
      event.target.value = "";
    } else {
      setErrMsg("");
      props.pickedPhoto(true);
      props.onChange(document.getElementById("photo"));
      props.activateUploadButton();
      // Set image preview
      // Source: https://stackoverflow.com/questions/4459379/preview-an-image-before-it-is-uploaded
      event.target.files instanceof FileList
        ? props.setPreview(URL.createObjectURL(event.target.files[0]))
        : setErrMsg("This should never happen.");
    }
  }

  return (
    <>
      <Form.Group>
        <Form.File
          id="photo"
          label={props.label}
          accept=".jpg, .jpeg, .png, .gif, .svg"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleFileChange(e)
          }
        />
        <Form.Text className="text-muted">
          We accept .jp(e)g, .png, .gif, and .svg images.
          <p className="error">{fileErrMsg}</p>
        </Form.Text>
      </Form.Group>
    </>
  );
}
