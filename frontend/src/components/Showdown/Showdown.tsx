import React from "react";
import axios from "axios";
import { RouteComponentProps, withRouter } from "react-router-dom";
import PrevShowdown from "./PrevShowdown";
import CurrShowdown from "./CurrShowdown";
import "./Showdown.scss";

interface Props extends RouteComponentProps {}

interface State {
  participants: Photo[];
  currentVote: string;
  prevWinnerPhoto: Photo | null;
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
}

class Showdown extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      participants: [],
      currentVote: "",
      prevWinnerPhoto: null,
    };
  }

  componentDidMount() {
    this.getShowdownData();
  }

  getShowdownData() {
    axios
      .get("/showdown", { params: { token: localStorage.getItem("token") } })
      .then((res) => {
        const { participants, prevWinnerPhoto, currentVote } = res.data;
        this.setState({
          participants,
          currentVote,
          prevWinnerPhoto,
        });
      });
  }

  render() {
    return (
      <div className="showdown-container">
        <div className="subcontainer">
          <h3>Last Showdown Winner</h3>
          <PrevShowdown photo={this.state.prevWinnerPhoto} />
        </div>
        <div className="subcontainer">
          <h3>Today&apos;s Photo Showdown</h3>
          <CurrShowdown photos={this.state.participants} />
        </div>
      </div>
    );
  }
}

export default withRouter(Showdown);
