import React from "react";
import IQuestionProps from "./IQuestionProps";
import IQuestionState from "./IQuestionState";
import "./Questions.scss";

export default class Questions extends React.Component<IQuestionProps, IQuestionState> {
  constructor(props: IQuestionProps) {
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
        <label htmlFor={this.props.name}>{this.props.question}</label>
        <select name={this.props.name} id={this.props.name} onChange={(e) => this.props.onChange(e)}>
          <option value="" disabled selected>Select an Answer</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
      </div>
    );
  }
}
