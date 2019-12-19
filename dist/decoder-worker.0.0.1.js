/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
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
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/worker/worker.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/worker/data.js":
/*!****************************!*\
  !*** ./src/worker/data.js ***!
  \****************************/
/*! exports provided: DataReader */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"DataReader\", function() { return DataReader; });\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\n/* eslint-disable no-bitwise */\nvar DataReader =\n/*#__PURE__*/\nfunction () {\n  function DataReader(dataView) {\n    _classCallCheck(this, DataReader);\n\n    this.view = dataView;\n    this.pos = 0;\n  }\n\n  _createClass(DataReader, [{\n    key: \"_getData\",\n    value: function _getData(method, nbytes, littleEndian) {\n      var data = this.view[method](this.pos, littleEndian);\n      this.pos += nbytes;\n      return data;\n    }\n  }, {\n    key: \"reset\",\n    value: function reset() {\n      this.pos = 0;\n    }\n  }, {\n    key: \"remain\",\n    value: function remain() {\n      return this.view.byteLength - this.pos;\n    }\n  }, {\n    key: \"skip\",\n    value: function skip(n) {\n      this.pos += n;\n    }\n  }, {\n    key: \"uint8\",\n    value: function uint8() {\n      return this._getData('getUint8', 1, false);\n    }\n  }, {\n    key: \"uint32\",\n    value: function uint32() {\n      var bigEndian = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;\n      return this._getData('getUint32', 4, bigEndian);\n    }\n  }, {\n    key: \"uint16\",\n    value: function uint16() {\n      var bigEndian = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;\n      return this._getData('getUint16', 2, bigEndian);\n    }\n  }, {\n    key: \"string\",\n    value: function string(n) {\n      var data = '';\n\n      for (var i = 0; i < n; i++) {\n        data += String.fromCharCode(this.uint8());\n      }\n\n      return data;\n    }\n  }, {\n    key: \"pcm16\",\n    value: function pcm16() {\n      var littleEndian = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;\n\n      var data = this._getData('getInt16', 2, littleEndian);\n\n      return data / 32768;\n    }\n  }, {\n    key: \"pcm24\",\n    value: function pcm24() {\n      var x0 = this.view.getUint8(this.pos + 0);\n      var x1 = this.view.getUint8(this.pos + 1);\n      var x2 = this.view.getUint8(this.pos + 2);\n      var xx = x0 + (x1 << 8) + (x2 << 16);\n      this.pos += 3;\n      return xx / 8388608;\n    }\n  }, {\n    key: \"pcm32\",\n    value: function pcm32() {\n      var littleEndian = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;\n      var data = this.view.getInt32(this.pos, littleEndian);\n      this.pos += 4;\n      return data / 2147483648;\n    }\n  }, {\n    key: \"pcm32f\",\n    value: function pcm32f() {\n      var littleEndian = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;\n      var data = this.view.getFloat32(this.pos, littleEndian);\n      this.pos += 4;\n      return data;\n    }\n  }, {\n    key: \"pcm64f\",\n    value: function pcm64f() {\n      var littleEndian = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;\n      var data = this.view.getFloat64(this.pos, littleEndian);\n      this.pos += 8;\n      return data;\n    }\n  }]);\n\n  return DataReader;\n}();\n\n//# sourceURL=webpack:///./src/worker/data.js?");

/***/ }),

/***/ "./src/worker/entry.js":
/*!*****************************!*\
  !*** ./src/worker/entry.js ***!
  \*****************************/
