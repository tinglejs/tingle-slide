/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	module.exports = __webpack_require__(1);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }
	
	var _react = __webpack_require__(2);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _tingleIcon = __webpack_require__(3);
	
	var _tingleIcon2 = _interopRequireDefault(_tingleIcon);
	
	var PhotoField = (function (_React$Component) {
	    function PhotoField(props) {
	        _classCallCheck(this, PhotoField);
	
	        _get(Object.getPrototypeOf(PhotoField.prototype), 'constructor', this).call(this, props);
	        this.state = {
	            className: props.className,
	            photoUrl: props.photoUrl,
	            label: props.label,
	            icon: props.icon
	        };
	    }
	
	    _inherits(PhotoField, _React$Component);
	
	    _createClass(PhotoField, [{
	        key: 'showPhotoUtil',
	        value: function showPhotoUtil() {
	            var t = this;
	            WindVane.call('WVCamera', 'takePhoto', {
	                'type': '0'
	            }, function (e1) {
	                WindVane.call('WVCamera', 'confirmUploadPhoto', {
	                    path: e1.localPath
	                }, function (e2) {
	                    alert(JSON.stringify(e2, null, 2));
	                    t.setState({
	                        photoUrl: e2.resourceURL
	                    });
	                }, function () {
	                    alert('上传失败！');
	                });
	            }, function (e) {});
	        }
	    }, {
	        key: 'showPhoto',
	        value: function showPhoto() {}
	    }, {
	        key: 'render',
	        value: function render() {
	            var t = this;
	            return _react2['default'].createElement(
	                'div',
	                { className: 'tPhotoField tFBH tFBAC tPR4 ' + t.state.className },
	                _react2['default'].createElement(
	                    'div',
	                    { className: 'tMR10' },
	                    t.state.label
	                ),
	                _react2['default'].createElement(
	                    'div',
	                    { className: 'tFB1 tFBH tFBAC tFBJE' },
	                    t.state.photoUrl ? _react2['default'].createElement('img', { className: 'tPhotoFieldPreview',
	                        src: t.state.photoUrl,
	                        onClick: t.showPhoto.bind(this) }) : '',
	                    _react2['default'].createElement(
	                        'div',
	                        { className: 'tPhotoFieldIcon tML4',
	                            onClick: t.showPhotoUtil.bind(this) },
	                        _react2['default'].createElement(_tingleIcon2['default'], { name: t.state.icon })
	                    )
	                )
	            );
	        }
	    }]);
	
	    return PhotoField;
	})(_react2['default'].Component);
	
	PhotoField.defaultProps = {
	    photoUrl: ''
	};
	
	exports.PhotoField = PhotoField;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = React;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = require("tingle-icon");

/***/ }
/******/ ])
//# sourceMappingURL=PhotoField.js.map