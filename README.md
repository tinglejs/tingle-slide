# Slide 轮播图 [![Npm version](https://badge.fury.io/js/tingle-slide.svg)](http://badge.fury.io/js/tingle-slide)

`tingle-slide`是抽象的幻灯片容器

<img src="https://img.alicdn.com/tps/TB1FMD9JpXXXXazXFXXXXXXXXXX-750-1254.png" width="375"/>

## Simple Usage

```js
<Slide>
    <div>item 1</div>
    <div>item 2</div>
    <div>item 3</div>
</Slide>
```


## 可用配置

| 配置项 | 类型 | 必填 | 默认值 | 功能/备注 |
|---|----|---|---|----|
|className| string |optional |-| className |
|height| string or number |optional |180| Slide 的高度|
|index| number | optional |0| 初始化开始轮播的 item 序号|
|auto|boolean|optional|false|是否自动播放|
|loop|boolean|optional|true|是否循环播放|
|showNav|boolean|optional|false|是否显示导航用的小点
|onMount|function|optional|noop|内容变更的时候触发（在 DidMount 的时候会默认执行一次）|
|onSlideEnd|function|optional|noop|切换之后触发的回调|

## Links 相关链接

- [Fire a bug/Issues 提Bug](https://github.com/tinglejs/tingle-slide/issues)