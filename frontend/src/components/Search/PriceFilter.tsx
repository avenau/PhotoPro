import React from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";

interface Props {
  min?: number;
  max?: number;
  onChange?: (min?: number, max?: number) => void;
}

interface State {
  min?: number;
  max?: number;
}

export default class PriceFilter extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      min: this.props.min,
      max: this.props.max,
    };
  }

  private handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    const { name } = event.target;
    this.setState(
      { [name]: Number.parseInt(event.target.value, 10) } as Pick<
        State,
        "min" | "max"
      >,
      () => {
        if (this.props.onChange !== undefined) {
          this.props.onChange(this.state.min, this.state.max);
        }
      }
    );
  }

  render() {
    return (
      <Form style={{ width: "175px" }}>
        <Form.Row>
          <Col>
            <Form.Control
              placeholder="Min"
              type="number"
              name="min"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                this.handleChange(e);
              }}
              value={this.state.min}
            />
          </Col>
          <Col>
            <Form.Control
              placeholder="Max"
              type="number"
              name="max"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                this.handleChange(e);
              }}
              value={this.state.max}
            />
          </Col>
        </Form.Row>
      </Form>
    );
  }
}
