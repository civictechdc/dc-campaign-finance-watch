import React from 'react';
import { shallow } from 'enzyme';
import { Navbar } from 'react-bootstrap';

import NavbarComponent from '../../../../src/components/layout/NavbarComponent';

describe('<NavbarComponent />', () => {
  it('should render Navbar', () => {
    const wrapper = shallow(<NavbarComponent/>);
    expect(wrapper.find(Navbar)).to.have.length(1);
  });
});
