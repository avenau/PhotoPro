import React from "react";
import axios from "axios";
import {Nav, Container, Navbar} from "react-bootstrap";
import Search from "../Search/Search";
import LoggedIn from './LoggedIn';
import LoggedOut from './LoggedOut';
import IToolbarProps from './IToolbarProps';
import IToolbarState from './IToolbarState';
import "bootstrap/dist/css/bootstrap.min.css";


class Toolbar extends React.Component<IToolbarProps, IToolbarState> {
  constructor(props:IToolbarProps) {
    super(props);
    this.getToken = this.getToken.bind(this);
    this.state = {
      isLoggedIn: false
    }
  }

  getToken(){
    let token = localStorage.getItem('token');
    if (token == null) {
      this.setState({isLoggedIn: false});
      return '';
    } else {
      this.setState({isLoggedIn: true});
      return token;
    }
  }

  getUsername(){
    axios.get('/userdetails', {
      params: {
        token: this.getToken()
      }
    })
    .then((res) => {
      return res.data.nickname;
    });
    return '';
  }

  WhichToolbar(props: IToolbarProps) {
    console.log(props.isLoggedIn);
    if(props.isLoggedIn){
      return <LoggedIn username={this.getUsername()}/>
    } else {
      return <LoggedOut />
    }
  }


  render() {
    return (
      <Container>
        <Navbar bg="light">
          <Navbar.Brand href="/">PhotoPro</Navbar.Brand>
          <Nav className="mr-auto">
            <this.WhichToolbar isLoggedIn={this.state.isLoggedIn}/>
            <Nav.Item>
              <Search />
            </Nav.Item>
          </Nav>
        </Navbar>
      </Container>
    );
  }
}

export default Toolbar;
