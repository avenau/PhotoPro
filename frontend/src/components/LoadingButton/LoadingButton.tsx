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
    const { loading } = this.props;
    return (
      <div onClick={loading ? this.stopPropagation : undefined}>
        <Button
          disabled={loading}
          {...this.props}
          loading=""
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <>
            <div style={{ position: "absolute" }}>
              <Spinner
                animation="border"
                role="status"
                key="spin"
                size="sm"
                hidden={!loading}
              >
                <span className="sr-only">Loading...</span>
              </Spinner>
            </div>
            <div style={{ opacity: loading ? 0 : 1 }}>
              {this.props.children}
            </div>
          </>
        </Button>
      </div>
    );
  }
}
