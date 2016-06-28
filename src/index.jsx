import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute } from 'react-router';
import ShellComponent from 'components/layout/shell.jsx';
import SearchComponent from './components/searchComponent.jsx';
import DataComponent from 'components/data/dataComponent.jsx';
import FaqComponent from 'components/faq/faqComponent.jsx';
import AboutComponent from 'components/about/AboutComponent.jsx';
import NewsComponent from 'components/news/newsComponent.jsx';
import CampaignDetailComponent from 'components/campaign/campaignDetailComponent.jsx';
import Dashboard from 'components/dashboard/dashboardComponent.jsx';
import { browserHistory } from 'react-router';
import ContributionsGraphContainer from './components/graphs/contributions/contributionsGraphContainer'

require('./styles/main.css');
require('./styles/reactdaypicker.css');
require('./styles/fixed-data-table.min.css');

render((
    <Router history={browserHistory}>
        <Route path="/" component={ShellComponent}>
            <IndexRoute component={Dashboard}/>
            <Route path="compare" component={SearchComponent}/>
            <Route path="faq" component={FaqComponent}/>
            <Route path="about" component={AboutComponent}/>
            <Route path="data" component={DataComponent}/>
            <Route path="news" component={NewsComponent}/>
            <Route path="contribution_graph" component={ContributionsGraphContainer} />
            <Route path="candidate/:candidateId/campaign/:id" component={CampaignDetailComponent}></Route>
        </Route>
    </Router>
), document.getElementById('app'));
