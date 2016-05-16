import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute } from 'react-router';
import ShellComponent from './js/layout/shell.jsx';
import SearchComponent from './js/searchComponent.jsx';
import DataComponent from './js/data/dataComponent.jsx';
import FaqComponent from './js/faq/faqComponent.jsx';
import AboutComponent from './js/about/aboutComponent.jsx';
import NewsComponent from './js/news/newsComponent.jsx';
import CampaignDetailComponent from './js/campaign/campaignDetailComponent.jsx';
import { browserHistory } from 'react-router';

render((
    <Router history={browserHistory}>
        <Route path="/" component={ShellComponent}>
            <IndexRoute component={SearchComponent}/>
            <Route path="faq" component={FaqComponent}/>
            <Route path="about" component={AboutComponent}/>
            <Route path="data" component={DataComponent}/>
            <Route path="news" component={NewsComponent}/>
            <Route path="campaign/:id" component={CampaignDetailComponent}></Route>
        </Route>
    </Router>
), document.getElementById('app'));
