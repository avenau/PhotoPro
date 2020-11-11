import React from "react";
import { RouteComponentProps, withRouter } from 'react-router-dom';

import Modal from 'react-bootstrap/Modal';
import Album from '../PhotoEdit/Album';


interface Props extends RouteComponentProps {
  onChange: (active: boolean) => void;
  active: boolean;
}

interface State {
}

class CollectionListModal extends React.Component<Props, State> {
  constructor(props: Props){
    super(props);
    this.state = {};
  }

  handleChange(active: boolean) {
    this.props.onChange(active);
  }

  render(){
    return(
      <div>
        <Modal 
          show={this.props.active} 
          backdrop="static"
          animation={false}
          centered
        >
          <Modal.Body
            className="p-3"
          >
            <Album />
          </Modal.Body>
        </Modal>
      </div>)
  }
}

export default withRouter(CollectionListModal);
