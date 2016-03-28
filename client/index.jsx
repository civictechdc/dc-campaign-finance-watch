import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute } from 'react-router';
import ShellComponent from './js/layout/shell.jsx';
import SearchComponent from './js/searchComponent.jsx';
import DataComponent from './js/data/dataComponent.jsx';
import FaqComponent from './js/faq/faqComponent.jsx';
import AboutComponent from './js/about/aboutComponent.jsx';
import { browserHistory } from 'react-router';

render((
    <Router history={browserHistory}>
        <Route path="/" component={ShellComponent}>
            <IndexRoute component={SearchComponent}/>
            <Route path="faq" component={FaqComponent}/>
            <Route path="about" component={AboutComponent}/>
            <Route path="data" component={DataComponent}/>
        </Route>
    </Router>
), document.getElementById('app'));
