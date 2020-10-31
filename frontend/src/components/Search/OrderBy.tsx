import React from "react";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";

interface Props {
  type: string;
  orderby: string;
  onChange?: (orderid: string) => void;
}

interface State {
  selection: string;
}

export default class OrderBy extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      selection: this.props.orderby,
    };
  }

  private mapping = {
    recent: "Most Recent",
    old: "Oldest",
    low: "Price Low - High",
    high: "Price High - Low",
    az: "A - Z",
    za: "Z - A",
  } as { [key: string]: string };

  private updateSelection(orderid: string) {
    this.setState({ selection: orderid });
    if (this.props.onChange !== undefined) this.props.onChange(orderid);
  }

  render() {
    return (
      <>
        <DropdownButton
          className="search-dropdown"
          variant="light"
          title={this.mapping[this.state.selection]}
        >
          <Dropdown.Item
            onClick={() => this.updateSelection("recent")}
            active={this.state.selection === "recent"}
          >
            Most Recent
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => this.updateSelection("old")}
            active={this.state.selection === "old"}
          >
            Oldest
          </Dropdown.Item>
          {this.props.type === "photo" ? (
            <>
              <Dropdown.Item
                onClick={() => this.updateSelection("low")}
                active={this.state.selection === "low"}
              >
                Price Low - High
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => this.updateSelection("high")}
                active={this.state.selection === "high"}
              >
                Price High - Low
              </Dropdown.Item>
            </>
          ) : (
            <></>
          )}
          <Dropdown.Item
            onClick={() => this.updateSelection("az")}
            active={this.state.selection === "az"}
          >
            A - Z
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => this.updateSelection("za")}
            active={this.state.selection === "za"}
          >
            Z - A
          </Dropdown.Item>
        </DropdownButton>
      </>
    );
  }
}
