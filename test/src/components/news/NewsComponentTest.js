import React from 'react';
import { shallow } from 'enzyme';
import { Grid } from 'react-bootstrap';

import NewsComponent from '../../../../src/components/news/newsComponent';

describe('<NewsComponent />', () => {
  it('should render Grid', () => {
    const wrapper = shallow(<NewsComponent/>);
    expect(wrapper.find(Grid)).to.have.length(1);
  });
});
