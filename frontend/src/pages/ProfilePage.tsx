import axios from "axios";
import React from "react";
import { Dropdown } from "react-bootstrap";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { RouteComponentProps } from "react-router-dom";
import AlbumList from "../components/ProfileLists/AlbumList";
import CollectionList from "../components/ProfileLists/CollectionList";
import FollowingList from "../components/ProfileLists/FollowingList";
import PhotoList from "../components/ProfileLists/PhotoList";
import Toolbar from "../components/Toolbar/Toolbar";
import UserHeader from "../components/UserHeader/UserHeader";
import "./Profile.scss";

interface Props extends RouteComponentProps {}

interface State {
  fname: string;
  lname: string;
  nickname: string;
  location: string;
  email: string;
  userId: string;
  dne: boolean;
}

export default class ProfilePage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const { params } = this.props.match;
    const userId = Object.values(params)[0] as string;
    this.state = {
      fname: "",
      lname: "",
      nickname: "",
      location: "",
      email: "",
      userId,
      dne: false,
    };
  }

  componentDidMount() {
    this.getUserDetails(this.state.userId);
  }

  private getUserDetails(userId: string) {
    axios
      .get(`/profiledetails?u_id=${userId}`)
      .then((r) => {
        const newState = this.state as any;
        Object.entries(r.data).forEach((item) => {
          [, newState[item[0]]] = item;
        });
        this.setState(newState);
      })
      .catch(() => {
        const newState = this.state as any;
        newState.dne = true;
        this.setState(newState);
      });
  }

  /** Return add button if current user */
  private createAddButton() {
    // TODO Edit these links when the pages exist
    return (
      <Dropdown>
        <Dropdown.Toggle
          variant="outline-dark"
          id="dropdown-custom-components"
          style={{
            fontSize: "18pt",
            padding: "0rem 0.2rem",
            lineHeight: "20pt",
          }}
        >
          <span>+</span>
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item
            as="button"
            onClick={() => {
              alert("Navigating to new photo");
              this.props.history.push("/temp");
            }}
          >
            Upload Photo
          </Dropdown.Item>
          <Dropdown.Item
            as="button"
            onClick={() => {
              alert("Navigating to new album");
            }}
          >
            Create an Album
          </Dropdown.Item>
          <Dropdown.Item
            as="button"
            onClick={() => {
              alert("Navigating to new collection");
            }}
          >
            Create a Collection
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  }

  private redirect() {
    this.props.history.goBack();
  }

  render() {
    const userId = localStorage.getItem("u_id");
    const currentUser = this.state.userId === userId;
    return (
      <>
        <Modal
          backdrop="static"
          show={this.state.dne}
          onHide={() => this.redirect()}
          animation={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>User Not Found</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <p>
              The user you were looking for could not be found, please try again
              later.
            </p>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="primary" onClick={() => this.redirect()}>
              Go Back
            </Button>
          </Modal.Footer>
        </Modal>
        <Toolbar />
        <UserHeader
          currentUser={currentUser}
          showEdit
          header
          name={`${this.state.fname} ${this.state.lname}`}
          nickname={this.state.nickname}
          location={this.state.location}
          email={this.state.email}
        />
        <br />
        <Tabs
          defaultActiveKey="showcase"
          id="uncontrolled-tab-example"
          transition={false}
        >
          <Tab eventKey="showcase" title="Showcase">
            <PhotoList />
          </Tab>
          <Tab eventKey="albums" title="Albums">
            <AlbumList />
          </Tab>
          <Tab eventKey="collections" title="Collections">
            <CollectionList />
          </Tab>
          {currentUser ? (
            <Tab eventKey="following" title="Following">
              <FollowingList />
            </Tab>
          ) : (
            <></>
          )}
          {currentUser ? (
            <Tab title={this.createAddButton()} tabClassName="no-border" />
          ) : (
            <></>
          )}
        </Tabs>
      </>
    );
  }
}
