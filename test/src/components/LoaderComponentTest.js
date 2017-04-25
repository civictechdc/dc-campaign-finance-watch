import React from 'react';
import { shallow } from 'enzyme';
import LoaderComponent from '../../../src/components/loader.component';

describe('<LoaderCompenent />', () => {
  it('should not render loader component', () => {
    const wrapper = shallow(<LoaderComponent isLoading={false} />);
    expect(wrapper.find('.loader')).to.have.length(0);
  });
});
