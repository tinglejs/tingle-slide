# tingle项目起步

## 本地环境

在使用或者参与开发`tingle`项目之前，需要在本地先安装好几个必须的工具。

* [Nodejs](https://nodejs.org/)开发环境，安装方法详见官网。
* [Gulp](http://gulpjs.com/)前端构建平台，推荐以全局方式安装。执行`npm install gulp -g`

## 下载代码仓库

待补充...

## 安装依赖的开发工具或库

`tingle`项目所依赖所有开发工具和JS库，在根目录的`package.json`文件中已配置好，进入刚下载好的`tingle`目录，运行下面的命令即可安装。

```
$ npm install
```

在安装`webpack`和`babel`工具的过程中，会有编译不通过的情况，通常都是因为大墙内某些依赖的脚本没有下载成功导致。如果出现这种情况，可以使用`cnpm`解决。

安装`cnpm`，并使用`cnpm`安装所有依赖

```
$ npm install cnpm -g
$ cnpm install
```

## 启动Server，开启React之旅

所有的准备工作都已准备完毕，现在先启动`server`，看看项目中已有的`demo`吧。执行下面的代码：

```
$ gulp d
```

上面的命令执行后，稍等片刻，会在浏览器自动打开项目根目录下的`index.html`（其他页面可以手动打开）用来实时预览开发效果，
页面中如果看到`"为tingle打气"`，说明你的开发环境已搭建成功。
