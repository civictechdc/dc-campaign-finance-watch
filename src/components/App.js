import React from 'react';
import { Router, Route, IndexRoute } from 'react-router';
import ShellComponent from './layout/shell.jsx';
import SearchComponent from './searchComponent.jsx';
import DataComponent from './data/dataComponent.jsx';
import FaqComponent from './faq/faqComponent.jsx';
import AboutComponent from './about/AboutComponent.jsx';
import NewsComponent from './news/newsComponent.jsx';
import CampaignDetailComponent from './campaign/campaignDetailComponent.jsx';
import Dashboard from './dashboard/dashboardComponent.jsx';
import { browserHistory } from 'react-router';
import ContributionsGraphContainer from './graphs/contributions/contributionsGraphContainer'

require('../styles/main.css');
require('../styles/reactdaypicker.css');
require('../styles/fixed-data-table.min.css');

const App = () => (
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
);

export default App;
