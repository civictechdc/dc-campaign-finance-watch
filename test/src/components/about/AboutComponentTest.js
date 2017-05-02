import React from 'react';
import { fetch } from 'whatwg-fetch';
import { shallow } from 'enzyme';
import { Grid } from 'react-bootstrap';
import About from '../../../../src/components/about/AboutComponent';


describe('<AboutComponent />', () => {
  it('should have Grid wrapper', () => {
    const wrapper = shallow(<About/>);
    expect(wrapper.find(Grid)).to.have.length(1);
  });

});
