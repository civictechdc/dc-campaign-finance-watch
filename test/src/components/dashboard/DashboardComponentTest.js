import React from 'react';
import {fetch} from 'whatwg-fetch';
import {shallow} from 'enzyme';
import {Row} from 'react-bootstrap';
import Dashboard from '../../../../src/components/dashboard/dashboardComponent';

describe('<Dashboard Component />', () => {

  it('should render three <Dashboard /> components', () => {
    const wrapper = shallow(<Dashboard />);
    expect(wrapper.find(Row)).to.have.length(3);
  });

});
