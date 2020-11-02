import React, { useState, useEffect } from 'react';
import {Form, Card, Button, Row, Col} from "react-bootstrap"
import axios from 'axios'

// Select existing albums or create new album
export default function Album(props: any) {
    // Album options
    const [albums, setAlbums] = useState<string[][]>([])

    // New album card
    const [newAlbumCard, setNewAlbumCard] = useState(false)
    const [newAlbumTitle, setNewAlbumTitle] = useState("")
    const [errMsg, setErrMsg] = useState("")
    const [disable, setDisable] = useState(true)

    const token = localStorage.getItem('token')

    useEffect(() => {
        axios.get('/albums', {params:
            {token: token}}
        ).then((res) => {
            console.log(res)
            var albumOptions = res.data.albumList
            for (var i = 0; i < albumOptions.length; i++) {
                albumOptions[i].push(false)
            }
            setAlbums(albumOptions)
        }).catch((err) => {
            console.log(err)
        })
    }, [])

    function addAlbums(event: React.FormEvent<HTMLInputElement>) {
        console.log(event.currentTarget)
        console.log(event.currentTarget.checked)
        const album = event.currentTarget.id 
        const checked = event.currentTarget.checked
        var tempSelected = [...props.selectedAlbums]
        if (checked === true) {
            // Add album to list
            tempSelected = [...props.selectedAlbums, album]            
            props.setSelAlbums(tempSelected)
        } else {
            // Remove album from album list
            const index = tempSelected.indexOf(album)
            tempSelected.splice(index, 1)
            props.setSelAlbums(tempSelected)
        }
        
        console.log(tempSelected)
    }

    function setNewAlbum(album: string) {
        if (album.length > 40 || album.length < 1) {
            setErrMsg("Please keep your album name between 0 and 40 characters")
            setDisable(true)
        } else {
            setErrMsg("")
            setNewAlbumTitle(album)
            setDisable(false)
        }

        // Check if album title already exists
        albums.map((currAlbum) => {
            const albumTitle = currAlbum[1]
            if (album === albumTitle) {
                setErrMsg("Please make a unique album title")
                setDisable(true)
            }
        });
    }

    function createNewAlbum(event: React.FormEvent<HTMLElement>) {
        console.log('in create new album')
        
        axios.post('/albums', {
            token,
            title: newAlbumTitle
        })
        .then((res) => {
            const albumId = res.data.albumId
            props.selectedAlbums.push(albumId)
            albums.push([albumId, newAlbumTitle])
            setNewAlbumCard(false)
        }
        )
        .catch((err) => {
            console.log(err)
        })  
    }

    return (
    <>
        { newAlbumCard ?
        (<Card className="text-center">
            <br/>
            <Card.Title>Create new album</Card.Title>
            <Card.Text>
            <small className="text-muted">You can edit the title later on your profile page</small>
            <br/>
            <small className="text-muted">Album name must be between 1 to 40 characters long</small>
            </Card.Text>
            <Form.Group className="newAlbum">
                <Form.Control id="newAlbumInput" placeholder="Enter album title" onChange={(e) => setNewAlbum(e.target.value)}/>
                <Card.Text>
                    <small className="text-muted">{errMsg}</small>
                </Card.Text>
                <br/>
                <Row>
                <Col>
                    <Button variant="secondary" onClick={(e) => {
                        setNewAlbumCard(false)
                        setDisable(true)
                        }}> Cancel</Button>
                </Col>
                <Col>
                    <Button disabled={disable} onClick={(e) => {
                        createNewAlbum(e)
                        setDisable(true)
                        }}>Add photo to new album</Button>
                </Col>
                </Row>
            </Form.Group>
        </Card>) :
        (<Card className="text-center">
        <Card.Body>
        <Card.Title>Add photo to album(s)</Card.Title>
        <Form.Group className="albumSelection">
            {albums.map((album)=> {
                return <Form.Check
                type="checkbox"
                defaultChecked={props.selectedAlbums.includes(album[0])}
                label={album[1]}
                id={album[0]}
                key={album[0]}
                onClick={(e: React.FormEvent<HTMLInputElement>) => {addAlbums(e)}}/>
            })}
            <Card.Text>
            <small className="text-muted">or create a new album to add to</small>
            </Card.Text>
            <Button onClick={(e) => {setNewAlbumCard(true)}}> Create a new album</Button>
        </Form.Group>
        </Card.Body>
    </Card>)
    }
    </>
    )
}