import React, { Component } from 'react';
import { Tabs, Tab } from 'react-bootstrap';

class CampaignTabs extends Component {
  constructor(props) {
    super(props);
    this.state = { activeTab: 'visualizer' };

    this.setActiveTab = this.setActiveTab.bind(this);
    this.goFullScreen = this.goFullScreen.bind(this);
  }

  _renderButton(fullScreenTab) {
    if (fullScreenTab === 'visualizer') {
      return (
        <button
          className="btn btn-info btn-xs"
          onClick={() => this.goFullScreen('')}
          style={{
            position: 'fixed',
            top: '2px',
            right: '10px',
            zIndex: 999999
          }}
        >
          <i className="fa fa-compress" />
        </button>
      )
    }
  }

  setActiveTab(tab) {
    this.setState({ activeTab: tab });
  }

  goFullScreen(tab) {
    this.setState({ fullScreenTab: tab });
  }

  render() {
    const fullScreenStyle = {
      top: 0,
      bottom: 0,
      position: 'fixed',
      left: 0,
      height: '100%',
      width: '100%',
      overflow: 'hidden',
      zIndex: 99999
    };

    const { activeTab,  fullScreenTab } = this.state;
    const { id } = this.props
    // change when react router 4 comes in
    const vizTitle = (
      <span>
        Visualiations
        {' '}
        <button
          style={{ padding: '0', paddingLeft: '2px', paddingRight: '2px' }}
          onClick={() => this.goFullScreen('visualizer')}
          disabled={activeTab !== 'visualizer'}
          className="btn btn-info btn-xs"
        >
          <i className="fa fa-expand" />
        </button>
      </span>
    );
    const tableTitle = <span>Contribution Table</span>;

     return (
       <Tabs>
         <Tab
           id="keshif"
           eventKey={1}
           title={vizTitle}
           onEntered={() => this.setActiveTab('visualizer')}
         >
           <div className="campaign-visualizer">
             <iframe
               style={fullScreenTab === 'visualizer' ? fullScreenStyle : {}}
               src={
                 'https://codefordc.org/campaign-finance-explorer/index.html?' +
                   id
               }
             />
             {this._renderButton(fullScreenTab)}
           </div>
         </Tab>
         <Tab
           id="table"
           eventKey={2}
           title={tableTitle}
           onEntered={() => this.setActiveTab('table')}
         >
           {this.props.children}
         </Tab>
       </Tabs>
     );
  }

}

export default CampaignTabs;
