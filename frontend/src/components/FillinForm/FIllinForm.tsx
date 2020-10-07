import React from "react";
import FillinFormProp from "./FillinFormProps";
import FillinFormState from "./FillinFormState";
import "./FillinForm.scss";

export default class Questions extends React.Component<FillinFormProp, FillinFormState> {
  constructor(props: FillinFormProp) {
    super(props);
    this.state = {};
  }

  static defaultProps = {
    title: "No Title",
  };

  handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const name = event.target.name;
    this.setState({ [name]: event.target.value });
  }

  render() {
    return (
      <div className="container">
        <label htmlFor={this.props.id_name}>{this.props.title}</label>
        <select name={this.props.id_name} id={this.props.id_name} onChange={(e) => this.props.onChange(e)}>
          <option value="" disabled selected>Select an Answer</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
      </div>
    );
  }
}
