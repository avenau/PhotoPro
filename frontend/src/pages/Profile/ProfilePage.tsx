import axios from "axios";
import React from "react";
import { Dropdown } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { RouteComponentProps, withRouter } from "react-router-dom";
import ContentLoader from "../../components/ContentLoader/ContentLoader";
import CreateCatalogueModal from "../../components/ProfilePage/CreateCatalogueModal";
import UserHeader from "../../components/UserHeader/UserHeader";
import LoadingPage from "../LoadingPage";
import "./Profile.scss";

interface Props extends RouteComponentProps {
  refreshCredits: () => void;
}

interface State {
  fname: string;
  lname: string;
  nickname: string;
  location: string;
  email: string;
  userId: string;
  aboutMe?: string;
  dne: boolean;
  profilePic: string[];
  newAlbum: boolean;
  newCollection: boolean;
  title: string;
  following: boolean;
  pageLoading: boolean;
  contributor: boolean;
}

class ProfilePage extends React.Component<Props, State> {
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
      profilePic: ["", ""],
      newAlbum: false,
      newCollection: false,
      title: "",
      following: false,
      pageLoading: true,
      contributor: true,
    };
  }

  componentDidMount() {
    this.getUserDetails(this.state.userId);
    document.title = `User | PhotoPro`;
  }

  private getUserDetails(userId: string) {
    axios
      .get(
        `/profiledetails?u_id=${userId}&token=${localStorage.getItem("token")}`
      )
      .then((r) => {
        const newState = this.state as any;
        Object.entries(r.data).forEach((item) => {
          [, newState[item[0]]] = item;
        });
        this.setState(newState);
        this.setState({ pageLoading: false });
        document.title = `@${r.data.nickname} | PhotoPro`;
      })
      .catch(() => {
        const newState = this.state as any;
        newState.dne = true;
        this.setState(newState);
        this.setState({ pageLoading: false });
      });
  }

  /** Return add button if current user */
  private createAddButton() {
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
            Upload a Photo
          </Dropdown.Item>
          <Dropdown.Item
            as="button"
            onClick={() => {
              this.setState({ newAlbum: true });
            }}
          >
            Create an Album
          </Dropdown.Item>
          <Dropdown.Item
            as="button"
            onClick={() => {
              this.setState({ newCollection: true });
            }}
          >
            Create a Collection
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  }

  render() {
    const userId = localStorage.getItem("u_id");
    const isCurrentUser = this.state.userId === userId;
    return this.state.pageLoading ? (
      <LoadingPage />
    ) : (
      <>
        <div className="profile-page">
          <Modal
            backdrop="static"
            show={this.state.dne}
            onHide={() => this.props.history.goBack()}
            animation={false}
          >
            <Modal.Header closeButton>
              <Modal.Title>User Not Found</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <p>
                The user you were looking for could not be found, please try
                again later. Maybe tomorrow...
              </p>
            </Modal.Body>

            <Modal.Footer>
              <Button
                variant="primary"
                onClick={() => this.props.history.goBack()}
              >
                Go Back
              </Button>
            </Modal.Footer>
          </Modal>
          {/* Passing state down to Album Modal */}
          <CreateCatalogueModal
            active={this.state.newAlbum}
            onCatalogueChange={(active) => this.setState({ newAlbum: active })}
            type="album"
          />
          <CreateCatalogueModal
            active={this.state.newCollection}
            onCatalogueChange={(active) =>
              this.setState({ newCollection: active })
            }
            type="collection"
          />
          <UserHeader
            isCurrentUser={isCurrentUser}
            showEdit
            header
            name={`${this.state.fname} ${this.state.lname}`}
            nickname={this.state.nickname}
            location={this.state.location}
            email={this.state.email}
            aboutMe={this.state.aboutMe}
            profilePic={this.state.profilePic}
            userId={this.state.userId}
            className="user-header"
            following={this.state.following}
            contributor={this.state.contributor}
          />
          <br />
          <Tabs
            defaultActiveKey="showcase"
            id="uncontrolled-tab-example"
            transition={false}
          >
            <Tab eventKey="showcase" title="Showcase" unmountOnExit>
              <ContentLoader
                query={this.state.userId}
                route="/user/photos"
                type="photo"
                refreshCredits={this.props.refreshCredits}
                noContentMessage="You have not posted any photos."
              />
            </Tab>
            <Tab eventKey="albums" title="Albums" unmountOnExit>
              <ContentLoader
                query={this.state.userId}
                route="/user/albums"
                type="album"
                noContentMessage="You have not created any Albums."
              />
            </Tab>
            <Tab eventKey="collections" title="Collections" unmountOnExit>
              <ContentLoader
                query={this.state.userId}
                route="/user/collections"
                type="collection"
                noContentMessage="You have not created any Collections."
              />
            </Tab>
            {isCurrentUser ? (
              <Tab eventKey="following" title="Following" unmountOnExit>
                <ContentLoader
                  query={this.state.userId}
                  route="/user/following"
                  type="user"
                  noContentMessage="You are not following any Contributors."
                />
              </Tab>
            ) : (
              <></>
            )}
            {isCurrentUser ? (
              <Tab title={this.createAddButton()} tabClassName="no-border" />
            ) : (
              <></>
            )}
          </Tabs>
        </div>
      </>
    );
  }
}

export default withRouter(ProfilePage);
