import React, { useState, useEffect } from "react";
import { Form, Card, Button, Row, Col } from "react-bootstrap";
import axios from "axios";

// Select existing albums or create new album
export default function Album(props: any) {
  // Album options
  const [albums, setAlbums] = useState<string[][]>([]);

  // New album card
  const [newAlbumCard, setNewAlbumCard] = useState(false);
  const [newAlbumTitle, setNewAlbumTitle] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [disable, setDisable] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("/albums", { params: { token } })
      .then((res) => {
        const albumOptions = res.data.albumList;
        setAlbums(albumOptions);
      })
      .catch(() => {});
  }, []);

  function addAlbums(event: React.FormEvent<HTMLInputElement>) {
    const album = event.currentTarget.id;
    const { checked } = event.currentTarget;
    let tempSelected = [...props.selectedAlbums];
    if (checked === true) {
      // Add album to list
      tempSelected = [...props.selectedAlbums, album];
      props.setSelAlbums(tempSelected);
    } else {
      // Remove album from album list
      const index = tempSelected.indexOf(album);
      tempSelected.splice(index, 1);
      props.setSelAlbums(tempSelected);
    }
  }

  function setNewAlbum(album: string) {
    if (album.length > 40 || album.length < 1) {
      setErrMsg("Please keep your album name between 0 and 40 characters");
      setDisable(true);
    } else {
      setErrMsg("");
      setNewAlbumTitle(album);
      setDisable(false);
    }

    // Check if album title already exists
    albums.forEach((currAlbum) => {
      const albumTitle = currAlbum[1];
      if (album === albumTitle) {
        setErrMsg("Please make a unique album title");
        setDisable(true);
      }
    });
  }

  function createNewAlbum() {
    axios
      .post("/album/add", {
        token,
        title: newAlbumTitle,
      })
      .then((res) => {
        const { albumId } = res.data;
        props.selectedAlbums.push(albumId);
        albums.push([albumId, newAlbumTitle]);
        setNewAlbumCard(false);
      })
      .catch(() => {});
  }

  return (
    <div className="p-3">
      {newAlbumCard ? (
        <Card className="text-center p-3">
          <br />
          <Card.Title>Create new album</Card.Title>
          <Card.Text>
            <small className="text-muted">
              You can edit the title later on your profile page
            </small>
            <br />
            <small className="text-muted">
              Album name must be between 1 to 40 characters long
            </small>
          </Card.Text>
          <Form.Group className="newAlbum">
            <Form.Control
              id="newAlbumInput"
              placeholder="Enter album title"
              onChange={(e) => setNewAlbum(e.target.value)}
            />
            <Card.Text>
              <small className="text-muted">{errMsg}</small>
            </Card.Text>
            <br />
            <Row>
              <Col>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setNewAlbumCard(false);
                    setDisable(true);
                  }}
                >
                  {" "}
                  Cancel
                </Button>
              </Col>
              <Col>
                <Button
                  disabled={disable}
                  onClick={() => {
                    createNewAlbum();
                    setDisable(true);
                  }}
                >
                  Add photo to new album
                </Button>
              </Col>
            </Row>
          </Form.Group>
        </Card>
      ) : (
        <Card className="text-center p-3">
          <Card.Body>
            <Card.Title>Add photo to album(s)</Card.Title>
            <Form.Group className="albumSelection">
              {albums.map((album) => {
                return (
                  <Form.Check
                    type="checkbox"
                    defaultChecked={props.selectedAlbums.includes(album[0])}
                    label={album[1]}
                    id={album[0]}
                    key={album[0]}
                    onClick={(e: React.FormEvent<HTMLInputElement>) => {
                      addAlbums(e);
                    }}
                  />
                );
              })}
              <Card.Text>
                <small className="text-muted">
                  or create a new album to add to
                </small>
              </Card.Text>
              <Button
                onClick={() => {
                  setNewAlbumCard(true);
                }}
              >
                {" "}
                Create a new album
              </Button>
            </Form.Group>
          </Card.Body>
        </Card>
      )}
    </div>
  );
}
