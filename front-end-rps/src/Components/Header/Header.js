import React, { Component } from 'react';
import './Header.css';
import { Nav, Navbar } from 'react-bootstrap';
import Image from '../../Assets/Images/logo.jpg';

class Header extends Component {
  render() {
    return (
      <header>
        <Navbar
          sticky='top'
          collapseOnSelect
          expand='lg'
          bg='dark'
          variant='dark'
        >
          <Navbar.Brand href='#home'>
            <img
              src={Image}
              width='40'
              height='40'
              className='rounded d-inline-block align-top'
              alt='logo'
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls='responsive-navbar-nav' />
          <Navbar.Collapse id='responsive-navbar-nav'>
            <Nav className='ml-auto'>
              <Nav.Link href='#sectioncreate'>Create Session</Nav.Link>
              <Nav.Link href='#sectionjoin'>Join Session</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </header>
    );
  }
}
export default Header;
