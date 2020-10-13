import React from "react";
import { Dropdown } from "react-bootstrap";
import { PencilSquare } from "react-bootstrap-icons";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { Link, RouteComponentProps } from "react-router-dom";
import BaseList from "../components/ProfileLists/BaseList";
import AlbumList from "../components/ProfileLists/AlbumList";
import CollectionList from "../components/ProfileLists/CollectionList";
import FollowingList from "../components/ProfileLists/FollowingList";
import PhotoList from "../components/ProfileLists/PhotoList";
import Toolbar from "../components/Toolbar/Toolbar";
import UserHeader from "../components/UserHeader/UserHeader";
import "./Profile.scss";

interface Props extends RouteComponentProps {}

interface State {
  key: string;
}

export default class ProfilePage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      key: "showcase",
    };
  }
  /** Return edit button if current user */
  private createEditButton() {
    let val = false;
    if (val) {
      return;
    }
    return (
      <Link to="/manageaccount">
        <PencilSquare size="2rem" color="#343a40" />
      </Link>
    );
  }
  /** Return add button if current user */
  private createAddButton() {
    let val = false;
    if (val) {
      return;
    }
    // TODO Edit these links when the pages exist
    return (
      <Dropdown>
        <Dropdown.Toggle
          variant="outline-dark"
          id="dropdown-custom-components"
          style={{ fontSize: "16pt", padding: "0rem 0.3rem" }}
        >
          <span>+</span>
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item
            as="button"
            onClick={() => {
              alert("Navigating to new photo");
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

  render() {
    const params = this.props.match.params;
    const user_id = Object.values(params)[0];
    console.log(user_id);

    return (
      <>
        <Toolbar />
        <UserHeader />
        {this.createEditButton()}
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
          <Tab eventKey="following" title="Following">
            <FollowingList />
          </Tab>
          <Tab title={this.createAddButton()} tabClassName="no-border"></Tab>
        </Tabs>
      </>
    );
  }
}
