import React from "react";
import { Spinner } from "react-bootstrap";
import Button, { ButtonProps } from "react-bootstrap/Button";

interface Props extends ButtonProps {
  loading: boolean;
  onClick: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}

export default class LoadingButton extends React.Component<Props> {
  stopPropagation(e: React.MouseEvent<HTMLElement, MouseEvent>) {
    e.stopPropagation();
  }

  render() {
    return (
      <div
        onClick={this.props.loading ? this.stopPropagation : this.props.onClick}
      >
        <Button disabled={this.props.loading} {...this.props}>
          {this.props.loading ? (
            <Spinner animation="border" role="status" key="spin" size="sm">
              <span className="sr-only">Loading...</span>
            </Spinner>
          ) : (
            this.props.children
          )}
        </Button>
      </div>
    );
  }
}
