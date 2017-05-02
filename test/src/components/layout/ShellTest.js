import React from 'react';
import { shallow } from 'enzyme';
import { Navbar } from 'react-bootstrap';

import ShellComponent from '../../../../src/components/layout/shellComponent';

describe('<ShellComponent />', () => {
  it('should render Navbar', () => {
    const wrapper = shallow(<ShellComponent/>);
    expect(wrapper.find(Navbar)).to.have.length(1);
  });
});
