import React, { useState, useEffect } from 'react';
import {Form, Card, Button, Row, Col} from "react-bootstrap"
import AlbumList from '../../components/ProfileLists/AlbumList';
import axios from 'axios'
import { render } from '@testing-library/react';



interface IAlbum {
    [key: string]: string
}

// Select existing albums or create new album
export default function Album(props: any) {
    const [albums, setAlbums] = useState<any[][]>([])
    const [selectedAlbums, setSelAlbums] = useState<string[]>([])

    // New album card
    const [newAlbumCard, setNewAlbumCard] = useState(false)
    const [newAlbumTitle, setNewAlbumTitle] = useState("")

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
        var tempSelected = [...selectedAlbums]
        if (checked === true) {
            // Add album to list
            tempSelected = [...selectedAlbums, album]            
            setSelAlbums(tempSelected)
        } else {
            // Remove album from album list
            const index = tempSelected.indexOf(album)
            tempSelected.splice(index, 1)
            setSelAlbums(tempSelected)
        }
        
        console.log(tempSelected)
    }

    function createNewAlbum(event: React.FormEvent<HTMLElement>) {
        console.log('in create new album')
        
        axios.post('/albums', {
            token,
            title: newAlbumTitle
        })
        .then((res) => {
            const albumId = res.data.albumId
            selectedAlbums.push(albumId)
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
            <Card.Title>Create new album</Card.Title>
            <Form.Group className="newAlbum">
                <Form.Control placeholder="Enter album title" onChange={(e) => setNewAlbumTitle(e.target.value)}/>
                <br/>
                <Row>
                <Col>
                    <Button variant="secondary" onClick={(e) => {setNewAlbumCard(false)}}> Cancel</Button>
                </Col>
                <Col>
                    <Button onClick={(e) => {createNewAlbum(e)}}>Create and add photo to album</Button>
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
                defaultChecked={selectedAlbums.includes(album[0])}
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