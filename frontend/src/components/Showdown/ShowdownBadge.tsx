import React from "react";
import axios from "axios";
import { Award } from "react-bootstrap-icons";
import "./ShowdownBadge.scss";
import HoverText from "../HoverText";

interface Props {
  type: "photo" | "user";
  entryId: string;
}

interface State {
  count: number;
}

export default class ShowdownBadge extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      count: 0,
    };
  }

  componentDidMount() {
    this.countWins();
  }

  countWins() {
    axios
      .get(`/showdownwins/${this.props.type}`, {
        params: { id: this.props.entryId },
      })
      .then((res) => {
        this.setState({
          count: res.data.wins,
        });
      });
  }

  render() {
    console.log(this.state);

    return this.state.count > 0 ? (
      <div className="showdown-badge">
        <HoverText
          placement="top"
          helpfulText={`This ${this.props.type} has won ${this.state.count} ${
            this.state.count === 1 ? "showdown" : "showdowns"
          }!`}
          id="showdown-badge"
        >
          <div>
            <Award size="2rem" style={{ color: "goldenrod" }} />
            {this.state.count}
          </div>
        </HoverText>
      </div>
    ) : (
      <></>
    );
  }
}
