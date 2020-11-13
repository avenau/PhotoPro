import React from "react";
import axios from "axios";
import { Award } from "react-bootstrap-icons";
import { OverlayTrigger, Popover, Tooltip } from "react-bootstrap";
import "./ShowdownBadge.scss";

interface Props {
  type: "photo" | "user";
  entry_id: string;
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
        params: { id: this.props.entry_id },
      })
      .then((res) => {
        this.setState({
          count: res.data.count,
        });
      });
  }

  render() {
    return this.state.count > -1 ? (
      <div className="showdown-badge">
        <OverlayTrigger
          placement="left"
          delay={{ show: 250, hide: 400 }}
          overlay={
            <Tooltip id="popover-basic">
              This {this.props.type} has won {this.state.count} showdowns!
            </Tooltip>
          }
        >
          <div>
            <Award size="2rem" style={{ color: "goldenrod" }} />
            {this.state.count}
          </div>
        </OverlayTrigger>
      </div>
    ) : (
      <></>
    );
  }
}
