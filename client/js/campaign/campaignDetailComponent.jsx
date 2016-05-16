import React from 'react';
import Client from '../api';

class CampaignDetailComponent extends React.Component {
    constructor(props){
        super(props);
        this.state = { contributions: [] };
    }

    componentWillMount(props) {
        const { id } = this.props.params;
        let that = this;
        Client.getCampaignData(id)
            .then(function(contributions){
                that.setState({contributions: contributions});
            });
    }

    render() {
        const { contributions } = this.state;
        return (
            <div>Contributors {contributions.length}</div>
        );
    }
}

export default CampaignDetailComponent;
