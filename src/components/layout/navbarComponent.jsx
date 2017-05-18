import React from 'react';
import {Link} from 'react-router-dom';
import {Nav, Navbar, NavItem} from 'react-bootstrap';
import {IndexLinkContainer, LinkContainer} from 'react-router-bootstrap';

const NavbarComponent = () => {
  return (
    <Navbar staticTop={true}>
      <Navbar.Header>
        <Navbar.Brand>
          <Link to="/dc-campaign-finance-watch/">
            DC Campaign Finance
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle />
      </Navbar.Header>
      <Navbar.Collapse>
        <Nav eventKey={1}>
          <IndexLinkContainer to="/dc-campaign-finance-watch/">
            <NavItem eventKey={1.1}>Home</NavItem>
          </IndexLinkContainer>
          <LinkContainer to="/dc-campaign-finance-watch/compare">
            <NavItem eventKey={1.2}>Compare</NavItem>
          </LinkContainer>
          <LinkContainer to="/dc-campaign-finance-watch/about">
            <NavItem eventKey={1.3}>About</NavItem>
          </LinkContainer>
          <LinkContainer to="/dc-campaign-finance-watch/faq">
            <NavItem eventKey={1.4}>FAQ</NavItem>
          </LinkContainer>
          <LinkContainer to="/dc-campaign-finance-watch/news">
            <NavItem eventKey={1.5}>News</NavItem>
          </LinkContainer>
        </Nav>
        <Nav pullRight>
          <NavItem
            href="https://www.codefordc.org/dc-campaign-finance-watch/"
            className="code-for-dc-logo"
          >
            <img src="/images/logo_100px.png" alt="Code For DC"/>
          </NavItem>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavbarComponent;
