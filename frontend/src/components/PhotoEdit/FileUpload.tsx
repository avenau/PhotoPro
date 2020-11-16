import React, { useState } from "react";
import Form from "react-bootstrap/Form";

interface Props {
  pickedPhoto: (arg0: boolean) => void;
  onChange: (arg0: HTMLElement | null) => void;
  deactivateUploadButton: () => void;
  activateUploadButton: () => void;
  setPreview: (arg0: string) => any;
  label: string;
}

export default function FileUpload(props: Props) {
  const [fileErrMsg, setErrMsg] = useState("");

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault();

    const path = event.target.value;
    const match = path.toLowerCase().match(/\.[^.]*$/);
    const fileExtension = match !== null ? match[0] : "";
    if (!fileExtension) {
      setErrMsg(
        "Couldn't get file extension. Make sure your file is a .jpeg, .jpg, .png, or .svg."
      );
    }
    // If no file, or file removed, remove "Upload" button and remove error msg
    // Else if file is not accepted, remove "Upload" button and display error msg
    // Else (i.e. good file) display image preview and "Upload" button
    if (path === "") {
      setErrMsg("");
      props.pickedPhoto(false);
    } else if (
      fileExtension !== ".jpg" &&
      fileExtension !== ".jpeg" &&
      fileExtension !== ".png" &&
      fileExtension !== ".svg"
    ) {
      setErrMsg(
        "Sorry, we only support .jpeg, .jpg, .png, and .svg images at the moment."
      );
      props.pickedPhoto(false);
      props.onChange(null);
      props.deactivateUploadButton();
      // eslint-disable-next-line no-param-reassign
      event.target.value = "";
    } else {
      setErrMsg("");
      props.pickedPhoto(true);
      props.onChange(document.getElementById("photoId"));
      props.activateUploadButton();
      // Set image preview
      // Source: https://stackoverflow.com/questions/4459379/preview-an-image-before-it-is-uploaded
      if (event.target.files instanceof FileList)
        props.setPreview(URL.createObjectURL(event.target.files[0]));
      else setErrMsg("This should never happen.");
    }
  }

  return (
    <>
      <Form.Group>
        <Form.File
          id="photoId"
          label={props.label}
          accept=".jpeg, .jpg, .png, .svg"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleFileChange(e)
          }
        />
        <Form.Text className="text-muted">
          We accept .jp(e)g, .png, and .svg images.
          <p className="error">{fileErrMsg}</p>
        </Form.Text>
      </Form.Group>
    </>
  );
}
