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
        var t = this;
        return (<div>
            <h3 className="tP10">自定义内容</h3>
            <Slide>
                <div className="tFBH tFBAC tFBJC">
                    <a href="http://baidu.com">baidu</a>
                </div>
                <div className="tFBH tFBAC tFBJC">
                    <div className="tR6 tW44 tH44 tLH44 tFAC tBC3 tFCf tFS20">T</div>
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