import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { RouteComponentProps, withRouter } from "react-router-dom";
import InputGroup from "react-bootstrap/InputGroup";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import { Search as SearchIcon } from "react-bootstrap-icons";
import "./Search.scss";

interface Props extends RouteComponentProps {
  type?: string;
  prefill?: string;
}

interface State {
  q: string;
  type: string;
}

class Search extends Component<Props, State> {
  static defaultProps = {
    type: "photo",
    prefill: "",
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      q: this.props.prefill!,
      type: this.props.type!,
    };
  }

  private handleSubmit(event: React.FormEvent<HTMLElement>) {
    event.preventDefault();
    const query = encodeURI(this.state.q);
    this.props.history.push(`/search/${this.state.type}?q=${query}`);
  }

  private handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    const { name } = event.target;
    this.setState({ [name]: event.target.value } as Pick<State, keyof State>);
  }

  render() {
    return (
      <Form
        inline
        onSubmit={(e) => {
          this.handleSubmit(e);
        }}
      >
        <InputGroup>
          <DropdownButton
            as={InputGroup.Prepend}
            className="search-dropdown"
            variant="light"
            title={`${this.state.type
              .charAt(0)
              .toUpperCase()}${this.state.type.slice(1)}`}
          >
            <Dropdown.Item
              onClick={() => this.setState({ type: "photo" })}
              active={this.state.type.toLowerCase() === "photo"}
            >
              Photo
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => this.setState({ type: "user" })}
              active={this.state.type.toLowerCase() === "user"}
            >
              User
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => this.setState({ type: "collection" })}
              active={this.state.type.toLowerCase() === "collection"}
            >
              Collection
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => this.setState({ type: "album" })}
              active={this.state.type.toLowerCase() === "album"}
            >
              Album
            </Dropdown.Item>
          </DropdownButton>
          <Form.Control
            placeholder="Search"
            name="q"
            value={this.state.q}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              this.handleChange(e);
            }}
          />
          <InputGroup.Append>
            <Button type="submit" variant="light" className="search-button">
              <SearchIcon />
            </Button>
          </InputGroup.Append>
        </InputGroup>
      </Form>
    );
  }
}

export default withRouter(Search);
