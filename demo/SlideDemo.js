var Slide = require('../src');

// TODO: move the line to tingle-env
React.initializeTouchEvents(true);

class Demo extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            slideList: [{
                img: './demo/img/0.jpg',
                url: '',
                title: 'item0'
            },{
                img: './demo/img/1.jpg',
                url: '',
                title: 'item1'
            },{
                img: './demo/img/2.jpg',
                url: '',
                title: 'item2'
            },{
                img: './demo/img/3.jpg',
                url: '',
                title: 'item3'
            }]
        };
    }

    handleSlideMount(slide) {
        console.log(slide);
    }
    
    handleSlideEnd(o) {
        console.log(o);
    }

    render() {
        let t = this;
        return (<div>
            <h3 className="tP10">一般情况，item数量大于2</h3>
            <Slide list={this.state.slideList}
             onMount={t.handleSlideMount.bind(t)}
             onSlideEnd={t.handleSlideEnd.bind(t)}/>

            <h3 className="tP10">特殊情况1，item数量等于2</h3>
            <Slide list={this.state.slideList.slice(0, 2)}
             onSlideEnd={t.handleSlideEnd.bind(t)}/>

            <h3 className="tP10">特殊情况2，item数量等于1，不可切换</h3>
            <Slide list={this.state.slideList.slice(0, 1)}
             onSlideEnd={t.handleSlideEnd.bind(t)}/>
        </div>)
    }
};

React.render(<Demo/>, document.getElementById('TingleDemo'));