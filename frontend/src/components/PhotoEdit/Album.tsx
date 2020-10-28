import React, { useState } from 'react';
import Form from "react-bootstrap/Form"

// Select existing albums or create new album
export default function Album(props: { setAlbums: (arg0: string[]) => void; }) {
    const [tempAlbums, setAlbums] = useState(["College Dropout", "Late Registration", "Graduation"])

    function handleAlbums(event: any) {
        const options = event.target.options
        const albums = []
        for (var i = 0; i < options.length; i++) {
          if (options[i].selected) {
            albums.push(options[i].value)
          }
        }
        props.setAlbums(albums)
        console.log(albums)
    }
  
    return(
        <>
        <Form.Group controlId="exampleForm.ControlSelect2" onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleAlbums(e)}>
            <Form.Label>Select album(s) to add this photo to</Form.Label>
            <Form.Control as="select" multiple>
                {tempAlbums.map((album: string) => {
                    return <option key={album}>{album}</option>
                })}  
            </Form.Control>
        </Form.Group>
        </>
    )
}