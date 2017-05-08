import React from 'react';
import { fetch } from 'whatwg-fetch';
import { shallow } from 'enzyme';
import { Tab, Tabs } from 'react-bootstrap';
import CampaignDetailComponent from '../../../../src/components/campaign/campaignDetailComponent';


// mock when react router 4 is in
// describe('<CampaignDetailComponent />', () => {
//   it('should initially be loading', () => {
//     const wrapper = shallow(<CampaignDetailComponent />);
//     // expect(wrapper.find('<h3>')).to.have.length(1);
//     expect(wrapper.contains(<h3>Loading...</h3>)).to.equal(true);
//
//   });
//
// });
