var classnames = require('classnames');

var win = window;
var doc = document;

var supportTouch = 'ontouchstart' in window;
var support3D = ('WebKitCSSMatrix' in window && 'm11' in new WebKitCSSMatrix());

// 常量
var START = supportTouch ? 'touchstart' : 'mousedown';
var MOVE = supportTouch ? 'touchmove' : 'mousemove';
var END = supportTouch ? 'touchend' : 'mouseup';
var CANCEL = supportTouch ? 'touchcancel' : 'mouseup';
var PREV = 'prev';
var CURRENT = 'current';
var NEXT = 'next';
var OFFSET = 'offset';
var POS_MAP = {
    '-1': PREV,
    '0': CURRENT,
    '1': NEXT
};

// 创建translate字符串
// TODO: translate(0,0) translateZ(0);
var makeTranslate = (function () {
    var prefix = support3D ? 'translate3d(' : 'translate('
      , suffix = support3D ? ', 0)'         : ')'
      , join   = ',';

    function v (n) {
        n = '' + (n || 0);
        n = n.indexOf('%') > -1 ? n : n + 'px';
        return n;
    }

    return function (x, y) {
        return prefix + v(x) + join + v(y) + suffix;
    }
})();

// 获取兼容PC和Device的event对象的page属性
var getCursorPage = supportTouch ? function (event, page) {
    return event.changedTouches[0][page];
} : function (event, page) {
    return event[page];
};

class Slide extends React.Component {

    constructor(props) {
        super(props);
        var t = this;

        // 能够触发切换的最小偏移量
        this.effectiveDelta = 40;

        // 切换动画的时长
        // TOTO 根据手势滑动的速度来决定动画时长
        this.duration = 150;

        this.state = {
            // NOTE: 把list转成state的原因：
            // 当item数量为2时，内部将会复制一份，处理后的数量为4，以实现循环轮播
            // list: props.list,
            // 当前item的索引值 以0开始
            index: props.index,
            disabled: false
        }

        win.addEventListener('resize', function () {
            t._resize.call(t);
        });
    }

    componentWillMount() {
        var t = this;

        // 要保证list是一个数组
        // 当子元素只有一个时，props.children不是数组
        t.state.list = [].concat(t.props.children);

        var originLength = React.Children.count(t.state.list);

        // TODO: check
        if (originLength === 1) {
            t.state.disabled = true;
        }

        // item的长度经处理后不存在为2的情况
        else if (originLength === 2) {
            t._dummy = true;
            t.state.list = t.state.list.concat(t.state.list);
            t._dummyIndex = {
                '0' : 0,
                '1' : 1,
                '2' : 0,
                '3' : 1
            };
        }

        // 处理以后的长度，即item的个数
        t.length = t._dummy ? 4 : originLength;
    }

    componentDidMount() {
        var t = this;

        t.el = React.findDOMNode(t);

        // 确定容器宽度
        t.width = t.el.clientWidth;

        // 至少有2张slide时，才初始化事件
        if (t.length > 1) {
            t.el.addEventListener(START, t, false);
        }

        // 前一个，当前的，后一个item的element引用
        t._prev = null;
        t._current = null;
        t._next = null;

        t._deltaX = 0;
        t._minIndex = 0;
        t._maxIndex = t.length - 1;

        t._goto(t.state.index, true);

        t.props.onMount(t);
    }

    /**
     * @param {number} index 目标位置的索引值
     * @param {boolean} callFromDidMount 是否是在componentDidMount中被调用的
     */
    _goto(index, callFromDidMount) {
        var t = this;
        callFromDidMount = !!callFromDidMount;

        // NOTE: currentIndex和currentPosIndex不完全等值。
        // 当item为两项的时候，currentIndex的值包括0和1，但currentPosIndex的值包括0，1，2，3
        t.currentIndex = t._dummy ? t._dummyIndex[index] : index;

        if (t.length === 1 || callFromDidMount) {
            t.currentPosIndex = t.currentIndex;
            t._getItemReady(0);

            if (t.length > 2 || t._dummy) {
                t._getItemReady(1);
                t._getItemReady(-1);
            }
            t._slideEnd();
        } else if (!callFromDidMount) {

            // 通过_goNext/_goPrev调用的_goto，一直有方向(_dir)值 向左:-1 / 向右:1
            if (t._dir) {
                t._getItemUnready(t._dir === 1 ? t._next : t._prev);
                t._moveItem(t._current, t._dir);
                t._moveItem(t._dir === 1 ? t._prev : t._next, t._dir);
                t.currentPosIndex = index;

                t._getItemReady(t._dir * -1);
            }

            // 归位的情况：移动距离小于有效距离时
            else if (index === t.currentPosIndex) {
                // 归位当前item
                t._moveItem(t._current, 0);
                // 归位进入屏幕的另一个item
                // 说明:任意一个时间点,出现在屏幕内的item数量最多为2个,要么左边,要么右边,取决于移动方向
                if (t._moveBack) {
                    t._moveItem(t._moveBack, 0);
                }
                // 当resize时
                else {
                    t._moveItem(t._prev, 0);
                    t._moveItem(t._next, 0);
                }
            }

            setTimeout(function () {
                t._slideEnd();
            }, t.duration);
        } 

        t._moveBack = null;
        t._dir = null;
    }


