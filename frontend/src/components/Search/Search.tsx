import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { RouteComponentProps, withRouter } from "react-router-dom";

interface Props extends RouteComponentProps {
  type?: string;
}

interface State {
  q: string;
}

class Search extends Component<Props, State> {
  static defaultProps = {
    type: "user",
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      q: "",
    };
  }

  private handleSubmit(event: React.FormEvent<HTMLElement>) {
    event.preventDefault();
    console.log(this.state.q);
    const query = encodeURI(this.state.q);
    this.props.history.push(`/search/${this.props.type}?q=${query}`);
  }

  private handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    const { name } = event.target;
    const newState = {} as State & { [index: string]: string };
    Object.assign(newState, this.state);
    newState[name] = event.target.value;

    // { [name]: event.target.value }
    this.setState(newState);
  }

  render() {
    return (
      <Form
        inline
        onSubmit={(e) => {
          this.handleSubmit(e);
        }}
      >
        <Form.Control
          placeholder="Search"
          className="mr-sm-2"
          name="q"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            this.handleChange(e);
          }}
        />
        <Button type="submit" variant="outline-success">
          Search
        </Button>
      </Form>
    );
  }
}

export default withRouter(Search);
