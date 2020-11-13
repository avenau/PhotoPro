import React from "react";
import { OverlayTrigger, OverlayTriggerProps, Tooltip } from "react-bootstrap";

interface Props extends Omit<OverlayTriggerProps, "overlay"> {
  helpfulText: string;
  id: string;
}

export default class HoverText extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  renderTooltip() {
    return <Tooltip id={this.props.id}>{this.props.helpfulText}</Tooltip>;
  }

  render() {
    return (
      <OverlayTrigger
        placement="top"
        delay={{ show: 100, hide: 150 }}
        overlay={this.renderTooltip()}
      >
        {this.props.children}
      </OverlayTrigger>
    );
  }
}
