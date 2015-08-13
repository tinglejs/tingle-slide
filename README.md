# Slide 轮播图

- name: tingle-slide
- category: tingle
- caption: true
- order: 0
- tags: mobile,H5,手机,移动,tingle,slide,幻灯片,焦点图
- description: 提供常用的轮播功能，支持自动播放。
- maintainers: gnosaij

---

## tingle-slide

[![Dependency Status](http://img.shields.io/david/tinglejs/tingle-slide.svg?style=flat-square)](https://david-dm.org/tinglejs/tingle-slide) [![devDependency Status](http://img.shields.io/david/dev/tinglejs/tingle-slide.svg?style=flat-square)](https://david-dm.org/tinglejs/tingle-slide#info=devDependencies) [![Bower version](https://badge.fury.io/bo/tingle-slide.svg)](http://badge.fury.io/bo/tingle-slide)

[![tingle-slide](https://nodei.co/npm/tingle-slide.png)](https://npmjs.org/package/tingle-slide)

## TL;DR

`tingle-slide`是抽象的幻灯片容器

## demo

```
<Slide {...props}>
    <div>item 1</div>
    <div>item 2</div>
    <div>item 3</div>
</Slide>
```


### 可用配置

| 配置项 | 必填 | 默认值 | 功能/备注 |
|---|----|---|----|
|className| optional |-| className |
|height| optional |180| Slide 的高度|
|index| optional |0| 初始化开始轮播的 item 序号|
|auto|optional|false|是否自动播放|
|loop|optional|true|是否循环播放|
|onMount|optional|noop|内容变更的时候触发（在 DidMount 的时候会默认执行一次）|
|onSlideEnd|optional|noop|切换之后触发的回调|

