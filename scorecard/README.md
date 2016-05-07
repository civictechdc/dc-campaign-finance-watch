# DC Candidate Fundraising Integrity Scorecard
## Draft Parameters - Version 0.1

This is the outline for a system to evaluate the fundraising integrity of candidates for local office in the District of Columbia. Each campaign has an associated score from 0-100, where 100 is best.

**The score combines indicators encompassing four categories:**
  <!-- - Location (35 points)
  - Amount (30 points)
  - Contributor Type (25 points)
  - Reporting (10 points) -->
  - Location (40 points)
  - Amount (30 points)
  - Contributor Type (30 points)


The specific indicators included in each categories can be found below.
<!-- we should include a link to that section here -->

## Races Included:
  - Mayor
  - Council (Chair, 4 At-Large, 8 Ward)
  - Attorney General
  - Shadow Delegation (U.S. Representative, 2 U.S. Senators)
  - School Board (mostly by ward)

Any exploratory committee activities are considered candidate campaign contributions for purposes of this analysis.

**Races Not Included**

The seat of U.S. Delegate, currently held by Del. Eleanor Holmes Norton, is not included in the campaign finance database, as contributions are reported to the Federal Election Commission.

The contributions to candidates in these races are included in OCF data and available through the DC Campaign Finance Tracker site, but are not included in the scorecard.


# Race Parameters
*Technical Note: the indicator scores are calculated dynamically with linear equations, and the values listed below are the endpoints or breakpoints in the equations used to derive those scores*

## Location (40 total points)
###Are candidates raising money from their constituents?

**1. % of Money Raised from DC Addresses**
*(25 points)*

| Indicator Value | Score |
| :---: | :---: |
| 50% | 0 points |
| 100% | 25 points |

**2. % of Money from Ward**
***Ward candidates only***
*(15 points)*

| Indicator Value | Score |
| :---: | :---: |
| 20% | 0 points |
| 50% | 6 points |
| 70% | 12 points |
| 100% | 15 points |

**3. Geographic Concentration Score by Ward**
***Citywide candidates only***
*(15 points)*

| Indicator Value | Score |
| :---: | :---: |
| 0.15 | 15 points |
| 0.2 | 12 points |
| 0.25 | 6 points |
| 0.3 | 3 points |
| 0.4 | 0 points |

Explanation: the Geographic Concentration Score is a formula that takes the share of DC-based contributions from each ward, squares it, and sums up the results:

```
  ward score = (ward i contribs / DC contribs)^2
  concentration score = sum of ward scores
```

## Amount (30 total points)
### Are candidates raising money from small donors or large donors?

**1. Average Contribution Size**
*(10 points)*

  ***$500 limit***

| Indicator Value | Score |
| :---: | :---: |
| $50 | 10 points |
| $100 | 6 points |
| $250 | 0 points |

  ***$1K limit***

| Indicator Value | Score |
| :---: | :---: |
| $50 | 10 points |
| $100 | 7 points |
| $300 | 2 points |
| $400 | 0 points |

  ***$1.5K limit***

| Indicator Value | Score |
| :---: | :---: |
| $50 | 10 points |
| $100 | 8 points |
| $200 | 5 points |
| $500 | 0 points |

  ***$2K limit***

| Indicator Value | Score |
| :---: | :---: |
| $50 | 10 points |
| $100 | 8 points |
| $400 | 2 points |
| $600 | 0 points |


**2. % of Contributions at Maximum Amount**
*(10 points)*

| Indicator Value | Score |
| :---: | :---: |
| 5% | 10 points |
| 15% | 8 points |
| 25% | 5 points |
| 50% | 0 points |


**3. % of Contributions <$100**
*(10 points)*

| Indicator Value | Score |
| :---: | :---: |
| 15% | 0 points |
| 30% | 3 points |
| 70% | 7 points |
| 85% | 10 points |


## Contributor Type (30 total points)
### Is the money coming from people or from special interests?

**1. Any Corporate Contributions?**
*(3 points)*

| Indicator Value | Score |
| :---: | :---: |
| 0 | 3 points |
| 1 | 0 points |

**2. Any PAC/Party Contributions?**
*(2 points)*

| Indicator Value | Score |
| :---: | :---: |
| 0 | 2 points |
| 1 | 0 points |

**3. % of Money Contributed by Candidate**
*(3 points)
Note: does not count loans.*

| Indicator Value | Score |
| :---: | :---: |
| 0 | 3 points |
| 20% | 0 points |

**4. % of Individuals Contribs from DC with Business Addresses**
*(2 points)
Note: per master address repository*

| Indicator Value | Score |
| :---: | :---: |
| 5% | 2 points |
| 25% | 0 points |

**5. % of Money from All Sources but Individuals with Residential Addresses**
*(20 points)
Note: does not include candidate self-funding. Includes corporate, PAC, unlisted/other, or individuals with business addresses*

| Indicator Value | Score |
| :---: | :---: |
| 0 | 20 points |
| 50% | 0 points |



# Not Included
## Reporting (10 total points)
### Is the candidate meeting legal reporting requirements?

**1. Any Records Not Meeting Minimum Requirements?**
*(3 points)*

| Indicator Value | Score |
| :---: | :---: |
| 0 | 3 points |
| 1 | 0 points |

**2. % of Contributions With No Discernable Name and/or Address**
*(7 points)*

| Indicator Value | Score |
| :---: | :---: |
| 0 | 7 points |
| 5% | 0 points |

**BONUS/ICEBOX: % of Contributions With Incorrect/Inconsistent Information**
*Note: this indicator is too difficult to evaluate reliably at this time, but it would be helpful to explore options for future versions.
