import React from 'react';
import { Link } from 'react-router';

const ShellComponent = (props) => {
    return (
        <div className="container">
            <header>
                <div className="row">
                    <div className="col-sm-6">
                        <span>DC Campaign Finance</span>
                    </div>
                    <div className="col-sm-6">
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/about">About</Link></li>
                            <li><Link to="/faq">FAQ</Link></li>
                        </ul>
                    </div>
                </div>
            </header>
            {props.children}
        </div>
    );
};

export default ShellComponent;
