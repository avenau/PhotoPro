import React from "react";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";

interface Props {
  filetype: string;
  onChange?: (orderid: string) => void;
}

interface State {
  selection: string;
}

const mapping: { [key: string]: string } = {
  all: "All",
  jpgpng: "JPG/PNG",
  svg: "SVG",
};

export default class TypeFilter extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      selection: this.props.filetype,
    };
  }

  private updateSelection(typeid: string) {
    this.setState({ selection: typeid });
    if (this.props.onChange !== undefined) this.props.onChange(typeid);
  }

  render() {
    return (
      <>
        <DropdownButton
          className="search-dropdown"
          variant="light"
          title={mapping[this.state.selection]}
        >
          <Dropdown.Item
            onClick={() => this.updateSelection("all")}
            active={this.state.selection === "all"}
          >
            All
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => this.updateSelection("jpgpng")}
            active={this.state.selection === "jpgpng"}
          >
            JPG/PNG
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => this.updateSelection("svg")}
            active={this.state.selection === "svg"}
          >
            SVG
          </Dropdown.Item>
        </DropdownButton>
      </>
    );
  }
}
