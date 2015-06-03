// TODO: move the two lines below to tingle-context
require("fastclick").attach(document.body);
React.initializeTouchEvents(true);


var Slide = require('../src');

// TODO: move the line to tingle-env
React.initializeTouchEvents(true);

class Demo extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        return (
            <div>
                <Slide/>
            </div>
        );
    }
};

React.render(<Demo/>, document.getElementById('TingleDemo'));