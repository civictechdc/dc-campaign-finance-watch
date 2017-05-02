import React from 'react';
import _ from 'lodash';
import {Col} from 'react-bootstrap'
import { Link } from 'react-router';

const CampaignInfo = props => {
  const { info } = props;
  const ward = info.percentFromWard
    ? <div>
        Percentage Raised from Ward: {_.round(info.percentFromWard, 3) * 100}%
      </div>
    : false;
  return (
    <div>
      <Col sm={12}>
        <h4>Campaign Statistics</h4>
        <div>Total Raised: ${_.round(info.total, 0)}</div>
        <div>Average Contribution: ${_.round(info.averageContribution, 0)}</div>
        <div>
          Amount Contributed by Candidate:
          {' '}
          {_.round(info.amountContributedByCandidate * 100, 0)}
          %
        </div>
        <div>
          Percentage Raised in D.C.:
          {' '}
          {_.round(info.localContributionPercentage * 100, 0)}
          %
        </div>
        <div>
          Contributions less than $100:
          {' '}
          {_.round(info.smallContributionPercentage * 100, 0)}
          %
        </div>
        <div>
          Percentage of Contributions for the Maximum Allowed:
          {' '}
          {_.round(info.maximumContributionPercentage * 100, 0)}
          %
        </div>
        <div>
          Individuals Contributing from a Corporate Address:
          {' '}
          {_.round(info.individualsAtCorporateAddress * 100, 0)}
          %
        </div>
        {ward}
        <div>
          Ward Concentration Score: {_.round(info.wardConcentrationScore, 5)}
        </div>
      </Col>
      <Col sm={12}>
        <h4>Campaign Scores</h4>
        <h4>
          Combined Score: {_.round(info.scores.total, 2)} (out of 100 points)
        </h4>
        <h5>
          Scores range from 0-100. See
          {' '}
          <Link to="faq#scorecard">here</Link>
          {' '}
          for explanation.
        </h5>

        <h5>Location (40 points)</h5>
        <div>
          % of Money from DC Addresses:
          {' '}
          {_.round(info.scores.dcContribScore, 2)}
          {' '}
          (out of 25 points)
        </div>
        <div>
          Ward Concentration Score:
          {' '}
          {_.round(info.scores.wardScore, 2)}
          {' '}
          (out of 15 points)
        </div>

        <h5>Amount (30 points)</h5>
        <div>
          Average Contribution:
          {' '}
          {_.round(info.scores.avgSizeScore, 2)}
          {' '}
          (out of 10 points)
        </div>
        <div>
          Max Contributions:
          {' '}
          {_.round(info.scores.contribsMaxScore, 2)}
          {' '}
          (out of 10 points)
        </div>
        <div>
          Small Contributions:
          {' '}
          {_.round(info.scores.smallContribScore, 2)}
          {' '}
          (out of 10 points)
        </div>

        <h5>Contributor Type (30 points)</h5>
        <div>
          Any Corporate Contributions:
          {' '}
          {_.round(info.scores.anyCorpScore, 2)}
          {' '}
          (out of 3 points)
        </div>
        <div>
          Any PAC/Party Contributions:
          {' '}
          {_.round(info.scores.anyPacScore, 2)}
          {' '}
          (out of 2 points)
        </div>
        <div>
          Self-Funding:
          {' '}
          {_.round(info.scores.selfFundScore, 2)}
          {' '}
          (out of 3 points)
        </div>
        <div>
          Contribs from Individuals at Business Addresses:
          {' '}
          {_.round(info.scores.businessAddressScore, 2)}
          {' '}
          (out of 2 points)
        </div>
        <div>
          Money from non-Individual Sources:
          {' '}
          {_.round(info.scores.nonIndividualsCompositeScore, 2)}
          {' '}
          (out of 20 points)
        </div>
      </Col>
    </div>
  );
};

export default CampaignInfo;
