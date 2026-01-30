/*!
  * wia base v1.2.8
  * (c) 2014 Sibyl Yu
  * Licensed under the Elastic License 2.0.
  * You may not use this file except in compliance with the Elastic License.
*/
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.$ = factory());
})(this, (function () { 'use strict';

  /** 
   * 是否支持触摸 touch等功能
  */ function _instanceof$2(left, right) {
      if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
          return !!right[Symbol.hasInstance](left);
      } else {
          return left instanceof right;
      }
  }
  var _support;
  var Support = function Support() {
      if (_support) return _support;
      _support = {
          touch: !!('ontouchstart' in window || window.DocumentTouch && _instanceof$2(document, window.DocumentTouch)),
          pointerEvents: !!window.PointerEvent && 'maxTouchPoints' in window.navigator && window.navigator.maxTouchPoints >= 0,
          observer: function checkObserver() {
              return 'MutationObserver' in window || 'WebkitMutationObserver' in window;
          }(),
          passiveListener: function checkPassiveListener() {
              var supportsPassive = false;
              try {
                  var opts = Object.defineProperty({}, 'passive', {
                      // eslint-disable-next-line
                      get: function get() {
                          supportsPassive = true;
                      }
                  });
                  window.addEventListener('testPassiveListener', null, opts);
              } catch (e) {
              // No support
              }
              return supportsPassive;
          }(),
          gestures: function checkGestures() {
              return 'ongesturestart' in window;
          }(),
          intersectionObserver: function checkObserver() {
              return 'IntersectionObserver' in window;
          }()
      };
      return _support;
  }();

  /**
   * 引入全局变量$，wia app base.js的一部分，来源于zepto，每个微应用均需在index.html中引用base.js，
   * $之前主要为替代zepto、jQuery的dom操作引入的，因此基础文件也引入了几个简单的dom操作，
   * 更多类似jQuery操作需引用dom.js库。
   * 相关方法与用法与 zepto、jQuery兼容。
   */ function _array_like_to_array$1(arr, len) {
      if (len == null || len > arr.length) len = arr.length;
      for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
      return arr2;
  }
  function _instanceof$1(left, right) {
      if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
          return !!right[Symbol.hasInstance](left);
      } else {
          return left instanceof right;
      }
  }
  function _unsupported_iterable_to_array$1(o, minLen) {
      if (!o) return;
      if (typeof o === "string") return _array_like_to_array$1(o, minLen);
      var n = Object.prototype.toString.call(o).slice(8, -1);
      if (n === "Object" && o.constructor) n = o.constructor.name;
      if (n === "Map" || n === "Set") return Array.from(n);
      if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _array_like_to_array$1(o, minLen);
  }
  function _create_for_of_iterator_helper_loose$1(o, allowArrayLike) {
      var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
      if (it) return (it = it.call(o)).next.bind(it);
      if (Array.isArray(o) || (it = _unsupported_iterable_to_array$1(o)) || allowArrayLike && o && typeof o.length === "number") {
          if (it) o = it;
          var i = 0;
          return function() {
              if (i >= o.length) {
                  return {
                      done: true
                  };
              }
              return {
                  done: false,
                  value: o[i++]
              };
          };
      }
      throw new TypeError("Invalid attempt to iterate non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  var emptyArray = [], class2type = {}, filter = emptyArray.filter, slice = emptyArray.slice, toString = class2type.toString, singleTagRE = /^<(\w+)\s*\/?>(?:<\/\1>|)$/, simpleSelectorRE = /^[\w-]*$/, tagExpanderRE = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi, fragmentRE = /^\s*<(\w+|!)[^>]*>/, uniqueNumber = 1, tempParent = document.createElement('div');
  document.ready = function(cb) {
      // don't use "interactive" on IE <= 10 (it can fired premature)
      if (document.readyState === 'complete' || document.readyState !== 'loading' && !document.documentElement.doScroll) setTimeout(function() {
          cb($$1);
      }, 0);
      else {
          var handler = function handler1() {
              document.removeEventListener('DOMContentLoaded', handler, false);
              window.removeEventListener('load', handler, false);
              cb($$1);
          };
          document.addEventListener('DOMContentLoaded', handler, false);
          window.addEventListener('load', handler, false);
      }
  };
  /**
   * Return collection with methods
   */ var D = /*#__PURE__*/ function() {
      function D(doms, sel, name) {
          var _this = this;
          var len = doms ? doms.length : 0;
          for(var i = 0; i < len; i++)this[i] = doms[i];
          this.dom = doms ? doms[0] : null;
          this.length = len;
          this.selector = sel || '';
          // 加载有name的dom节点到对象，方便按名称直接调用
          if (len && name) {
              doms.forEach(function(el) {
                  var ns = $$1.qus('[name]', el);
                  (ns == null ? void 0 : ns.length) && ns.forEach(function(n) {
                      var $n = $$1(n);
                      var nm = $n.attr('name');
                      if (!_this.n) _this.n = {};
                      if (!_this.n[nm] || _this.n[nm].dom !== n) _this.n[nm] = $n;
                      if (!_this[nm] || D.isD(_this[nm]) && _this[nm].dom !== n) _this[nm] = $n;
                  });
              });
          }
      }
      var _proto = D.prototype;
      // 包含类名，支持多个类名，空格隔开！！！
      _proto.hasClass = function hasClass(name) {
          var R = false;
          try {
              if (name) {
                  R = emptyArray.some.call(this, function(el) {
                      var _el_classList;
                      if (!name.includes(' ')) return el == null ? void 0 : (_el_classList = el.classList) == null ? void 0 : _el_classList.contains(name);
                      else {
                          var nms = name.split(' ');
                          return nms.every(function(nm) {
                              var _el_classList;
                              return el == null ? void 0 : (_el_classList = el.classList) == null ? void 0 : _el_classList.contains(nm.trim());
                          });
                      }
                  });
              }
          } catch (e) {}
          return R;
      };
      /**
     * Add classes to the given element.
     * @param {string} value - The classes to be add.
     * @param {boolean} only - Delete all the styles in the same layer, used by tab
     */ _proto.addClass = function addClass(className, only) {
          if (typeof className === 'undefined') {
              return this;
          }
          var classes = className.split(' ');
          for(var i = 0; i < classes.length; i += 1){
              for(var j = 0; j < this.length; j += 1){
                  var n = this[j];
                  if (typeof n !== 'undefined' && typeof n.classList !== 'undefined') {
                      if (arguments.length === 1) n.classList.add(classes[i]);
                      else if (only) {
                          // clear all
                          $$1('.' + classes[i], n.parentNode).removeClass(classes[i]);
                          // add one
                          n.classList.add(classes[i]);
                      }
                  }
              }
          }
          return this;
      };
      _proto.removeClass = function removeClass(className) {
          var classes = className.split(' ');
          for(var i = 0; i < classes.length; i += 1){
              for(var j = 0; j < this.length; j += 1){
                  if (typeof this[j] !== 'undefined' && typeof this[j].classList !== 'undefined') this[j].classList.remove(classes[i]);
              }
          }
          return this;
      };
      _proto.clearClass = function clearClass() {
          var n;
          for(var i = 0; i < this.length; i += 1){
              if (typeof this[i] !== 'undefined' && typeof this[i].classList !== 'undefined') {
                  n = this[i];
                  for(var j = 0; j < n.classList.length; j++)n.classList.remove(n.classList.item(j));
              }
          }
          return this;
      };
      _proto.replaceClass = function replaceClass(src, dst) {
          var n;
          for(var i = 0; i < this.length; i += 1){
              if (typeof this[i] !== 'undefined' && typeof this[i].classList !== 'undefined') {
                  n = this[i];
                  if (n.contains(src)) n.classList.replace(src, dst);
                  else n.classList.add(dst);
              }
          }
          return this;
      };
      /**
     * Add or remove classes from the given element.
     * @param {string} value - The classes to be toggled.
     * @param {boolean} add - add or remove.
     */ _proto.toggleClass = function toggleClass(className, add) {
          var classes = className.split(' ');
          for(var i = 0; i < classes.length; i += 1){
              for(var j = 0; j < this.length; j += 1){
                  if (typeof this[j] !== 'undefined' && typeof this[j].classList !== 'undefined') {
                      if (arguments.length === 1) this[j].classList.toggle(classes[i]);
                      else add ? this[j].classList.add(classes[i]) : this[j].classList.remove(classes[i]);
                  }
              }
          }
          return this;
      };
      D.isD = function isD(d) {
          return _instanceof$1(d, D);
      };
      return D;
  }();
  function likeArray(obj) {
      var length = !!obj && 'length' in obj && obj.length, type = $$1.type(obj);
      return 'function' != type && !$$1.isWindow(obj) && ('array' == type || length === 0 || typeof length == 'number' && length > 0 && length - 1 in obj);
  }
  // 去掉 null 节点
  function compact(array) {
      return filter.call(array, function(item) {
          return item != null;
      });
  }
  function flatten(array) {
      return array.length > 0 ? $$1.fn.concat.apply([], array) : array;
  }
  // `$.zepto.fragment` takes a html string and an optional tag name
  // to generate DOM nodes from the given html string.
  // The generated DOM nodes are returned as an array.
  // it compatible with browsers that don't support the DOM fully.
  function fragment(html, name, properties) {
      var R;
      // A special case optimization for a single tag
      if (singleTagRE.test(html)) R = $$1(document.createElement(RegExp.$1));
      if (!R) {
          if (html.replace) html = html.replace(tagExpanderRE, '<$1></$2>');
          if (name === undefined) name = fragmentRE.test(html) && RegExp.$1;
          var containers = {
              tr: 'tbody',
              colgroup: 'table',
              thead: 'table',
              tbody: 'table',
              tfoot: 'table',
              td: 'tr',
              th: 'tr',
              li: 'ul',
              option: 'select',
              '*': 'div'
          };
          if (!(name in containers)) name = '*';
          var container = document.createElement(containers[name]);
          container.innerHTML = '' + html;
          R = $$1.each(slice.call(container.childNodes), function() {
              container.removeChild(this);
          });
      }
      if ($$1.isPlainObject(properties)) {
          var nodes = $$1(R);
          // special attributes that should be get/set via method calls
          var methodAttributes = [
              'val',
              'css',
              'html',
              'text',
              'data',
              'width',
              'height',
              'offset'
          ];
          $$1.each(properties, function(key, value) {
              if (methodAttributes.indexOf(key) > -1) nodes[key](value);
              else nodes.attr(key, value);
          });
      }
      return R;
  }
  /**
   * 将选择器组件封装为Dom组件
   * @param {*} sel selector 选择器，支持点击事件对象自动转换为target
   * @param {*} ctx context or name
   * true：为 name
   * @param {boolean=} name 加载有名dom，默认为 false
   * @returns Dom实例，D instance
   */ function $$1(sel, ctx, name) {
      var R = [];
      if (sel) {
          if (!name && ctx === true) {
              name = true;
              ctx = null;
          }
          if (typeof sel === 'string') {
              sel = (sel || '').trim();
              if (sel[0] === '#') {
                  var dom = document.getElementById(sel.substr(1));
                  if (dom) R.push(dom);
              } else if (sel[0] === '<' && fragmentRE.test(sel)) R = fragment(sel, RegExp.$1, ctx), sel = null;
              else if (ctx) return $$1(ctx).find(sel);
              else R = $$1.qsa(sel);
          } else if (sel.nodeType || sel === window || sel === document) {
              R = [
                  sel
              ];
              sel = null;
          } else if (D.isD(sel)) return sel;
          else if ($$1.isFunction(sel)) return document.ready(sel);
          else if ($$1.isObject(sel) && sel.target && (sel.target.nodeType || sel.target === window || sel.target === document)) {
              R = [
                  sel.target
              ];
              sel = null;
          } else {
              // normalize array if an array of nodes is given
              if ($$1.isArray(sel)) R = compact(sel);
              else if (fragmentRE.test(sel)) R = fragment(sel, RegExp.$1, ctx), sel = null;
              else if (ctx) return $$1(ctx).find(sel);
              else R = $$1.qsa(sel);
          }
      }
      return new D(R, sel, name);
  }
  // plugin compatibility
  $$1.uuid = 0;
  $$1.expr = {};
  $$1.noop = function() {};
  $$1.support = Support;
  $$1.fragment = fragment;
  var ObjToString = Object.prototype.toString;
  function getTag(value) {
      if (value == null) {
          return value === undefined ? '[object Undefined]' : '[object Null]';
      }
      return ObjToString.call(value);
  }
  // 静态属性,可直接调用，识别 boolean、string、number、object、date、array、regexp、function
  $$1.type = function(obj) {
      return obj == null ? String(obj) : class2type[toString.call(obj)] || 'object';
  };
  // eslint-disable-next-line func-names
  $$1.isWindow = function(o) {
      return o != null && o == o.window;
  };
  // 纯对象变量，不包含函数、Date、正则、数组等对象
  $$1.isObject = function(v) {
      return $$1.type(v) === 'object';
  };
  $$1.isMap = function(v) {
      return $$1.type(v) === 'Map';
  };
  $$1.isSet = function(v) {
      return $$1.type(v) === 'Set';
  };
  $$1.isRegExp = function(v) {
      return $$1.type(v) === 'RegExp';
  };
  $$1.isSymbol = function(v) {
      return $$1.type(v) === 'symbol';
  };
  $$1.isObj = $$1.isObject;
  $$1.isPromise = function(val) {
      return ($$1.isObject(val) || $$1.isFunction(val)) && $$1.isFunction(val.then) && $$1.isFunction(val.catch);
  };
  // 值变量
  $$1.isValue = function(o) {
      return $$1.type(o) === 'string' || $$1.type(o) === 'number' || $$1.type(o) === 'boolean';
  };
  $$1.isVal = $$1.isValue;
  // 函数变量
  $$1.isFunction = function(value) {
      return $$1.type(value) === 'function';
  };
  $$1.isFun = $$1.isFunction;
  $$1.isDocument = function(o) {
      return o != null && o.nodeType == o.DOCUMENT_NODE;
  };
  $$1.isDoc = $$1.isDocument;
  $$1.isPlainObject = function(o) {
      return $$1.isObject(o) && !$$1.isWindow(o) && Object.getPrototypeOf(o) == Object.prototype;
  };
  $$1.isPlain = $$1.isPlainObject;
  $$1.isEmptyObject = function(o) {
      var name;
      for(name in o)return false;
      return true;
  };
  $$1.isEmpty = function(o) {
      if ($$1.isObject(o)) return $$1.isEmptyObject(o);
      else if ($$1.isArray(o)) return o.length === 0;
      else return o === '' || o === null || o === undefined;
  };
  /**
   * undefined or null
   * @param {*} v
   * @returns
   */ $$1.isNull = function(v) {
      return v == null;
  };
  $$1.isBool = function(v) {
      return $$1.type(v) === 'boolean';
  };
  $$1.hasVal = function(v) {
      return !$$1.isEmpty(v);
  };
  $$1.isArray = Array.isArray || function(object) {
      return _instanceof$1(object, Array);
  };
  $$1.inArray = function(elem, array, i) {
      return emptyArray.indexOf.call(array, elem, i);
  };
  // jQuery new Date() 判断为 数字
  $$1.isNumeric = function(val) {
      return typeof val === 'number' || $$1.isObject(val) && getTag(val) == '[object Number]';
  };
  $$1.isNumber = $$1.isNumeric;
  $$1.isNum = $$1.isNumeric;
  $$1.isString = function(v) {
      return $$1.type(v) === 'string';
  };
  $$1.isStr = $$1.isString;
  $$1.isDom = function(v) {
      return D.isD(v);
  };
  $$1.isDate = function(v) {
      return $$1.type(v) === 'date';
  };
  $$1.isDateStr = function(v) {
      return Date.parse(v) > 0;
  };
  $$1.isNumStr = function(v) {
      return !Number.isNaN(Number(v));
  };
  $$1.funcArg = function(context, arg, idx, payload) {
      return $$1.isFunction(arg) ? arg.call(context, idx, payload) : arg;
  };
  $$1.contains = document.documentElement.contains ? function(parent, node) {
      return parent !== node && parent.contains(node);
  } : function(parent, node) {
      while(node && (node = node.parentNode))if (node === parent) return true;
      return false;
  };
  /**
   * 判断元素el是否匹配选择器sel
   */ $$1.matches = function(el, sel) {
      var R = false;
      try {
          if (!sel || !el) return false;
          if (sel === document) R = el === document;
          else if (sel === window) R = el === window;
          else if (sel.nodeType) R = el === sel;
          else if (_instanceof$1(sel, D)) R = ~sel.indexOf(el);
          else if (el.nodeType === 1 && typeof sel === 'string') {
              var match = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.oMatchesSelector || el.matchesSelector;
              if (match) R = match.call(el, sel);
              else {
                  // fall back to performing a selector:
                  var parent = el.parentNode;
                  var temp = !parent;
                  if (temp) (parent = tempParent).appendChild(el);
                  R = ~$$1.qsa(sel, parent).indexOf(el);
                  temp && tempParent.removeChild(el);
              }
          }
      } catch (e) {
          console.log('matches exp:', e.message);
      }
      return R;
  };
  $$1.trim = function(str) {
      return str == null ? '' : String.prototype.trim.call(str);
  };
  // 遍历数组或对象元素，生成新的数组
  $$1.map = function(els, cb) {
      var R = [];
      if (likeArray(els)) for(var i = 0; i < els.length; i++){
          try {
              var v = cb(els[i], i);
              if (v != null) R.push(v);
          } catch (e) {
              console.log('map exp:', e.message);
          }
      }
      else {
          els.keys.forEach(function(k) {
              try {
                  var v = cb(els[k], k);
                  if (v != null) R.push(v);
              } catch (e) {
                  console.log('map exp:', e.message);
              }
          });
      }
      return flatten(R) // 拉平
      ;
  };
  // 数组中的节点元素作为this参数，传递到cb中，返回数组
  $$1.each = function(els, cb) {
      var i, key;
      if (likeArray(els)) {
          for(i = 0; i < els.length; i++)if (cb.call(els[i], i, els[i]) === false) return els;
      } else {
          for(key in els)if (cb.call(els[key], key, els[key]) === false) return els;
      }
      return els;
  };
  $$1.forEach = function(els, cb) {
      var i, key;
      if (likeArray(els)) {
          for(i = 0; i < els.length; i++)if (cb.call(els[i], els[i], i) === false) return els;
      } else {
          for(key in els)if (cb.call(els[key], els[key], key) === false) return els;
      }
      return els;
  };
  $$1.grep = function(els, cb) {
      return filter.call(els, cb);
  };
  // Populate the class2type map
  $$1.each('Boolean Number String Function Array Date RegExp Object Error'.split(' '), function(i, name) {
      class2type['[object ' + name + ']'] = name.toLowerCase();
  });
  $$1.id = function(x) {
      return document.getElementById(x);
  };
  $$1.qu = $$1.qs = function(sel, ctx) {
      var R = null;
      try {
          var el = ctx;
          if (!ctx) el = document;
          else if (D.isD(ctx)) el = ctx[0];
          var maybeID = sel[0] == '#', nameOnly = maybeID ? sel.slice(1) : sel, isSimple = simpleSelectorRE.test(nameOnly);
          if (document.getElementById && isSimple && maybeID) // Safari DocumentFragment doesn't have getElementById
          R = document.getElementById(nameOnly);
          else R = el.querySelector(sel);
      } catch (e) {
          console.error('$.qu/qs exp:', e.message);
      }
      return R;
  };
  // `$.qsa` is Dom's CSS selector implementation which
  // uses `.querySelectorAll` and optimizes for some special cases, like `#id`.
  // 返回数组, 便于 forEach，参数与zepto参数相反
  $$1.qus = $$1.qsa = function(sel, ctx) {
      var R = [];
      try {
          var el = ctx;
          if (!ctx) el = document;
          else if (D.isD(ctx)) el = ctx[0];
          var found, maybeID = sel[0] == '#', maybeClass = !maybeID && sel[0] == '.', nameOnly = maybeID || maybeClass ? sel.slice(1) : sel, isSimple = simpleSelectorRE.test(nameOnly);
          if (document.getElementById && isSimple && maybeID) // Safari DocumentFragment doesn't have getElementById
          R = (found = document.getElementById(nameOnly)) ? [
              found
          ] : [];
          else if (el.nodeType === 1 || el.nodeType === 9 || el.nodeType === 11) {
              try {
                  var ns = isSimple && !maybeID && el.getElementsByClassName // DocumentFragment doesn't have getElementsByClassName/TagName
                   ? maybeClass ? el.getElementsByClassName(nameOnly) // If it's simple, it could be a class
                   : el.getElementsByTagName(sel) // Or a tag
                   : el.querySelectorAll(sel) // Or it's not simple, and we need to query all
                  ;
                  if (ns && ns.length > 0) R = slice.call(ns);
              } catch (e) {
                  console.error('$.qus/qsa exp:', e.message);
              }
          }
      } catch (e) {
          console.error('$.qus/qsa exp:', e.message);
      }
      return R;
  };
  /**
   * 通过name获得dom对象
   * getElementsByName 只能用于document全局，querySelector 可用于局部
   * @param {string} name
   * @param {object} ctx parent dom
   */ $$1.qn = function qn(name, ctx) {
      var sel = '[name="' + name + '"]';
      return $$1.qu(sel, ctx);
  };
  // 返回指定name数组, 便于 forEach
  // 效率高于qus
  $$1.qns = function(name, ctx) {
      var R = null;
      if (ctx) R = $$1.qus('[name="' + name + '"]', ctx);
      else {
          R = document.getElementsByName(name);
          if (R && R.length > 0) R = slice.call(R);
          else R = [];
      }
      return R;
  };
  // 返回指定class name数组, 便于 forEach
  // 效率高于qus
  $$1.qcs = function(sel, ctx) {
      var R = null;
      if (ctx) R = D.isD(ctx) ? ctx[0].getElementsByClassName(sel) : ctx.getElementsByClassName(sel);
      else R = document.getElementsByClassName(sel);
      if (R && R.length > 0) return slice.call(R);
      else return [];
  };
  // 返回指定tag name数组, 便于 forEach
  // 效率高于qus
  $$1.qts = function(sel, ctx) {
      var R = null;
      if (ctx) R = D.isD(ctx) ? ctx[0].getElementsByTagName(sel) : ctx.getElementsByTagName(sel);
      else R = document.getElementsByTagName(sel);
      if (R && R.length > 0) return slice.call(R);
      else return [];
  };
  /**
   * Copy all but undefined properties from one or more to dst
   * Object.assign 在安卓微信上低版本不支持
   * zepto 使用for in，包含继承属性，修改为只拷贝对象自有属性
   * @param to 拷贝目标
   * @param src 拷贝源
   * @param deep 是否深拷贝
   */ function assign(to, src, deep) {
      if (src !== undefined && src !== null) {
          var ks = Object.keys(Object(src));
          //   for (key in src) {
          for(var i = 0, len = ks.length; i < len; i += 1){
              var k = ks[i];
              var desc = Object.getOwnPropertyDescriptor(src, k);
              if (desc !== undefined && desc.enumerable) {
                  if (deep && ($$1.isPlainObject(src[k]) || $$1.isArray(src[k]))) {
                      if ($$1.isPlainObject(src[k]) && !$$1.isPlainObject(to[k])) to[k] = {};
                      if ($$1.isArray(src[k]) && !$$1.isArray(to[k])) to[k] = [];
                      assign(to[k], src[k], deep);
                  } else to[k] = src[k];
              }
          }
      }
  }
  /**
   * Copy all but undefined properties from one or more
   * Object.assign 在部分安卓上不兼容，并且不支持深拷贝
   * 第一个参数为 true，为深拷贝，
   */ $$1.assign = function(to) {
      for(var _len = arguments.length, srcs = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
          srcs[_key - 1] = arguments[_key];
      }
      if (to === undefined || to === null) return {};
      var deep;
      if (typeof to === 'boolean') {
          deep = to;
          to = srcs.shift();
      }
      srcs.forEach(function(src) {
          assign(to, src, deep);
      });
      return to;
  };
  $$1.extend = $$1.assign;
  $$1.merge = function() {
      for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
          args[_key] = arguments[_key];
      }
      var to = args[0];
      args.splice(0, 1);
      args.forEach(function(src) {
          assign(to, src, false);
      });
      return to;
  };
  $$1.fastLink = function(ctx) {
      // fastLink a 标签加载 touchstart 事件,避免 300毫秒等待，带back attr，调用浏览器返回
      try {
          var links = $$1.qus('a[fastLink][fastlink][back]', ctx);
          links.forEach(function(link) {
              if ($$1.support.touch) {
                  var startX;
                  var startY;
                  link.ontouchstart = function(ev) {
                      startX = ev.changedTouches[0].clientX;
                      startY = ev.changedTouches[0].clientY;
                  };
                  link.ontouchend = function(ev) {
                      if (Math.abs(ev.changedTouches[0].clientX - startX) <= 5 && Math.abs(ev.changedTouches[0].clientY - startY) <= 5) {
                          // ev.preventDefault();
                          if (link.hasAttribute('back')) return window.history.back();
                          if (link.href) window.location.href = link.href;
                      }
                  };
              } else if (link.hasAttribute('back')) {
                  link.onclick = function(ev) {
                      return window.history.back();
                  };
              }
          });
      } catch (e) {
          alert("fastLink exp: " + e.message);
      }
  };
  $$1.requestAnimationFrame = function(callback) {
      if (window.requestAnimationFrame) return window.requestAnimationFrame(callback);
      else if (window.webkitRequestAnimationFrame) return window.webkitRequestAnimationFrame(callback);
      return window.setTimeout(callback, 1000 / 60);
  };
  $$1.cancelAnimationFrame = function(id) {
      if (window.cancelAnimationFrame) return window.cancelAnimationFrame(id);
      else if (window.webkitCancelAnimationFrame) return window.webkitCancelAnimationFrame(id);
      return window.clearTimeout(id);
  };
  $$1.deleteProps = function(obj) {
      var object = obj;
      Object.keys(object).forEach(function(key) {
          try {
              object[key] = null;
          } catch (e) {
          // no setter for object
          }
          try {
              delete object[key];
          } catch (e) {
          // something got wrong
          }
      });
  };
  // 下个事件周期触发
  $$1.nextTick = function(cb, delay) {
      if (delay === void 0) delay = 0;
      return setTimeout(cb, delay);
  };
  // 类似 setTimeout的精准动画帧时间出发
  $$1.nextFrame = function(cb) {
      return $$1.requestAnimationFrame(function() {
          $$1.requestAnimationFrame(cb);
      });
  };
  $$1.now = function() {
      return Date.now();
  };
  $$1.exp = function(info, e) {
      console.error(info + " exp:" + e.message);
  };
  /**
   * 格式化日期，主要用于MongoDb数据库中返回的ISODate格式转换为本地时区指定字符串格式。
   * 或者将日期字符串转换为Date实例，主要修正yyyy-MM-dd这种格式的js bug，和日期加减
   * 由于字符串转换为Date时，会按时区加减时间，保存到 js 内的 Date对象，都是标准时间。
   * 标准时间转换为字符串时，js 内置函数会根据当前时区还原时间，也就是说Date内部实际上是统一的
   * 不同时区，转换为字符串时，显示不同。
   * 如果数据库使用Date对象保存时间字段，不会有问题
   * 如果使用字符串保存时间，'yyyy-MM-dd' 与 'yyyy/MM/dd' 保存到数据库里面的时间不一样。
   * 'yyyy/MM/dd' 会减8小时，'yyyy-MM-dd' 不会减。
   * '2022-02-10' 不会减8小时，'2022-2-10' 会减8小时。
   * '2022-02-10 12:00:00' 会减8小时。
   * '2022-12-10' 不会减8小时。
   * 这应该是 js的一个bug！！！
   * 因此，数据库查询与保存时，对日期类型，需谨慎操作！！！
   * 从数据库取出时，需加8小时，'yyyy-mm-dd'格式会多8小时。
   * 因此需将'yyyy-mm-dd'转换为'yyyy/MM/dd'标准时间保存
   * 标准时间转换
   * date('2022-02-10')，将-替换成/，返回Date对象
   * 格式化
   * date('yyyy-MM-dd hh:mm:ss')
   * date('yyyy-MM-dd hh:mm:ss.S')
   * date('yyyyMMddhhmmssS')
   * date('yy-M-d')
   * date('', 3) 当前日期加三天
   * date('', -3) 当前日期减三天
   * @param {string} fmt 缺省yyyy-MM-dd
   * @param {string|object} d
   *  UTC标准时间"2022-02-21T17:43:33.000Z"，或者 "2022-02-21 17:43:33"，
   *  标准时间格式会加8小时时区，普通时间不会加时区。
   *  或者 Date实例，缺省new Date()
   * @returns {string}
   *  fmt为格式，则返回字符串，
   *  fmt为日期，则返回Date实例
   */ $$1.date = function(fmt, d) {
      if (!fmt) fmt = 'yyyy-MM-dd';
      else if (/^\d{4}[-/]\d{1,2}[-/]\d{1,2}/.test(fmt)) {
          //  2022-10-10 => 2022/10/10
          if (/^\d{4}[-]\d{1,2}[-]\d{1,2}$/.test(fmt)) fmt = fmt.replace(/-/g, '/');
          var R = new Date(fmt);
          if (d && $$1.isNumber(d)) // 加减 天数
          R = new Date(R.getTime() + d * 86400000);
          return R;
      }
      if (!d) d = new Date();
      else if (typeof d === 'string') {
          //  2022-10-10 => 2022/10/10
          if (/^\d{4}[-]\d{1,2}[-]\d{1,2}$/.test(d)) d = d.replace(/-/g, '/');
          // 兼容标准时间字符串
          // .replace(/T/g, ' ')
          // .replace(/\.+[0-9]+[A-Z]$/, '');
          // 还原为标准时间，getTimezoneOffset UTC与当地时差分钟数，比如中国是 -480分钟
          // d = new Date(d).getTime() - 60000 * new Date().getTimezoneOffset();
          // Date自动处理时区，ISODate格式不处理时区，本地普通字符串格式-8小时
          d = new Date(d);
      } else if ($$1.isNumber(d)) // 加减 天数
      d = new Date(Date.now() + d * 86400000);
      // Date.getXXX 函数会自动还原时区！！！
      var o = {
          y: d.getFullYear().toString(),
          M: d.getMonth() + 1,
          d: d.getDate(),
          H: d.getHours(),
          h: d.getHours(),
          m: d.getMinutes(),
          s: d.getSeconds(),
          q: Math.floor((d.getMonth() + 3) / 3),
          S: d.getMilliseconds().toString().padStart(3, '0')
      };
      // yy几个就返回 几个数字，使用 slice -4 倒数4个，再往后
      fmt = fmt.replace(/(S+)/g, o.S).replace(/(y+)/gi, function(v) {
          return o.y.slice(-v.length);
      });
      fmt = fmt.replace(/(M+|d+|h+|H+|m+|s+|q+)/g, function(v) {
          return ((v.length > 1 ? '0' : '') + o[v.slice(-1)]).slice(-2);
      });
      return fmt.replace(/\s+00:00:00$/g, '');
  };
  $$1.uniqueNumber = function() {
      uniqueNumber += 1;
      return uniqueNumber;
  };
  $$1.num = $$1.uniqueNumber;
  $$1.uid = function(mask, map) {
      if (mask === void 0) mask = 'xxxxxxxxxx';
      if (map === void 0) map = '0123456789abcdef';
      var length = map.length;
      return mask.replace(/x/g, function() {
          return map[Math.floor(Math.random() * length)];
      });
  };
  $$1.camelCase = function(str) {
      return str.toLowerCase().replace(/-+(.)/g, function(match, chr) {
          return chr ? chr.toUpperCase() : '';
      });
  };
  $$1.uniq = function(array) {
      return filter.call(array, function(item, idx) {
          return array.indexOf(item) === idx;
      });
  };
  // two params promisify
  $$1.promisify = function(f) {
      return function() {
          for(var _len = arguments.length, arg = new Array(_len), _key = 0; _key < _len; _key++){
              arg[_key] = arguments[_key];
          }
          return new Promise(function(res, rej) {
              f.apply(void 0, [].concat(arg, [
                  function(err, rs) {
                      if (err) rej(err);
                      else res(rs);
                  }
              ]));
          });
      };
  };
  // one param promisify
  $$1.promise = function(f) {
      return function() {
          for(var _len = arguments.length, arg = new Array(_len), _key = 0; _key < _len; _key++){
              arg[_key] = arguments[_key];
          }
          return new Promise(function(res, rej) {
              try {
                  f.apply(void 0, [].concat(arg, [
                      function(rs) {
                          res(rs);
                      }
                  ]));
              } catch (ex) {
                  rej(ex.message);
              }
          });
      };
  };
  /**
   * 解析参数，? 后面 # 前面，& 分隔字符串变换成对象
   * @param {string} [url] - 缺省 window.location.href
   * @returns {Object<string, *>}
   */ $$1.urlParam = function(url) {
      /** @type {Object<string, *>} */ var R = {} // 兼容旧系统!
      ;
      try {
          var str = url || window.location.href;
          if (!str) return R;
          var pos = str.indexOf('?');
          if (pos !== -1) {
              str = str.slice(pos + 1);
              pos = str.indexOf('#');
              if (pos !== -1) str = str.slice(0, pos);
              var ps = str.split('&');
              for(var _iterator = _create_for_of_iterator_helper_loose$1(ps), _step; !(_step = _iterator()).done;){
                  str = _step.value;
                  if (!str) continue;
                  pos = str.indexOf('=');
                  var name = str;
                  var val = '';
                  if (pos !== -1) {
                      name = str.slice(0, pos);
                      val = str.slice(pos + 1);
                      if (val === 'undefined') val = undefined;
                      else if (val === 'null') val = null;
                      else val = decodeURIComponent(val);
                  }
                  // if (!R) R = {}
                  R[decodeURIComponent(name)] = val;
              }
          }
      } catch (e) {
          console.error("urlParam exp:" + e.message);
      }
      return R;
  };
  // "true"  => true
  // "false" => false
  // "null"  => null
  // "42"    => 42
  // "42.5"  => 42.5
  // "08"    => "08"
  // JSON    => parse if valid
  // String  => self
  $$1.deserializeValue = function(value) {
      try {
          return value ? value == 'true' || (value == 'false' ? false : value == 'null' ? null : +value + '' == value ? +value : /^[\[\{]/.test(value) ? JSON.parse(value) : value) : value;
      } catch (e) {
          return value;
      }
  };
  $$1.fullScreen = function(el) {
      if (el.requestFullscreen) {
          el.requestFullscreen();
      } else if (el.mozRequestFullScreen) {
          el.mozRequestFullScreen();
      } else if (el.webkitRequestFullscreen) {
          el.webkitRequestFullscreen();
      } else if (el.msRequestFullscreen) {
          el.msRequestFullscreen();
      }
  };
  $$1.exitFullScreen = function() {
      if (document.exitFullScreen) {
          document.exitFullScreen();
      } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
      }
  };
  $$1.isFullScreen = function() {
      return !!(document.fullscreen || document.mozFullScreen || document.webkitIsFullScreen || document.webkitFullScreen || document.msFullScreen);
  };
  $$1.ready = document.ready;
  $$1.fn = D.prototype;
  $$1.Class = D;
  $$1.Dom = D;
  // ssr
  $$1.window = window;
  $$1.document = document;

  /**
   * 基于 $的event 事件模块
   * 与 dom、Core/Event 中的事件不同
   * dom 事件用于 浏览器 内置或自定义事件控制，全局范围
   * Core/Event 类 用于组件事件控制，局部范围
   * 由于整个App有效，因此要求事件名称为 “模块名:函数名:事件名”，避免冲突。
   * 比如在 lazy模块中，通过 $.emit('lazy:src:before', node) 发射事件，
   * 引用该类代码，通过 $.on('lazy:src:before', fn) 获得事件触发回调。
   * 事件的每个回调函数，只能登记一次，事件触发时，函数被调用一次。
   * 避免一个函数多次重复登记，被多次调用。
   * 一个事件，可登记多个不同的函数，每个函数都会被调用。
   *
   * Released on: August 28, 2016
   *
   */ // 一个包中所有引用共享该变量!
  var events = {};
  /**
   * 响应事件函数登记，一个函数，在同一事件下只能登记一次，避免同一事件多次触发相同函数，被误判为多次事件
   * 事件触发时，调用一次
   * @param {*} event
   * @param {*} fn
   */ function on(event, fn) {
      events[event] = events[event] || [];
      if (!events[event].includes(fn)) events[event].push(fn);
      return this;
  }
  /**
   * 只触发一次，触发后删除登记的回调函数
   * 由于需标识执行一次的函数，不对原fn做任何修改，
   * 因此需包装一个新的回调函数，将原函数作为包装函数变量。
   * @param {*} event
   * @param {*} fn
   */ function once(event, fn) {
      var self = this;
      function oncefn() {
          for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
              args[_key] = arguments[_key];
          }
          $.off(event, fn);
          if (oncefn.proxy) {
              delete oncefn.proxy;
          }
          fn.apply(self, args);
      }
      oncefn.proxy = fn;
      $.on(event, oncefn);
      return this;
  }
  /**
   * 删除事件
   * @param event
   * @param handler 缺少删除该事件, 指定处理函数,则只删除指定处理函数
   * @returns {off}
   */ function off(event, fn) {
      if (fn) {
          // 删除所有该函数的事件登记
          events[event].forEach(function(v, k) {
              if (v === fn || v.proxy && v.proxy === fn) {
                  events[event].splice(k, 1);
              }
          });
      } else delete events[event]; // 删除所有该事件回调函数
      return this;
  }
  /**
   * 发射事件
   * @param event
   * @param args
   * @returns {emit}
   */ function emit(event) {
      var _this = this;
      for(var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
          args[_key - 1] = arguments[_key];
      }
      // cache the events, to avoid consequences of mutation
      var cache = events[event] && events[event].slice();
      // only fire handlers if they exist
      if (cache) {
          cache.forEach(function(fn) {
              // set 'this' context, pass args to handlers
              fn.apply(_this, args);
          });
      }
      return this;
  }

  var Event = /*#__PURE__*/Object.freeze({
    __proto__: null,
    emit: emit,
    off: off,
    on: on,
    once: once
  });

  /**
   * 本地存储
   */ /**
   * 离线存储，缺省 30 天
   * @param {*} key
   * @param {*} val
   * @param {*} exp 过期时长，单位分钟，180天 x 24小时 x 60分 = 259200分
   */ function set$2(store, key, val, exp) {
      if (exp === void 0) exp = 525600;
      var v = {
          exp: exp,
          time: Math.trunc(Date.now() / 1000),
          val: val
      };
      if (!key) return;
      store.setItem(key, JSON.stringify(v));
  // console.log({key, v}, 'set');
  }
  function get$4(store, key) {
      var R = '';
      if (!key) return '';
      var v = store.getItem(key);
      // console.log({key, v}, 'get');
      try {
          v = JSON.parse(v);
          if (v) {
              var time = Math.trunc(Date.now() / 1000); // 秒
              if (v.time && v.exp) {
                  var dur = time - v.time;
                  var exp = v.exp * 60;
                  if (dur > exp) {
                      store.removeItem(key);
                      console.info("store.remove(" + key + ") time:" + v.time + " dur:" + dur + " > exp:" + exp);
                  } else if (v.val) R = v.val;
              } else if (v.val) {
                  console.error("store.get(" + key + ") no time and exp");
                  R = v.val;
              }
          }
      } catch (e) {
          console.log("store.get exp:" + e.message);
      }
      return R;
  }
  function remove$2(store, key) {
      store.removeItem(key);
  }
  function clear$2(store) {
      store.clear();
  }
  function check$2(store) {
      for(var i = 0; i < store.length; i++){
          get$4(store.key(i));
      }
  }

  var lst = localStorage;
  /**
   * 离线存储，缺省 180 天
   * @param {*} key
   * @param {*} val
   * @param {*} exp 过期时长，单位分钟，365天 x 24小时 x 60分 = 525_600 分
   */ function set$1(key, val, exp) {
      if (exp === void 0) exp = 525600;
      set$2(lst, key, val, exp);
  }
  function get$3(key) {
      return get$4(lst, key);
  }
  function remove$1(key) {
      remove$2(lst, key);
  }
  function clear$1() {
      clear$2(lst);
  }
  function check$1() {
      check$2(lst);
  }

  var Store = /*#__PURE__*/Object.freeze({
    __proto__: null,
    check: check$1,
    clear: clear$1,
    get: get$3,
    remove: remove$1,
    set: set$1
  });

  /**
   * pc 使用 sessionStorage，其他使用 localStorage
   * @returns
   */ function getStore() {
      return $.device.desktop ? sessionStorage : localStorage;
  }
  /**
   * 离线存储，手机缺省 30 天，pc 1天
   * @param {*} key
   * @param {*} val
   * @param {*} exp 过期时长，单位分钟，30天 x 24小时 x 60分 = 43200分
   */ function set(key, val) {
      var exp = $.device.desktop ? 1440 : 43200;
      set$2(getStore(), key, val, exp);
  }
  function get$2(key) {
      return get$4(getStore(), key);
  }
  function remove(key) {
      remove$2(getStore(), key);
  }
  function clear() {
      clear$2(getStore());
  }
  function check() {
      check$2(getStore());
  }

  var Session = /*#__PURE__*/Object.freeze({
    __proto__: null,
    check: check,
    clear: clear,
    get: get$2,
    remove: remove,
    set: set
  });

  /**
   * 创建xmlHttpRequest,返回xmlHttpRequest实例,根据不同的浏览器做兼容
   */ function _instanceof(left, right) {
      if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
          return !!right[Symbol.hasInstance](left);
      } else {
          return left instanceof right;
      }
  }
  function _type_of$1(obj) {
      "@swc/helpers - typeof";
      return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
  }
  function getXhr() {
      var rs = null;
      if (window.XMLHttpRequest) rs = new XMLHttpRequest();
      else if (window.ActiveXObject) rs = new ActiveXObject('Microsoft.XMLHTTP');
      return rs;
  }
  var parseError = function(xhr) {
      var msg = '';
      var rs = xhr.responseText, responseType = xhr.responseType, status = xhr.status, statusText = xhr.statusText;
      if (rs && responseType === 'text' && /^\s*[{[]/.test(rs)) {
          try {
              msg = JSON.parse(rs);
          } catch (error) {
              msg = rs;
          }
      } else {
          msg = status + " " + statusText;
      }
      var err = new Error(msg);
      err.status = status;
      return err;
  };
  var parseSuccess = function(rs) {
      if (rs && /^\s*[{[]/.test(rs)) {
          try {
              return JSON.parse(rs);
          } catch (ex) {
              console.log('parseSuccess', {
                  exp: ex.message
              });
          }
      }
      return rs;
  };
  /**
   * xmlHttpRequest GET 方法
   * @param url get的URL地址
   * @param data 要get的数据
   * return Promise
   */ function get$1(url, param, header) {
      var pm = new Promise(function(res, rej) {
          var xhr = getXhr();
          xhr.onreadystatechange = function() {
              if (xhr.readyState === 4) {
                  if (xhr.status === 200) {
                      var rs = parseSuccess(xhr.responseText);
                      res(rs);
                  } else rej(parseError(xhr));
              }
          };
          xhr.onerror = function(e) {
              rej(parseError(xhr));
          };
          if (param) {
              if ((typeof patam === "undefined" ? "undefined" : _type_of$1(patam)) === 'object') param = Object.keys(param).map(function(k) {
                  return k + "=" + data[k];
              }).sort().join('&');
              xhr.open('GET', url + "?" + param, true);
          } else xhr.open('GET', url, true);
          // xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
          // xhr.setRequestHeader('Accept-Encoding', 'gzip');
          if (header) Object.keys(header).forEach(function(key) {
              xhr.setRequestHeader(key, header[key]);
          });
          xhr.send(null);
      });
      return pm;
  }
  /**
   * post 方式提交数据
   * @param {*} url
   * @param {*} data Object、FormData 或 String
   * @param {*} header 自定义头
   */ function post(url, data1, header) {
      var pm = new Promise(function(res, rej) {
          var xhr = getXhr();
          xhr.onreadystatechange = function() {
              if (xhr.readyState === 4) {
                  if (xhr.status === 200) {
                      var rs = parseSuccess(xhr.responseText);
                      res(rs);
                  } else rej(parseError(xhr));
              }
          };
          xhr.onerror = function(e) {
              rej(parseError(xhr));
          };
          // 异步 post,回调通知
          xhr.open('POST', url, true);
          var param = data1;
          if (data1 && _instanceof(data1, FormData)) ; else if (data1 && (typeof data1 === "undefined" ? "undefined" : _type_of$1(data1)) === 'object') {
              // param = Object.keys(data).map(k => `${k}=${data[k]}`).sort().join('&');
              param = JSON.stringify(data1);
              xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
          } else xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
          // alert(param);
          if (header) Object.keys(header).forEach(function(key) {
              xhr.setRequestHeader(key, header[key]);
          });
          xhr.send(param);
      });
      return pm;
  }

  var Ajax = /*#__PURE__*/Object.freeze({
    __proto__: null,
    get: get$1,
    post: post
  });

  /********************
  ! ** * 动态模块管理 ** * !
  ***********************/ // The modules object
  /** @type {*} */ function _array_like_to_array(arr, len) {
      if (len == null || len > arr.length) len = arr.length;
      for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
      return arr2;
  }
  function _type_of(obj) {
      "@swc/helpers - typeof";
      return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
  }
  function _unsupported_iterable_to_array(o, minLen) {
      if (!o) return;
      if (typeof o === "string") return _array_like_to_array(o, minLen);
      var n = Object.prototype.toString.call(o).slice(8, -1);
      if (n === "Object" && o.constructor) n = o.constructor.name;
      if (n === "Map" || n === "Set") return Array.from(n);
      if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _array_like_to_array(o, minLen);
  }
  function _create_for_of_iterator_helper_loose(o, allowArrayLike) {
      var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
      if (it) return (it = it.call(o)).next.bind(it);
      if (Array.isArray(o) || (it = _unsupported_iterable_to_array(o)) || allowArrayLike && o && typeof o.length === "number") {
          if (it) o = it;
          var i = 0;
          return function() {
              if (i >= o.length) {
                  return {
                      done: true
                  };
              }
              return {
                  done: false,
                  value: o[i++]
              };
          };
      }
      throw new TypeError("Invalid attempt to iterate non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  var _m = {} // 已下载并缓存的模块，通过add添加，在load时被执行，并返回模块输出部分
  ;
  // The module cache
  /** @type {*} */ var _c = {} // 已执行并缓存的模块，已提供输出接口
  ;
  /**
   * 执行模块代码，返回模块输出部分 (__webpack_require__)
   * 类似 node.js 的 require函数 "./owner/app/src/index.js"
   * @param {*} id 模块id，一般为
   * @returns {*}
   */ function load(id) {
      // Check if module is in cache
      if (_c[id]) {
          return _c[id].exports;
      }
      // Create a new module (and put it into the cache)
      var m = {
          exports: {}
      };
      _c[id] = m;
      // M.m 保存所有模块，需动态加载
      // Execute the module function
      // 执行每个模块的代码
      if (_m[id]) // 执行函数，this指针指向 window
      // 比如 箭头函数内的this
      _m[id](m, m.exports, load);
      else alert("load module [" + id + "] not exist!");
      // Return the exports of the module
      // 返回模块输出部分
      return m.exports;
  }
  /**
   * 对象自有属性 (.o)
   * @param {*} obj
   * @param {*} prop
   * @returns
   */ function ownProp(obj, prop) {
      return Object.prototype.hasOwnProperty.call(obj, prop);
  }
  /**
   * 将模块的输出define到exports对象的get (.d)
   * @param {*} exports
   * @param {*} definition
   */ function addProp(exports, definition) {
      for(var key in definition){
          if (ownProp(definition, key) && !ownProp(exports, key)) {
              Object.defineProperty(exports, key, {
                  enumerable: true,
                  get: definition[key]
              });
          }
      }
  }
  /**
   * 标记为esm模块，define __esModule on exports (.r)
   * @param {*} exports
   */ function setEsm(exports) {
      if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
          Object.defineProperty(exports, Symbol.toStringTag, {
              value: 'Module'
          });
      }
      Object.defineProperty(exports, '__esModule', {
          value: true
      });
  }
  /**
   * create a fake namespace object (.t)
   * 好像不用了
   * mode & 1: value is a module id, require it
   * mode & 2: merge all properties of value into the ns
   * mode & 4: return value when already ns object
   * mode & 8|1: behave like require
   * @param {*} value
   * @param {*} mode
   * @returns
   */ function fakeNs(value, mode) {
      // eslint-disable-line
      if (mode & 1) value = load(value);
      if (mode & 8) // eslint-disable-line
      return value;
      if (mode & 4 && // eslint-disable-line
      (typeof value === "undefined" ? "undefined" : _type_of(value)) === 'object' && value && value.__esModule) return value;
      var ns = Object.create(null);
      setEsm(ns);
      Object.defineProperty(ns, 'default', {
          enumerable: true,
          value: value
      });
      if (mode & 2 && typeof value !== 'string') addProp(ns, value);
      return ns;
  }
  /**
   * getDefaultExport function for compatibility with non-ESM modules
   * (.n)
   * @param {*} module
   * @returns
   */ function getExport(module) {
      var getter = (module == null ? void 0 : module.__esModule) ? function() {
          return module.default;
      } : function() {
          return module;
      };
      addProp(getter, {
          a: getter
      });
      return getter;
  }
  /**
   * 将模块代码作为函数体，加入到模块对象中
   * 支持webpack、wia生产和开发模式生成的打包代码
   * 从安全角度，用户不能覆盖系统模块!!!
    一个简单的类：
    function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
      __webpack_require__.r(__webpack_exports__)
      __webpack_require__.d(__webpack_exports__, {
        default: function() { return T; }
      })

      var _math__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/page/chall/math.js")

      let T = class T {
        add(x, y) {
          return (0,_math__WEBPACK_IMPORTED_MODULE_0__.sub)(x, y);
        }
        constructor(){}
      }
    }

    压缩后的代码：
    function (r,t,a){
      a.r(t),a.d(t,{default:function(){return n}})
      var c=a("./src/page/chall/math.js")
      let n=class{
        add(r,t){return(0,c.sub)(r,t)}
        constructor(){}
      }
    }
   * @param {*} ms - {'"./src/page/chall/ttt.js":"function (r,t,a){}"'}
   */ function add(ms) {
      for(var _iterator = _create_for_of_iterator_helper_loose(Object.keys(ms)), _step; !(_step = _iterator()).done;){
          var k = _step.value;
          if (k !== 'R' && k !== 'M') {
              var code = ms[k];
              // 函数
              var ps = code.match(/^function\s*\(\s*(\w+),?\s*(\w*)\s*,?\s*(\w*)\)\s*\{/);
              if (ps) {
                  var body = code.replace(ps[0], '').replace(/\};?\s*$/, '');
                  var fun = void 0;
                  if (ps[3]) fun = new Function(ps[1], ps[2], ps[3], body);
                  else if (ps[2]) fun = new Function(ps[1], ps[2], body);
                  else if (ps[1]) fun = new Function(ps[1], body);
                  // 覆盖或添加到模块管理器
                  _m[k] = fun;
              }
          }
      }
  }
  /**
   * 动态并发下载资源，涉及依赖，需按次序加载
   * @param {string} cos 资源下载网址
   * @param {string[]} fs 需加载文件数组 ['/wia/wia.js?v=1.0.2', '/mall/page.js?v=ver']
   */ function get(cos, fs) {
      // 获得一个promise数组
      var ps = fs.map(function(f) {
          // f = 'wia/wia.js?v=1.0.18';
          var pos = f.indexOf('?v=');
          var ver = f.slice(pos + 3);
          var key = f.slice(0, pos);
          console.log("get module file:" + key + " ver:" + ver);
          // 本地缓存
          var js = $.store.get(key) || '';
          // 如已经本地缓存，则直接加载
          if (js) {
              console.log("get module local:" + key + " ok!");
              if (!js.R || !js.R.ver || js.R && js.R.ver && js.R.ver !== ver) {
                  $.store.remove(key);
                  console.log("get module local:" + key + " ver:" + js.R.ver + " != " + ver);
                  js = '';
              }
          }
          if (js) return Promise.resolve(js);
          if (cos.endsWith('/')) cos = cos.slice(0, cos.length - 1);
          return $.get(cos + "/" + f).then(function(rs) {
              if (rs) {
                  console.log("get module clound " + (cos + f) + " ok!");
                  $.store.set(key, rs);
                  return rs;
              }
          });
      });
      return Promise.all(ps).then(function(rs) {
          for(var _iterator = _create_for_of_iterator_helper_loose(rs), _step; !(_step = _iterator()).done;){
              var r = _step.value;
              if (r) add(r);
          }
      });
  }
  // expose the modules object (__webpack_modules__)
  // 与webpack编译代码兼容
  load.m = _m;
  // expose the module cache
  load.c = _c;
  load.d = addProp;
  load.r = setEsm;
  load.t = fakeNs;
  load.n = getExport;
  load.o = ownProp;
  load.rv = '1.1.8';
  load.ruid = 'bundler=rspack@1.1.8';

  var Module = /*#__PURE__*/Object.freeze({
    __proto__: null,
    add: add,
    cache: _c,
    get: get,
    load: load,
    module: _m
  });

  var _device;
  var Device = function Device() {
      // 已经运算，直接返回，避免重复运算
      if (_device) return _device;
      var platform = window.navigator.platform;
      var ua = window.navigator.userAgent;
      var device = {
          ios: false,
          android: false,
          androidChrome: false,
          desktop: false,
          iphone: false,
          ipod: false,
          ipad: false,
          edge: false,
          ie: false,
          wx: false,
          firefox: false,
          macos: false,
          windows: false,
          cordova: !!(window.cordova || window.phonegap),
          electron: false,
          capacitor: !!window.Capacitor,
          nwjs: false
      };
      var screenWidth = window.screen.width;
      var screenHeight = window.screen.height;
      var android = ua.match(/(Android);?[\s\/]+([\d.]+)?/); // eslint-disable-line
      var ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
      var ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
      var iphone = !ipad && ua.match(/(iPhone\sOS|iOS|iPhone;\sCPU\sOS)\s([\d_]+)/);
      var ie = ua.indexOf('MSIE ') >= 0 || ua.indexOf('Trident/') >= 0;
      var edge = ua.indexOf('Edge/') >= 0;
      var firefox = ua.indexOf('Gecko/') >= 0 && ua.indexOf('Firefox/') >= 0;
      // windows浏览器模拟，都是Win32
      var windows = platform === 'Win32';
      var electron = ua.toLowerCase().indexOf('electron') >= 0;
      var nwjs = typeof nw !== 'undefined' && typeof process !== 'undefined' && typeof process.versions !== 'undefined' && typeof process.versions.nw !== 'undefined';
      var macos = platform === 'MacIntel';
      // iPadOs 13 fix
      var iPadScreens = [
          '1024x1366',
          '1366x1024',
          '834x1194',
          '1194x834',
          '834x1112',
          '1112x834',
          '768x1024',
          '1024x768',
          '820x1180',
          '1180x820',
          '810x1080',
          '1080x810'
      ];
      if (!ipad && macos && Support.touch && iPadScreens.indexOf(screenWidth + "x" + screenHeight) >= 0) {
          ipad = ua.match(/(Version)\/([\d.]+)/);
          if (!ipad) ipad = [
              0,
              1,
              '13_0_0'
          ];
          macos = false;
      }
      device.ie = ie;
      device.edge = edge;
      device.firefox = firefox;
      // Android
      if (android) {
          device.os = 'android';
          device.osVersion = android[2];
          device.android = true;
          device.androidChrome = ua.toLowerCase().indexOf('chrome') >= 0;
      }
      if (ipad || iphone || ipod) {
          device.os = 'ios';
          device.ios = true;
      }
      // iOS
      if (iphone && !ipod) {
          device.osVersion = iphone[2].replace(/_/g, '.');
          device.iphone = true;
      }
      if (ipad) {
          device.osVersion = ipad[2].replace(/_/g, '.');
          device.ipad = true;
      }
      if (ipod) {
          device.osVersion = ipod[3] ? ipod[3].replace(/_/g, '.') : null;
          device.ipod = true;
      }
      // iOS 8+ changed UA
      if (device.ios && device.osVersion && ua.indexOf('Version/') >= 0) {
          if (device.osVersion.split('.')[0] === '10') {
              device.osVersion = ua.toLowerCase().split('version/')[1].split(' ')[0];
          }
      }
      // Webview
      device.webView = !!((iphone || ipad || ipod) && (ua.match(/.*AppleWebKit(?!.*Safari)/i) || window.navigator.standalone)) || window.matchMedia && window.matchMedia('(display-mode: standalone)').matches;
      device.webview = device.webView;
      device.standalone = device.webView;
      // Desktop
      device.desktop = !(device.ios || device.android) || electron || nwjs;
      if (device.desktop) {
          device.electron = electron;
          device.nwjs = nwjs;
          device.macos = macos;
          device.windows = windows;
          if (device.macos) {
              device.os = 'macos';
          }
          if (device.windows) {
              device.os = 'windows';
          }
      }
      // Pixel Ratio
      device.pixelRatio = window.devicePixelRatio || 1;
      // Color Scheme
      var DARK = '(prefers-color-scheme: dark)';
      var LIGHT = '(prefers-color-scheme: light)';
      device.prefersColorScheme = function prefersColorTheme() {
          var theme;
          if (window.matchMedia && window.matchMedia(LIGHT).matches) {
              theme = 'light';
          }
          if (window.matchMedia && window.matchMedia(DARK).matches) {
              theme = 'dark';
          }
          return theme;
      };
      // weixin
      device.wechat = /MicroMessenger/i.test(ua);
      device.weixin = device.wechat;
      device.wx = device.wechat;
      _device = device;
      // Export object
      return _device;
  }();

  // export $ to window globle
  window.$ === undefined && (window.$ = $$1);
  $$1.device = Device;
  $$1.support = Support;
  // 将 event 模块中的事件方法加载到 $
  Object.keys(Event).forEach(function(k) {
      $$1[k] = Event[k];
  });
  // 将 ajax 模块中的异步方法加载到 $
  Object.keys(Ajax).forEach(function(k) {
      $$1[k] = Ajax[k];
  });
  // 将 store 模块中的方法加载到 $.store
  $$1.store = {};
  Object.keys(Store).forEach(function(k) {
      $$1.store[k] = Store[k];
  });
  // 将 store 模块中的方法加载到 $.store
  $$1.session = {};
  Object.keys(Session).forEach(function(k) {
      $$1.session[k] = Store[k];
  });
  // 将 module 模块中的方法加载到 $.M
  $$1.M = load;
  Object.keys(Module).forEach(function(k) {
      $$1.M[k] = Module[k];
  });

  return $$1;

}));
