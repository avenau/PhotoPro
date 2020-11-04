import axios from "axios";
import React from "react";
import { Dropdown } from "react-bootstrap";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import InfiniteScroll from "react-infinite-scroller";
import { RouteComponentProps } from "react-router-dom";
import AlbumList from "../components/Lists/AlbumList";
import CollectionList from "../components/Lists/CollectionList";
import UserList from "../components/Lists/UserList";
import PhotoList from "../components/Lists/PhotoList";
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
  profilePic: string[];
  photoSearch: requestDetails;
  collectionSearch: requestDetails;
  albumSearch: requestDetails;
  followingSearch: requestDetails;
  loading: boolean;
}

interface requestDetails {
  offset: number;
  limit: number;
  results: any[];
  atEnd: boolean;
}

export default class ProfilePage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const { params } = this.props.match;
    const userId = Object.values(params)[0] as string;
    const defaultResults = {
      limit: 5,
      offset: 0,
      results: [],
      atEnd: false,
    };
    this.state = {
      loading: false,
      fname: "",
      lname: "",
      nickname: "",
      location: "",
      email: "",
      userId,
      dne: false,
      profilePic: ["", ""],
      albumSearch: defaultResults,
      collectionSearch: defaultResults,
      followingSearch: defaultResults,
      photoSearch: defaultResults,
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
              this.props.history.push("/upload");
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

  private getPhotos() {
    this.setState({ loading: true });
    axios
      .get(`/user/photos`, {
        params: {
          u_id: this.state.userId,
          offset: this.state.photoSearch.offset,
          limit: this.state.photoSearch.limit,
          token: localStorage.getItem("token"),
        },
      })
      .then((res) => {
        this.setState((prevState) => ({
          loading: false,
          photoSearch: {
            results: [...prevState.photoSearch.results, ...res.data],
            offset: prevState.photoSearch.offset + res.data.length,
            atEnd: res.data.length < prevState.photoSearch.limit,
            limit: prevState.photoSearch.limit,
          },
        }));
      })
      .catch(() => {});
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
          profilePic={this.state.profilePic}
          className="user-header"
        />
        <br />
        <Tabs
          defaultActiveKey="showcase"
          id="uncontrolled-tab-example"
          transition={false}
        >
          <Tab eventKey="showcase" title="Showcase">
            <InfiniteScroll
              hasMore={!this.state.photoSearch.atEnd && !this.state.loading}
              loadMore={() => this.getPhotos()}
              loader={
                <Spinner
                  animation="border"
                  role="status"
                  style={{ display: "block", margin: "40px" }}
                  key="spin"
                >
                  <span className="sr-only">Loading...</span>
                </Spinner>
              }
            >
              <PhotoList photos={this.state.photoSearch.results} />
            </InfiniteScroll>
          </Tab>
          <Tab eventKey="albums" title="Albums">
            <AlbumList albums={[]} />
          </Tab>
          <Tab eventKey="collections" title="Collections">
            <CollectionList collections={[]} />
          </Tab>
          {currentUser ? (
            <Tab eventKey="following" title="Following">
              <UserList users={[]} />
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
