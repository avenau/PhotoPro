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
  /*
    async/await function forces the browser to wait for
    the axios.get request to return
  */
  async getUsername(token:any){
    const res = await axios.get('/userdetails', {
      params: {
        token: token
      }
    })
    return await res.data;
  }

  constructor(props:IToolbarProps) {
    super(props);
    let token = (!localStorage.getItem('token')) ? '' : localStorage.getItem('token');
    if (!token)
      token = '';

    this.state = {
      username: '',
      token: token,
    }
  }

  componentDidMount() {
    if (this.state.token != ''){
      this.getUsername(this.state.token)
      .then((res) => {
        this.setState({username: res.nickname})
      });
    }
  }

  render() {
    let username = this.state.username;
    const tool = username == '' ? <LoggedOut/> : <LoggedIn username={username}/>
    return (
      <Container>
        <Navbar bg="light">
          <Navbar.Brand href="/">PhotoPro</Navbar.Brand>
          <Nav className="mr-auto">
            {tool}
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
