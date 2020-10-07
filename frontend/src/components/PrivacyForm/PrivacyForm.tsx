import React from "react";
import Questions from "../Questions/Questions";
import IPrivacyProps from "./IPrivacyProps";
import IPrivacyState from "./IPrivacyState";
import "./PrivacyForm.scss";

export default class PrivacyForm extends React.Component<IPrivacyProps, IPrivacyState> {
  constructor(props: IPrivacyProps) {
    super(props);
    this.state = {};
  }

  static defaultProps = {
    title: "No Title",
  };

  handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    if (event) {
      event.preventDefault();
    }
    fetch(`http://localhost:8001/manage_privacy`, {
      method: "POST",
      body: JSON.stringify(this.state),
    });
  }

  handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const name = event.target.name;
    this.setState({ [name]: event.target.value });
  }

  render() {
    return (
      <div className="container">
        <form className="privacy-form" onSubmit={(e) => this.handleSubmit(e)}>
          <Questions question="Can others see your first name?" name="first_name" onChange={(e) => this.handleChange(e)}></Questions>
          <br />
          <Questions question="Can others see your last name?" name="last_name" onChange={(e) => this.handleChange(e)}></Questions>
          <br />
          <Questions question="Can others see your age?" name="age" onChange={(e) => this.handleChange(e)}></Questions>
          <br />
          <Questions question="Can others see your date of birth?" name="dob" onChange={(e) => this.handleChange(e)}></Questions>
          <br />
          <Questions question="Can others see which city you live in" name="city" onChange={(e) => this.handleChange(e)}></Questions>
          <br />
          <Questions question="Can others see which country you live in" name="country" onChange={(e) => this.handleChange(e)}></Questions>

          <br></br>
          <br />
          <input type="submit" id="submit" value="Save" />
        </form>


      </div>
    );
  }
}
