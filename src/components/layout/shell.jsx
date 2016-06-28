import React from 'react';
import logo from '../../images/logo_100px.png';
import flag from '../../images/dc_flag.svg';
import { Link } from 'react-router';
import {
    Navbar,
    Nav,
    NavItem
} from 'react-bootstrap';
import { LinkContainer, IndexLinkContainer } from 'react-router-bootstrap';

const ShellComponent = (props) => {
    return (
        <div>
            <Navbar staticTop={true}>
                <Navbar.Header>
                    <Navbar.Brand>
                        <Link to="/">
                            DC Campaign Finance
                        </Link>
                    </Navbar.Brand>
                    <Navbar.Toggle/>
                </Navbar.Header>
                <Navbar.Collapse>
                    <Nav eventKey={1}>
                        <IndexLinkContainer to="/">
                            <NavItem eventKey={1.1}>Home</NavItem>
                        </IndexLinkContainer>
                        <LinkContainer to="/compare">
                            <NavItem eventKey={1.2}>Compare</NavItem>
                        </LinkContainer>
                        <LinkContainer to="/about">
                            <NavItem eventKey={1.3}>About</NavItem>
                        </LinkContainer>
                        <LinkContainer to="/faq">
                            <NavItem eventKey={1.4}>FAQ</NavItem>
                        </LinkContainer>
                        <LinkContainer to="/news">
                            <NavItem eventKey={1.5}>News</NavItem>
                        </LinkContainer>
                    </Nav>
                    <Nav pullRight>
                        <NavItem href="http://www.codefordc.org" className="code-for-dc-logo">
                            <img src={logo} alt="Code For DC"/>
                        </NavItem>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
            <div className="container">
                <img src={flag} className="background"/>
                {props.children}
            </div>
        </div>
    );
};

export default ShellComponent;
