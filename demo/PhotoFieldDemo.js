import React from 'react';
import _ from 'underscore';
import {PhotoField} from '../src';

// TODO: move the line to tingle-env
React.initializeTouchEvents(true);

class Demo extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    render() {
        return (<PhotoField label="出生证明" photoUrl="./src/img/demo.png" icon="shouji"/>);
    }
};


React.render(<Demo/>, document.getElementById('TingleDemo'));