    _goNext() {
        var t = this;
        // 方向是向左(-1)，要展现的是后一张(1)
        t._dir = -1;
        t._goto(t._getPosIndex(1));
    }

    _goPrev() {
        var t = this;
        // 方向是向右(1)，要展现的是前一张(-1)
        t._dir = 1;
        t._goto(t._getPosIndex(-1));
    }

    /**
     * 移动item到新的位置
     * @param {element} item
     * @param {number} dir 移动的方向 -1:向左移动 / 1:向右移动 / 0:移动到原位
     */
    _moveItem(item, dir) {
        var t = this;
        item.style.webkitTransitionDuration = t.duration + 'ms';

        var newOffset = +item.getAttribute(OFFSET) + dir;

        t._setItemX(item, t._getPosX(newOffset));

        // 如果进行了切换行为，即dir为-1或1
        if (dir) {
            item.setAttribute(OFFSET, newOffset);
            t['_' + POS_MAP[newOffset]] = item;
        }
    }

    /**
     * 根据指定的偏移量，找到对应的item，将其切换到可移动状态
     * @param {number} offset -1:前一个位置 / 0:当前位置 / 1: 后一个位置
     * @note 任何时刻，可移动状态的item数量只有三个
     */
    _getItemReady(offset) {
        var t = this;
        var targetPosIndex = t._getPosIndex(offset);
        var item = React.findDOMNode(t.refs['item'+ targetPosIndex]);
        item.classList.add('ready');
        item.setAttribute(OFFSET, offset);
        item.style.webkitTransform = makeTranslate(t._getPosX(offset));
        t['_' + POS_MAP[offset]] = item;
        // var img = item.children[0];
        // if (img && img.tagName === 'IMG' && !img.getAttribute('src')) {
        //     img.src = item.data('img');
        // } else {
            // item.style.backgroundImage = 'url(' + item.data('img')+ ')';
        // }
    }

    /**
     * 将指定的item切换到不可移动状态，即不参与切换行为。
     * @param {element} item 要改变状态的item
     * @note 这个函数虽然含义上和_setItemReady对应，但参数直接只用item，
     *  是处于性能考虑，因为调用该函数的时候，都是明确知道目标item的。
     */
    _getItemUnready(item) {
        var t = this;
        item.classList.remove('ready');
        item.removeAttribute(OFFSET);
        item.style.webkitTransitionDuration = '0';
        item.style.webkitTransform = 'none';
    }

    /**
     * 获取指定的offset所对应的X坐标值(0点在当前item的左边缘)
     * @param {number} offset -1:前一个位置 / 0:当前位置 / 1: 后一个位置
     */
    _getPosX(offset) {
        var t = this;
        return offset === -1 ? -t.width : offset === 1 ? t.width : 0;
    }

    /**
     *
     */
    _setItemX(item, x) {
        this['_' + POS_MAP[item.getAttribute(OFFSET)] + 'X'] = x;
        item.style.webkitTransform = makeTranslate(x);
    }

    /**
     * 获取前一个或后一个位置的索引值，相对值是currentPosIndex
     * @param {number} offset -1:取前一个位置 / 0:取当前位置 / 1: 取后一个位置
     */
    _getPosIndex(offset) {
        var t = this, index;
        if (offset === -1) {
            index = t.currentPosIndex === t._minIndex ? t._maxIndex : t.currentPosIndex - 1;
        } else if (offset === 1) {
            index = t.currentPosIndex === t._maxIndex ? t._minIndex : t.currentPosIndex + 1;
        } else if (offset === 0) {
            index = t.currentPosIndex;
        } else {
            throw new Error('error offset')
        }
        return index;
    }

    handleEvent(e) {
        var t = this;
        switch (e.type) {
            case START:
                t._touchStart(e);
                break;
            case MOVE:
                t._touchMove(e);
                break;
            case END:
                t._touchEnd(e);
                break;
            case CANCEL:
                t._touchEnd(e);
                break;
        }
    }

