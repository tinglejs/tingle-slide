/**
 * Slide Component Demo for tingle
 * @author gnosaij
 *
 * Copyright 2014-2015, Tingle Team, Alinw.
 * All rights reserved.
 */

var classnames = require('classnames');

var Slide = require('../src');

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
            }],
            ajaxList: []
        };
    }

    componentDidMount() {
        console.log(this.refs.customSlide);
        var t = this;
        t.setState({
            ajaxList: [{
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
        })
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
            <h3 className="tP10">自定义内容，自定义高度，循环模式关闭</h3>
            <Slide ref="customSlide" height={80} auto={false} loop={false}
             onSlideEnd={t.handleSlideCount.bind(t)} showNav={true}>
                <div className="tFBV tFBAC tFBJC" style={{backgroundColor:"orange"}}>
                    <div className="tFS20 tFCf">数数玩：{t.state.freeCount}</div>
                </div>
                <div className="tFBV tFBAC tFBJC" style={{backgroundColor:"yellowgreen"}}>
                    <div className="tFS20 tFCf">数数玩：{t.state.freeCount}</div>
                </div>
            </Slide>

            <h3 className="tP10">一般情况，item数量大于2</h3>
            <Slide showNav={true}>
                {t.state.slideList.map(function (item, index) {
                    return <div key={index} className="tImageSlideItem" style={{
                        backgroundImage: "url("+ item.img +")"
                    }}><span className="tFCf tOP0">{t.state.freeCount}</span></div>
                })}
            </Slide>
            
            <h3 className="tP10">特殊情况1，item数量等于2</h3>
            <Slide showNav={true}>
                {t.state.slideList.slice(0, 2).map(function (item, index) {
                    return <div key={index} className="tImageSlideItem" style={{
                        backgroundImage: "url("+ item.img +")"
                    }}></div>
                })}
            </Slide>

            <h3 className="tP10">特殊情况2，item数量等于1，不可切换</h3>
            <Slide showNav={true}>
                {t.state.slideList.slice(0, 1).map(function (item, index) {
                    return <div key={index} className="tImageSlideItem" style={{
                        backgroundImage: "url("+ item.img +")"
                    }}></div>
                })}
            </Slide>
            <h3 className="tP10">先渲染占位，后填充数据</h3>
            <Slide showNav={true}>
                {t.state.ajaxList.map(function(item, index) {
                    return <div key={index} className="tImageSlideItem" style={{
                        backgroundImage: "url(" + item.img + ")"
                    }}></div>
                })}
            </Slide>
        </div>)

    }
};

module.exports = Demo;