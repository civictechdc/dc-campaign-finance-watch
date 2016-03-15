import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute } from 'react-router';
import ShellComponent from './js/layout/shell.jsx';
import DataCompoment from './js/dataComponent.jsx';
import { browserHistory } from 'react-router';

const FaqComponent = () => (
    <div>FAQ</div>
);

const AboutComponent = () => (
    <div>About</div>
);


render((
    <Router history={browserHistory}>
        <Route path="/" component={ShellComponent}>
            <IndexRoute component={DataCompoment}/>
            <Route path="faq" component={FaqComponent}/>
            <Route path="about" component={AboutComponent}/>
        </Route>
    </Router>
), document.getElementById('app'));