    _touchStart(e) {
        // 只响应单指操作
        if (supportTouch && e.touches.length > 1) {
            return;
        }
        var t = this;

        // 恢复到0 拖拽过程中快速响应移动距离
        t._prev.style.webkitTransitionDuration = '0ms';
        t._current.style.webkitTransitionDuration = '0ms';
        t._next.style.webkitTransitionDuration = '0ms';

        // 移动初始值
        t._prevX = t._getPosX(-1);
        t._currentX = t._getPosX(0);
        t._nextX = t._getPosX(1);

        // 浏览器默认滚动
        t.browserScrolling = false;

        // 是否是切换状态 此时忽略浏览器默认的滚动行为
        t.sliding = false;

        t.startPageX = getCursorPage(e, 'pageX');
        t.startPageY = getCursorPage(e, 'pageY');
        t.basePageX = t.startPageX;
        t.startTime = e.timeStamp;

        doc.addEventListener(MOVE, t, false);
        doc.addEventListener(END, t, false);
    }

    _touchMove(e) {
        // 只响应单指操作
        if (supportTouch && e.touches.length > 1) {
            return;
        }

        var t = this;

        // 如果浏览器默认滚动行为已被触发，则不执行Slider的滚动
        if (t.browserScrolling) {
            return;
        }

        var pageX = getCursorPage(e, 'pageX'),
            pageY = getCursorPage(e, 'pageY'),
            distX,
            newPrevX,
            newCurrentX,
            newNextX,
            deltaY;

        t.deltaX = pageX - t.startPageX;

        // 如果slide开始滚动
        if (t.sliding) {
            e.preventDefault();
            e.stopPropagation();

            // 任意时刻的位移值
            distX = pageX - t.basePageX;

            // 位移后的X坐标
            newPrevX = t._prevX + distX;
            newCurrentX = t._currentX + distX;
            newNextX = t._nextX + distX;

            // 更新DOM位置
            t._setItemX(t._prev, newPrevX);
            t._setItemX(t._current, newCurrentX);
            t._setItemX(t._next, newNextX);

            if (t.deltaX >= 0) {
                t._moveBack = t._prev;
            } else {
                t._moveBack = t._next;
            }
        } else {
            deltaY = pageY - t.startPageY;

            // 如果X轴的移动距离先达到5px，则执行Slider的滚动
            // 如果Y轴的移动距离先达到5px，则执行浏览器默认的页面滚动
            if (Math.abs(t.deltaX) > 5) {
                e.preventDefault();
                e.stopPropagation();
                t.sliding = true;
            } else if (Math.abs(deltaY)> 5) {
                t.browserScrolling = true;
            }
        }

        t.basePageX = pageX;
    }

    _touchEnd(e) {
        // 只响应单指操作
        if (supportTouch && e.touches.length > 1) {
            return;
        }

        var t = this;

        // 如果浏览器默认滚动行为已被触发，则不执行Slider的滚动
        if (t.browserScrolling) {
            return;
        }

        t.browserScrolling = false;

        if (t.deltaX > t.effectiveDelta) {
            t._goPrev();
        } else if (t.deltaX < -t.effectiveDelta) {
            t._goNext();
        } else {
            t._goto(t.currentPosIndex);
        }

        t.deltaX = 0;

        doc.removeEventListener(MOVE, t, false);
        doc.removeEventListener(END, t, false);
    }

    _slideEnd() {
        var t = this;
        var realIndex = t._getRealIndex(t.currentPosIndex);
        t.props.onSlideEnd({
            index: realIndex,
            item: t._current,
            data: t.state.list[realIndex]
        });
    }

    _getRealIndex(dummyIndex) {
        var t = this;
        return t._dummy ? t._dummyIndex[dummyIndex] : dummyIndex;
    }

    /**
     * 当屏幕旋转时，更新基本数据 && 再次定位
     */
    _resize() {
        var t = this;
        t.width = t.el.clientWidth;
        t._goto(t.currentPosIndex);
    }

    render() {
        // TODO 
        // * if list.length === 0 ...
        var t = this;
        return (
            <div className={classnames({
                "tSlide": true,
                "tSlideOff": t.state.disabled,
                [t.props.className]: !!t.props.className
            })}>
                <div className="t3D tSlideView" style={{height: t.props.height}}>
                    {t.state.list.map(function (Child, index) {
                        return <div ref={"item" + index} key={index}
                         className={"tSlideItem tSlideItem" + t._getRealIndex(index)}>
                            {Child}
                        </div>;
                    })}
                </div>
            </div>
        );
    }
}

Slide.propTypes = {
    // list: React.PropTypes.array.isRequired,
    height: React.PropTypes.number,
    index: React.PropTypes.number
};

Slide.defaultProps = {
    height: 180,
    index: 0,
    onMount: function () {},
    onSlideEnd: function () {}
};

module.exports = Slide;