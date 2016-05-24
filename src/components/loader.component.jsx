import React from 'react';

export default class LoaderComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        if(this.props.isLoading) {
            return (
                <div className="loader">Loading...</div>
            );
        }
        return false;
    }
}
