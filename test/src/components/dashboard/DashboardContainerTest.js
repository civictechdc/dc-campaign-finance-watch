import React from 'react';
import { fetch } from 'whatwg-fetch';
import { shallow } from 'enzyme';
import { Row } from 'react-bootstrap';
import DashboardContainer from '../../../../src/components/dashboard/dashboardContainer';
import Dashboard from '../../../../src/components/dashboard/components/dashboard';


describe('<Dashboard Container />', () => {
  it('should render <Dashboard /> component', () => {
    const wrapper = shallow(<DashboardContainer />);
    expect(wrapper.find(Dashboard)).to.have.length(1);
  });

});
