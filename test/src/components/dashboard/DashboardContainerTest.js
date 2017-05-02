import React from 'react';
import { shallow } from 'enzyme';
import { Row } from 'react-bootstrap';
import DashboardContainer from '../../../../src/components/dashboard/dashboardContainer';
import Dashboard from '../../../../src/components/dashboard/components/dashboard';


describe('<DashboardContainer />', () => {
  it('should render <Dashboard /> child component', () => {
    const wrapper = shallow(<DashboardContainer />);
    expect(wrapper.find(Dashboard)).to.have.length(1);
  });
});
