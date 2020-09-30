import React from "react";
import IFormProps from "./IFormProps";
import IFormState from "./IFormState";
import "./Form.scss";

export default class Form extends React.Component<IFormProps, IFormState> {
  constructor(props: IFormProps) {
    super(props);
    this.state = {};
  }

  static defaultProps = {
    title: "title",
  };

  handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    if (event) {
      event.preventDefault();
    }
    fetch(`http://localhost:8001/start`, {
      method: "POST",
      body: JSON.stringify(this.state),
    });
  }

  handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const name = event.target.name;
    this.setState({ [name]: event.target.value });
  }

  render() {
    return (
      <div className="container">
        <div>{this.props.title}</div>
        <form className="test-form" onSubmit={(e) => this.handleSubmit(e)}>
          <input
            type="text"
            name="name"
            placeholder="First Name"
            onChange={(e) => this.handleChange(e)}
          />
          <input
            type="text"
            name="colour"
            placeholder="Fav Colour"
            onChange={(e) => this.handleChange(e)}
          />
          <input type="submit" id="submit" />
        </form>
      </div>
    );
  }
}
