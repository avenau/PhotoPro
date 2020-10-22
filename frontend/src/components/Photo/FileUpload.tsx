import React, { useState } from 'react';
import Form from "react-bootstrap/Form"

interface InterfaceFile { 
    pickedPhoto: (arg0: boolean) => void;
    onChange: (arg0: HTMLElement | null) => void;
    deactivateUploadButton: () => void;
    activateUploadButton: () => void;
    setPreview: (arg0: string) => any; 
}

export default function FileUpload(props: InterfaceFile ) {
    const [fileErrMsg, setErrMsg] = useState("")

    function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
        event.preventDefault();
        const path = event.target.value;
        const fileExtension = path.substr(path.length - 4);
        // If no file, or file removed, remove "Upload" button and remove error msg
        // Else if file is not accepted, remove "Upload" button and display error msg
        // Else (i.e. good file) display image preview and "Upload" button
        if (path === "") {
            setErrMsg("")
            props.pickedPhoto(false)
        } else if (fileExtension !== ".jpg" &&
                  fileExtension !== ".png" &&
                  fileExtension !== ".gif" &&
                  fileExtension !== ".svg" &&
                  fileExtension !== ".raw") {
            setErrMsg("Sorry, we only support .jpg, .png, .svg, and .raw images at the moment.")
            props.pickedPhoto(false)
            props.onChange(null)
            props.deactivateUploadButton();
            event.target.value = "";
        } else {
            setErrMsg("")
            props.pickedPhoto(true)
            props.onChange(document.getElementById("photo"))
            props.activateUploadButton();
            // Set image preview
            // Source: https://stackoverflow.com/questions/4459379/preview-an-image-before-it-is-uploaded
            event.target.files instanceof FileList ?
            props.setPreview(URL.createObjectURL(event.target.files[0])):
            setErrMsg("This should never happen.");
        }
    }

    return (
        <>
        <Form.Group>
            <Form.File 
                id="photo" 
                label="Select A Photo" 
                accept=".jpg, .png, .svg, .raw"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFileChange(e)}/>
            <Form.Text className="text-muted">
                We accept .jpg, .png, .svg, and .raw images.
                <p className="error">{fileErrMsg}</p>
            </Form.Text>
        </Form.Group>
        
        </>
    )
}