/*! exports provided: eventHandler */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"eventHandler\", function() { return eventHandler; });\n/* harmony import */ var _wav__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./wav */ \"./src/worker/wav.js\");\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\n // Available audio decoders according to (MIME) types\n\nvar DECODER_TYPES = {\n  'audio/pcm': {\n    Cls: _wav__WEBPACK_IMPORTED_MODULE_0__[\"PcmDecoder\"],\n    samplerate: 48000,\n    channels: 2\n  },\n  'audio/x-wav': {\n    Cls: _wav__WEBPACK_IMPORTED_MODULE_0__[\"WavDecoder\"]\n  },\n  'audio/wav': {\n    Cls: _wav__WEBPACK_IMPORTED_MODULE_0__[\"WavDecoder\"]\n  }\n};\n\nfunction errorHandler(msg, callback) {\n  callback({\n    error: msg\n  });\n} // Handle events related to audio decoding\n\n\nvar AudioDecoderEventHandler =\n/*#__PURE__*/\nfunction () {\n  function AudioDecoderEventHandler() {\n    _classCallCheck(this, AudioDecoderEventHandler);\n\n    this.decoder = null;\n  } // Entry point for event handling\n\n\n  _createClass(AudioDecoderEventHandler, [{\n    key: \"handleEvent\",\n    value: function handleEvent(event, callback) {\n      var method = \"_\".concat(event.data.name, \"Handler\");\n\n      if (this[method]) {\n        this[method].call(this, event.data.data, callback);\n        return;\n      }\n\n      errorHandler(\"No event handler found for '\".concat(event.data.name, \"'\"), callback);\n    } // Codec configuration information\n\n  }, {\n    key: \"_configHandler\",\n    value: function _configHandler(data, callback) {\n      var mime = data.mime;\n\n      if (this.decoder) {\n        errorHandler('Decoder already available, unable to initialize', callback);\n        return;\n      }\n\n      if (Object.prototype.hasOwnProperty.call(DECODER_TYPES, mime)) {\n        var config = DECODER_TYPES[mime]; // Create decoder and set sample rate and channel count, if present\n\n        this.decoder = new config.Cls();\n\n        if (config.samplerate) {\n          var samplerate = data.samplerate || config.samplerate;\n          var channels = data.channels || config.channels;\n          this.decoder.setAudioConfig(samplerate, channels);\n        }\n\n        callback({\n          config: this.decoder.getAudioConfig()\n        });\n      } else {\n        errorHandler(\"Unsupported mime type \".concat(mime), callback);\n      }\n    } // Decode audio to PCM output\n\n  }, {\n    key: \"_decodeHandler\",\n    value: function _decodeHandler(data, callback) {\n      if (this.decoder) {\n        var decoded = this.decoder.decode(data.decode);\n        callback(decoded);\n      }\n    } // Close decoder\n\n  }, {\n    key: \"_closeHandler\",\n    value: function _closeHandler(data, callback) {\n      if (this.decoder) {\n        delete this.decoder;\n      }\n\n      this.decoder = null;\n      callback();\n    }\n  }]);\n\n  return AudioDecoderEventHandler;\n}();\n\nvar decoder = new AudioDecoderEventHandler();\nfunction eventHandler(event, callback) {\n  decoder.handleEvent(event, callback);\n}\n\n//# sourceURL=webpack:///./src/worker/entry.js?");

/***/ }),

/***/ "./src/worker/wav.js":
/*!***************************!*\
  !*** ./src/worker/wav.js ***!
  \***************************/
