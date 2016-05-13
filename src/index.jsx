import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute } from 'react-router';
import ShellComponent from 'components/layout/shell.jsx';
import SearchComponent from './components/searchComponent.jsx';
import DataComponent from 'components/data/dataComponent.jsx';
import FaqComponent from 'components/faq/faqComponent.jsx';
import AboutComponent from 'components/about/AboutComponent.jsx';
import NewsComponent from 'components/news/newsComponent.jsx';
import { browserHistory } from 'react-router';

render((
    <Router history={browserHistory}>
        <Route path="/" component={ShellComponent}>
            <IndexRoute component={SearchComponent}/>
            <Route path="faq" component={FaqComponent}/>
            <Route path="about" component={AboutComponent}/>
            <Route path="data" component={DataComponent}/>
            <Route path="news" component={NewsComponent}/>
        </Route>
    </Router>
), document.getElementById('app'));
