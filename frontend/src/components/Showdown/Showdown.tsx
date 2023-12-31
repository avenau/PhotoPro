import axios from "axios";
import React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import LoadingPage from "../../pages/LoadingPage";
import CurrShowdown from "./CurrShowdown";
import PrevShowdown from "./PrevShowdown";
import "./Showdown.scss";

interface Props extends RouteComponentProps {
  refreshCredits: () => void;
}

interface State {
  participants: Photo[];
  currentVote: string;
  prevWinnerPhoto: Photo | null;
  currentId: string;
  loading: boolean;
}

interface Photo {
  id: string;
  title: string;
  price: number;
  discount: number;
  photoStr: string;
  metadata: string;
  user: string;
  owns: boolean; // purchased or posted
  participantId: string;
  votes: number;
  deleted: boolean;
}

class Showdown extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      participants: [],
      currentVote: "",
      prevWinnerPhoto: null,
      currentId: "",
      loading: true,
    };
  }

  componentDidMount() {
    this.getShowdownData();
  }

  getShowdownData() {
    this.setState({ loading: true });
    axios
      .get("/showdown", { params: { token: localStorage.getItem("token") } })
      .then((res) => {
        const {
          participants,
          prevWinnerPhoto,
          currentVote,
          currentId,
        } = res.data;
        this.setState({
          loading: false,
          participants,
          currentVote,
          prevWinnerPhoto,
          currentId,
        });
      })
      .catch(() => {});
  }

  render() {
    return (
      <div className="showdown-container">
        <div className="subcontainer">
          <h3>Last Showdown Winner</h3>
          {this.state.loading ? (
            <LoadingPage />
          ) : (
            <PrevShowdown photo={this.state.prevWinnerPhoto} />
          )}
        </div>
        <div className="subcontainer">
          <h3>Today&apos;s Photo Showdown</h3>
          {this.state.loading ? (
            <LoadingPage />
          ) : (
            <CurrShowdown
              photos={this.state.participants}
              currentVote={this.state.currentVote}
              currentId={this.state.currentId}
              refreshCredits={this.props.refreshCredits}
            />
          )}
        </div>
      </div>
    );
  }
}

export default withRouter(Showdown);