/*! exports provided: getWavFmtInfo, PcmDecoder, WavDecoder */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getWavFmtInfo\", function() { return getWavFmtInfo; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"PcmDecoder\", function() { return PcmDecoder; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"WavDecoder\", function() { return WavDecoder; });\n/* harmony import */ var _data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./data */ \"./src/worker/data.js\");\nfunction _typeof(obj) { if (typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; }; } return _typeof(obj); }\n\nfunction _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === \"object\" || typeof call === \"function\")) { return call; } return _assertThisInitialized(self); }\n\nfunction _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return self; }\n\nfunction _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function\"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }\n\nfunction _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\n\nfunction getWavFmtInfo(reader, chunkSize) {\n  var formats = {\n    0x0001: 'lpcm',\n    0x0003: 'lpcm'\n  };\n  var formatId = reader.uint16();\n\n  if (!Object.prototype.hasOwnProperty.call(formats, formatId)) {\n    throw new Error(\"Unsupported format in WAV: 0x\".concat(formatId.toString(16)));\n  }\n\n  var meta = {\n    formatId: formatId,\n    floatingPoint: formatId === 0x0003,\n    numberOfChannels: reader.uint16(),\n    sampleRate: reader.uint32(),\n    byteRate: reader.uint32(),\n    blockSize: reader.uint16(),\n    bitDepth: reader.uint16(),\n    readerMethodName: null\n  };\n  reader.skip(chunkSize - 16);\n  var decoderOption = meta.floatingPoint ? 'f' : '';\n  meta.readerMethodName = \"pcm\".concat(meta.bitDepth).concat(decoderOption);\n\n  if (!reader[meta.readerMethodName]) {\n    throw new Error(\"Unsupported bit depth in WAV: \".concat(meta.bitDepth, \" (\").concat(meta.readerMethodName, \")\"));\n  }\n\n  return meta;\n}\nvar PcmDecoder =\n/*#__PURE__*/\nfunction () {\n  function PcmDecoder() {\n    _classCallCheck(this, PcmDecoder);\n\n    this.blockSize = 4;\n    this.sampleRate = 48000;\n    this.numberOfChannels = 2;\n    this.readerMethodName = 'pcm16';\n  }\n\n  _createClass(PcmDecoder, [{\n    key: \"setAudioConfig\",\n    value: function setAudioConfig(samplerate, channels) {\n      this.sampleRate = samplerate;\n      this.numberOfChannels = channels;\n      this.blockSize = 2 * this.numberOfChannels;\n    }\n  }, {\n    key: \"getAudioConfig\",\n    value: function getAudioConfig() {\n      return {\n        sampleRate: this.sampleRate,\n        numberOfChannels: this.numberOfChannels\n      };\n    }\n  }, {\n    key: \"decode\",\n    value: function decode(arrayBuffer) {\n      var dataView = new DataView(arrayBuffer);\n      var reader = new _data__WEBPACK_IMPORTED_MODULE_0__[\"DataReader\"](dataView);\n\n      if (this.init) {\n        this.init(reader);\n      }\n\n      var chunkSize = reader.remain();\n      var length = Math.floor(chunkSize / this.blockSize);\n      var channelData = new Array(this.numberOfChannels);\n\n      for (var ch = 0; ch < this.numberOfChannels; ch++) {\n        channelData[ch] = new Float32Array(length);\n      }\n\n      var read = reader[this.readerMethodName].bind(reader);\n\n      for (var i = 0; i < length; i++) {\n        for (var _ch = 0; _ch < this.numberOfChannels; _ch++) {\n          channelData[_ch][i] = read();\n        }\n      }\n\n      return {\n        channelData: channelData.map(function (arr) {\n          return arr.buffer;\n        }),\n        length: length,\n        numChannels: this.numberOfChannels,\n        sampleRate: this.sampleRate\n      };\n    }\n  }]);\n\n  return PcmDecoder;\n}();\nvar WavDecoder =\n/*#__PURE__*/\nfunction (_PcmDecoder) {\n  _inherits(WavDecoder, _PcmDecoder);\n\n  function WavDecoder() {\n    var _this;\n\n    _classCallCheck(this, WavDecoder);\n\n    _this = _possibleConstructorReturn(this, _getPrototypeOf(WavDecoder).call(this));\n    _this.length = 0;\n    _this.readerMeta = null;\n    return _this;\n  }\n\n  _createClass(WavDecoder, [{\n    key: \"init\",\n    value: function init(reader) {\n      // WAVE header already read\n      if (this.readerMeta) {\n        return false;\n      }\n\n      if (reader.string(4) !== 'RIFF') {\n        throw new Error('Invalid WAV, no RIFF found');\n      } // File length\n\n\n      this.length = reader.uint32();\n\n      if (reader.string(4) !== 'WAVE') {\n        throw new Error('Invalid WAV, no WAVE found');\n      }\n\n      var dataFound = false;\n\n      do {\n        var chunkType = reader.string(4);\n        var chunkSize = reader.uint32();\n\n        switch (chunkType) {\n          case 'fmt ':\n            this.readerMeta = getWavFmtInfo(reader, chunkSize);\n            break;\n\n          case 'data':\n            dataFound = true;\n            break;\n\n          default:\n            reader.skip(Math.min(chunkSize, reader.remain()));\n            break;\n        }\n      } while (!dataFound && reader.remain());\n\n      if (!dataFound) {\n        throw new Error('Invalid WAV, no data chunk found');\n      }\n\n      this.blockSize = this.readerMeta.blockSize;\n      this.sampleRate = this.readerMeta.sampleRate;\n      this.numberOfChannels = this.readerMeta.numberOfChannels;\n      this.readerMethodName = this.readerMeta.readerMethodName;\n      return true;\n    }\n  }]);\n\n  return WavDecoder;\n}(PcmDecoder);\n\n//# sourceURL=webpack:///./src/worker/wav.js?");

/***/ }),

/***/ "./src/worker/worker.js":
/*!******************************!*\
  !*** ./src/worker/worker.js ***!
  \******************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _entry__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./entry */ \"./src/worker/entry.js\");\n/* eslint no-restricted-globals: 0 */\n\n/* global self */\n\n\nself.onmessage = function (event) {\n  return Object(_entry__WEBPACK_IMPORTED_MODULE_0__[\"eventHandler\"])(event, self.postMessage);\n};\n\n//# sourceURL=webpack:///./src/worker/worker.js?");

/***/ })

/******/ });