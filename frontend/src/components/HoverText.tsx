import React from "react";
import { OverlayTrigger, OverlayTriggerProps, Tooltip } from "react-bootstrap";

interface Props extends Omit<OverlayTriggerProps, "overlay"> {
  helpfulText: string;
  id: string;
}

export default class HoverText extends React.Component<Props> {
  renderTooltip = () => {
    return <Tooltip id={this.props.id}>{this.props.helpfulText}</Tooltip>;
  };

  render() {
    return (
      <OverlayTrigger
        placement="top"
        delay={{ show: 100, hide: 150 }}
        overlay={this.renderTooltip()}
        transition={false}
      >
        {({ ref, ...triggerHandler }) => (
          <div ref={ref} {...triggerHandler}>
            {this.props.children}
          </div>
        )}
      </OverlayTrigger>
    );
  }
}
