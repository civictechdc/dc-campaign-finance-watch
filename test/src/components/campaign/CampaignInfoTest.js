import React from 'react';
import { fetch } from 'whatwg-fetch';
import { shallow } from 'enzyme';
import { Col } from 'react-bootstrap';
import CampaignInfo from '../../../../src/components/campaign/campaignInfo';

const mockInfo = {
  percentFromWard: 30,
  total: 300,
  averageContribution: 300,
  amountContributedByCandidate: 400,
  localContributionPercentage: 30,
  smallContributionPercentage: 30,
  maximumContributionPercentage: 30,
  individualsAtCorporateAddress: 30,
  wardConcentrationScore: 30,

  scores: {
    total: 400.30,
    dcContribScore: 40,
    wardScore: 30,
    avgSizeScore: 30,
    contribsMaxScore: 30,
    smallContribScore: 30,
    anyCorpScore: 30,
    anyPacScore: 30,
    selfFundScore: 30,
    businessAddressScore: 30,
    nonIndividualsCompositeScore: 30
  }
}

describe('<CampaignScorecard />', () => {
  it('should render 2 Cols', () => {
    const wrapper = shallow(<CampaignInfo info={mockInfo}/>);
    expect(wrapper.find(Col)).to.have.length(2);
  });

});
