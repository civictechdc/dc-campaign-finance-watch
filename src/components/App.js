import React from 'react';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom'
import NavbarComponent from './layout/NavbarComponent.jsx';
import SearchComponent from './searchComponent.jsx';
import DataContainer from './data/dataContainer.jsx';
import FaqComponent from './faq/faqComponent.jsx';
import AboutComponent from './about/AboutComponent.jsx';
import NewsComponent from './news/newsComponent.jsx';
import CampaignDetailComponent from './campaign/campaignDetailComponent.jsx';
import DashboardContainer from './dashboard/dashboardContainer.jsx';
import ContributionsGraphContainer
  from './graphs/contributions/contributionsGraphContainer';

require('../styles/main.css');
require('../styles/reactdaypicker.css');
require('../styles/fixed-data-table.min.css');

const App = () => (
  <Router>
    <div>
      <NavbarComponent />
      <div className="container">
        <img src="/images/dc_flag.svg" className="background"/>
        <Route exact path="/" component={DashboardContainer} />
        <Route path="/compare" component={SearchComponent} />
        <Route path="/faq" component={FaqComponent} />
        <Route path="/about" component={AboutComponent} />
        <Route path="/data" component={DataContainer} />
        <Route path="/news" component={NewsComponent} />
        <Route
          path="/contribution_graph"
          component={ContributionsGraphContainer}
        />
        <Route
          path="/candidate/:candidateId/campaign/:id"
          component={CampaignDetailComponent}
        />
      </div>
    </div>
  </Router>
);

export default App;
