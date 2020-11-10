import React from "react";
import { PencilSquare, XSquare } from "react-bootstrap-icons";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import "./AlbumHeader.scss";
import axios from "axios";
import ConfirmDelete from "./ConfirmDelete";

interface AlbumHeaderProps extends RouteComponentProps {
  catalogueId: string;
  isOwner?: boolean;
  token: string;
  type: "album" | "collection";
}

interface AlbumHeaderState {
  modalDelete: boolean;
}
class AlbumHeader extends React.Component<AlbumHeaderProps, AlbumHeaderState> {
  constructor(props: AlbumHeaderProps) {
    super(props);
    this.state = {
      modalDelete: false,
    };
  }

  handleDelete() {
    axios.delete(`/${this.props.type}/delete`, {
      params: {
        token: this.props.token,
        _id: this.props.catalogueId,
      },
    })
    .then(() => this.props.history.push("/"))
    .catch()
  }

  render() {
    const path = `/${this.props.type}/manage/${this.props.catalogueId}`;
    return this.props.isOwner ? (
      <div className="album-header-container">
        <Link to={path} className="mr-3">
          <PencilSquare size="2rem" color="#343a40" />
        </Link>
        <div
          className="album-header-delete-button"
          onClick={() => this.setState({modalDelete: true})}
        >
          <XSquare size="2rem" color="#b00b1e" />
        </div>
        <ConfirmDelete 
          modalDelete={this.state.modalDelete}
          setModalDelete={(display: boolean) => this.setState({modalDelete: display})}
          catalogue={this.props.type}
          handleDelete={() => this.handleDelete()}
          />
      </div>
    ) : (
      <></>
    );
  }
}
export default withRouter(AlbumHeader);
