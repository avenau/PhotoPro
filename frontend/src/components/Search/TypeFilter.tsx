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

export default class TypeFilter extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      selection: this.props.filetype,
    };
  }

  private updateSelection(name: string, typeid: string) {
    this.setState({ selection: name });
    if (this.props.onChange !== undefined) this.props.onChange(typeid);
  }

  render() {
    return (
      <>
        <DropdownButton
          className="search-dropdown"
          variant="light"
          title={this.state.selection}
        >
          <Dropdown.Item
            onClick={() => this.updateSelection("All", "all")}
            active={this.state.selection === "All"}
          >
            All
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => this.updateSelection("JPG/PNG", "jpgpng")}
            active={this.state.selection === "JPG/PNG"}
          >
            JPG/PNG
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => this.updateSelection("GIF", "gif")}
            active={this.state.selection === "GIF"}
          >
            GIF
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => this.updateSelection("SVG", "svg")}
            active={this.state.selection === "SVG"}
          >
            SVG
          </Dropdown.Item>
        </DropdownButton>
      </>
    );
  }
}
