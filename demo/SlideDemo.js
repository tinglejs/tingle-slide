var Slide = require('../src');

// TODO: move the line to tingle-env
React.initializeTouchEvents(true);

class Demo extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            freeCount: 0,
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

    componentDidMount() {
        var t = this;
        var customSlide = t.refs.customSlide;
        setTimeout(function () {
            customSlide._goNext();
        }, 1000);
    }

    handleSlideMount(slide) {
    }
    
    handleSlideEnd(o) {
    }

    handleSlideCount(o) {
        this.setState({
            freeCount: this.state.freeCount + 1
        });
    } 

    render() {
        var t = this;
        return (<div>
            <h3 className="tP10">自定义内容，自定义高度</h3>
            <Slide ref="customSlide" height={400} autoSlide={true}
             onSlideEnd={t.handleSlideCount.bind(t)}
             onMount={t.handleSlideMount.bind(t)}>
                <div className="tFBV tFBAC tFBJC" style={{backgroundColor:"orange"}}>
                    <div><a className="tFCf" href="http://baidu.com">BAIDU</a></div>
                    <div className="tFS20 tLH2 tFCf">数数玩：{t.state.freeCount}</div>
                </div>
                <div className="tFBV tFBAC tFBJC" style={{backgroundColor:"yellowgreen"}}>
                    <div className="tR6 tW44 tH44 tLH44 tFAC tBC3 tFCf tFS20">T</div>
                    <div className="tFS20 tLH2 tFCf">数数玩：{t.state.freeCount}</div>
                </div>
            </Slide>

            <h3 className="tP10">一般情况，item数量大于2</h3>
            <Slide>
                {t.state.slideList.map(function (item, index) {
                    return <div key={index} className="tImageSlideItem" style={{
                        backgroundImage: "url("+ item.img +")"
                    }}></div>
                })}
            </Slide>

            <h3 className="tP10">特殊情况1，item数量等于2</h3>
            <Slide>
                {t.state.slideList.slice(0, 2).map(function (item, index) {
                    return <div key={index} className="tImageSlideItem" style={{
                        backgroundImage: "url("+ item.img +")"
                    }}></div>
                })}
            </Slide>

            <h3 className="tP10">特殊情况2，item数量等于1，不可切换</h3>
            <Slide>
                {t.state.slideList.slice(0, 1).map(function (item, index) {
                    return <div key={index} className="tImageSlideItem" style={{
                        backgroundImage: "url("+ item.img +")"
                    }}></div>
                })}
            </Slide>
        </div>)
    }

    // TODO
    // render() {
    //     let t = this;
    //     return (<div>
    //         <h3 className="tP10">一般情况，item数量大于2</h3>
    //         <ImageSlide list={this.state.slideList}
    //          onMount={t.handleSlideMount.bind(t)}
    //          onSlideEnd={t.handleSlideEnd.bind(t)}/>

    //         <h3 className="tP10">特殊情况1，item数量等于2</h3>
    //         <ImageSlide list={this.state.slideList.slice(0, 2)}
    //          onSlideEnd={t.handleSlideEnd.bind(t)}/>

    //         <h3 className="tP10">特殊情况2，item数量等于1，不可切换</h3>
    //         <ImageSlide list={this.state.slideList.slice(0, 1)}
    //          onSlideEnd={t.handleSlideEnd.bind(t)}/>
    //     </div>)
    // }
};

React.render(<Demo/>, document.getElementById('TingleDemo'));