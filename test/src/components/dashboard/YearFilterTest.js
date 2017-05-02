import React from 'react';
import { shallow } from 'enzyme';
import { Row } from 'react-bootstrap';
import YearFilter from '../../../../src/components/dashboard/components/yearFilter';


describe('<YearFilter />', () => {
  it('should render', () => {
    const wrapper = shallow(<YearFilter />);
    expect(wrapper.find('div')).to.have.length(1);
  });
});
