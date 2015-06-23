var Slide = require('../src');

// TODO: move the line to tingle-env
React.initializeTouchEvents(true);

class Demo extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            freeCount: 0,
            demoIndex: 0,
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
        console.log(this.refs.customSlide);
    }

    handleSlideMount(slide) {
    }

    handleSlideEnd(o) {
    }

    handleSlideCount(o) {
        // console.log(o.index);
        this.setState({
            freeCount: this.state.freeCount + 1
        });
    }

    handleUpdateIndicator(o) {
        //  强制更新
        this.setState({
            demoIndex: o.index
        });
    }

    render() {
        var t = this;
        return (<div>
            <h3 className="tP10">自定义内容，自定义高度，循环模式关闭</h3>
            <Slide ref="customSlide" height={80} auto={false} loop={false}
             onSlideEnd={t.handleSlideCount.bind(t)}
             onMount={t.handleSlideMount.bind(t)}>
                <div className="tFBV tFBAC tFBJC" style={{backgroundColor:"orange"}}>
                    <div className="tFS20 tFCf">数数玩：{t.state.freeCount}</div>
                </div>
                <div className="tFBV tFBAC tFBJC" style={{backgroundColor:"yellowgreen"}}>
                    <div className="tFS20 tFCf">数数玩：{t.state.freeCount}</div>
                </div>
            </Slide>

            <h3 className="tP10">一般情况，item数量大于2</h3>
            <Slide onSlideEnd={t.handleUpdateIndicator.bind(t)}>
                {t.state.slideList.map(function (item, index) {
                    return <div key={index} className="tImageSlideItem" style={{
                        backgroundImage: "url("+ item.img +")"
                    }}><span className="tFCf tOP0">{t.state.freeCount}</span></div>
                })}
            </Slide>
            <div className="tFBH tFBAC tFBJC" style={{
                position: "relative",
                height: 24,
                marginTop: -24
            }}>
                {t.state.slideList.map(function (item, index) {
                    return <div key={index} className="tR4 tM2" style={{
                        width: 8,
                        height: 8,
                        backgroundColor: index === t.state.demoIndex ? "#fff" : "rgba(0,0,0, .3)"
                    }}></div>
                })}
            </div>
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