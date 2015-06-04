var $      = require('anima-yocto');
var Widget = require('anima-widget');
             require('./slider.css');
var win    = window;
var doc    = document;

var supportTouch = 'ontouchstart' in window;
var support3D    = ('WebKitCSSMatrix' in window && 'm11' in new WebKitCSSMatrix());

// 常量
var START  = supportTouch ? 'touchstart' : 'mousedown';
var MOVE   = supportTouch ? 'touchmove'  : 'mousemove';
var END    = supportTouch ? 'touchend'   : 'mouseup';
var CANCEL = supportTouch ? 'touchcancel': 'mouseup';
var NEXT         = 'next';
var CURRENT      = 'current';
var PREV         = 'prev';
var POS          = 'pos';

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

var Slider = Widget.extend({
    attrs : {
        element: '',
        index: 0,
        duration: 200,
        effectiveDelta : 40,
        imgSize: 'cover'
    },
    setup : function () {
        var t = this;


        // 定位页面中的初始化容器
        var el = t.get('element');
        t.element = typeof el === 'string' ? $(el) : el;
        if (!t.element) {
            console.log('slider element was not found');
            return;
        }
        t.element.addClass('kumi-slider-img-' + t.get('imgSize'));

        t._viewEl = t.element.find('.kumi-slider-view');
        t.width = t.element[0].clientWidth;

        // if there's no items, stop
        if (!t._setItems()) return;

        // t._length => item's length
        // t.length  => true length
        if (t._length > 1) {
            t._viewEl[0].addEventListener(START, t, false);          
        }

        t._pos = [PREV, CURRENT, NEXT];

        // 上一个，当前的，下一个item的索引
        t._prev    = null;
        t._current = null;
        t._next    = null;

        t.deltaX   = 0;
        t.minIndex = 0;
        t.maxIndex = t._length - 1;

        t.goto(t.get('index'), true);

        t.trigger('init');

        // onceInit();
    },
    destroy: function (remove) {
        var t = this;
        t._viewEl.removeEventListener(START, t, false);
        !!remove && t.element.remove;
    },
    handleEvent: function(e) {
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
    },
    // item的长度经处理后不存在为2的情况
    _setItems: function () {
        var t = this;
        t._itemEls = t.element.find('.kumi-slider-item');

        t._length = t._itemEls.length;

        t.length = '_trueIndex' in t ? 2 : t._length;

        if (t._length < 2) {
            t.element.addClass('kumi-slider-off');
        } 
        // 两个item的时候要特殊处理一下：复制一份，保证_prev/_current/_next都有值
        else if (t._length === 2) {
            t._viewEl.appendChild(t._itemEls[0].cloneNode(true));
            t._viewEl.appendChild(t._itemEls[1].cloneNode(true));
            t._trueIndex = {
                '0' : 0,
                '1' : 1,
                '2' : 0,
                '3' : 1
            };
            return t._setItems();
        }
        return t._length;
    },
    // 当屏幕旋转时，更新基本数据 && 再次定位
    resize: function() {
        var t = this;
        t.width = t.element[0].clientWidth;
        t.goto(t.currentPos);
    },
    _getPos : function (dir) {
        var t = this, ret;
        if (dir < 0) {
            ret = t.currentPos === t.maxIndex ? t.minIndex : t.currentPos + 1;
        } else if (dir > 0) {
            ret = t.currentPos === t.minIndex ? t.maxIndex : t.currentPos - 1;
        } else {
            ret = t.currentPos;
        }
        return ret;
    },
    "goto": function(index, callByInit) {
        var t = this;
        callByInit = !!callByInit;
        // 两个item的情况要纠正
        // NOTE: currentIndex和currentPos不完全等值。
        // 当item为两项的时候，currentIndex的值包括0和1，但currentPos的值包括0，1，2，3
        t.currentIndex = ('_trueIndex' in t) ? t._trueIndex[index] : index;

        if (t._length === 1 || callByInit) {
            t.currentPos = index;
            t._getItemReady(t._itemEls.eq(index), CURRENT);
            if (t._length > 2 || ('_trueIndex' in t)) {
                t._getItemReady(t._itemEls.eq(t._getPos(-1)), NEXT);
                t._getItemReady(t._itemEls.eq(t._getPos(1)), PREV);
            }
            t._slideEnd();
        } else if (!callByInit) {

            // 通用goNext/goPrev调用的goto，一直有_deltaDir值 -1 or 1
            if (t._deltaDir) {
                t._getItemUnready(t._deltaDir === -1 ? t._prev : t._next);
                t._moveItem(t._itemEls.eq(t.currentPos), t._deltaDir);
                t._moveItem(t._itemEls.eq(index), t._deltaDir);
                t.currentPos = index;
                t._getItemReady(t._itemEls.eq(t._getPos(t._deltaDir)), t._deltaDir === -1 ? NEXT : PREV);
            } else if (index === t.currentPos) {
                t._moveItem(t._itemEls.eq(index), 0);
                // 在移动距离较短时
                if (t._moveBack) {
                    t._moveItem(t._moveBack, 0);
                }
                // 当resize时
                else {
                    t._moveItem(t._prev, 0);
                    t._moveItem(t._next, 0);
                }
            } else if (index === t._getPos(-1)) {
                t.goNext();
                return;
            } else if (index === t._getPos(1)) {
                t.goPrev();
                return;
            } else if (index > t.currentPos && index <= t.maxIndex) {
                t._getItemUnready(t._prev);
                t._getItemUnready(t._next);
                t._getItemReady(t._itemEls.eq(index), NEXT);
                setTimeout(function () {
                    t._moveItem(t._current, -1);
                    t._moveItem(t._next, -1);
                    setTimeout(function () {
                        t._getItemUnready(t._prev);
                        t._getItemReady(t._itemEls[t._getPos(1)], PREV);
                        t._getItemReady(t._itemEls[t._getPos(-1)], NEXT);
                    }, t.get('duration'));
                }, 0);

                t.currentPos = index;
            } else if (index < t.currentPos && index >= t.minIndex) {
                t._getItemUnready(t._next);
                t._getItemUnready(t._prev);
                t._getItemReady(t._itemEls[index], PREV);
                setTimeout(function () {
                    t._moveItem(t._current, 1);
                    t._moveItem(t._prev, 1);
                    setTimeout(function () {
                        t._getItemUnready(t._next);
                        t._getItemReady(t._itemEls[t._getPos(-1)], NEXT);
                        t._getItemReady(t._itemEls[t._getPos(1)], PREV);
                    }, t.get('duration'));
                }, 0);
                t.currentPos = index;
            } else {
                console.log('invalid "index" for goto(index)');
                return; 
            }

            setTimeout(function () {
                t._slideEnd();
            }, t.get('duration'));
        } 

        t._moveBack = null;
        t._deltaDir = null;
    },
    goNext : function () {
        var t = this;
        t._deltaDir = -1;
        t.goto(t._getPos(t._deltaDir));
    },
    goPrev : function () {
        var t = this;
        t._deltaDir = 1;
        t.goto(t._getPos(t._deltaDir));
    },
    // deltaDir = -1 向前移动一位
    // deltaDir = 1  向后移动一位
    // deltaDir = 0  移动到原位
    // TODO: add callback
    // TODO: use animate
    _moveItem : function (item, deltaDir) {
        var t = this;
        var newPos;
        if (deltaDir) {
            var oldPos = item.data(POS);
            newPos = t._pos[t._pos.indexOf(oldPos) + deltaDir];
        } else {
            // 没有变化
            newPos = item.data(POS);
        }

        item[0].style.webkitTransitionDuration = t.get('duration') + 'ms';
        t._setItemX(item, t._getPosX(newPos));

        if (deltaDir) {
            item.data(POS, newPos);
            t['_'+newPos] = item;
        }
    },
    _getItemReady : function (item, pos) {
        var t = this;
        item.addClass('ready');
        item.data(POS, pos);
        item[0].style.webkitTransform = makeTranslate(t._getPosX(pos));
        t['_' + pos] = item;
        var img = item[0].children[0];
        if (img && img.tagName === 'IMG' && !img.getAttribute('src')) {
            img.src = item.data('img');
        } else {
            item[0].style.backgroundImage = 'url(' + item.data('img')+ ')';
        }
    },
    _getItemUnready : function (item) {
        var t = this;
        item.removeClass('ready');
        item.data(POS, '');
        item[0].style.webkitTransitionDuration = '0';
        item[0].style.webkitTransform = 'none';
    },
    _getPosX : function (pos) {
        var t = this;
        return pos === PREV ? -t.width : pos === NEXT ? t.width : 0;
    },
    _setItemX: function(item, x) {
        var t = this;
        t['_'+item.data(POS)+'X'] = x;
        item[0].style.webkitTransform = makeTranslate(x);
    },
    _touchStart : function (e) {
        if (supportTouch && e.touches.length > 1) {
            return;
        }
        var t = this;
        // 恢复到0 拖拽过程中快速响应移动距离
        t._prev[0].style.webkitTransitionDuration    =
        t._current[0].style.webkitTransitionDuration =
        t._next[0].style.webkitTransitionDuration    = '0';
        t._prevX           = t._getPosX(PREV);
        t._currentX        = t._getPosX(CURRENT);
        t._nextX           = t._getPosX(NEXT);
        t.browserScrolling = false; // 浏览器默认滚动
        t.slideReady       = false;
        t.startPageX       = getCursorPage(e, 'pageX');
        t.startPageY       = getCursorPage(e, 'pageY');
        t.basePageX        = t.startPageX;
        t.startTime        = e.timeStamp;

        doc.addEventListener(MOVE, t, false);
        doc.addEventListener(END, t, false);
    },
    _touchMove: function(e) {
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

        // 如果belt开始滚动
        if (t.slideReady) {
            e.preventDefault();
            e.stopPropagation();

            distX       = pageX - t.basePageX;
            newPrevX    = t._prevX + distX;
            newCurrentX = t._currentX + distX;
            newNextX    = t._nextX + distX;

            t._setItemX(t._current, newCurrentX);
            t._setItemX(t._prev, newPrevX);
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
                t.slideReady = true;
            } else if (Math.abs(deltaY)> 5) {
                t.browserScrolling = true;
            }
        }

        t.basePageX = pageX;
    },
    _touchEnd: function(e) {
        if (supportTouch && e.touches.length > 1) {
            return;
        }
        var t = this;
        // 如果浏览器默认滚动行为已被触发，则不执行Slider的滚动
        if (t.browserScrolling) {
            return;
        }

        t.browserScrolling = false;

        if (t.deltaX > t.get('effectiveDelta')) {
            t.goPrev();
        } else if (t.deltaX < -t.get('effectiveDelta')) {
            t.goNext();
        } else {
            t.goto(t.currentPos);
        }

        t.deltaX = 0;

        doc.removeEventListener(MOVE, t, false);
        doc.removeEventListener(END, t, false);
    },
    _slideEnd: function () {
        var t = this;
        t.trigger('slideend', {
            index  : t.currentIndex,
            item   : t._itemEls[t.currentIndex],
            title  : t._itemEls.eq(t.currentIndex).data('title')
        });
    }
});

module.exports = Slider;
