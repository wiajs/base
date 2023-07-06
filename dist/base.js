/*!
  * wia base v1.0.1
  * (c) 2022-2023 Sibyl Yu and contributors
  * Released under the MIT License.
*/
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.$ = factory());
})(this, (function () { 'use strict';

  var _support;
  var Support = function Support() {
    if (_support) return _support;
    _support = {
      touch: !!('ontouchstart' in window || window.DocumentTouch && document instanceof window.DocumentTouch),
      pointerEvents: !!window.PointerEvent && 'maxTouchPoints' in window.navigator && window.navigator.maxTouchPoints >= 0,
      observer: function checkObserver() {
        return 'MutationObserver' in window || 'WebkitMutationObserver' in window;
      }(),
      passiveListener: function checkPassiveListener() {
        var supportsPassive = false;
        try {
          var opts = Object.defineProperty({}, 'passive', {
            get: function get() {
              supportsPassive = true;
            }
          });
          window.addEventListener('testPassiveListener', null, opts);
        } catch (e) {}
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

  var emptyArray = [],
    class2type = {},
    filter = emptyArray.filter,
    slice = emptyArray.slice,
    toString = class2type.toString,
    singleTagRE = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
    simpleSelectorRE = /^[\w-]*$/,
    tagExpanderRE = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
    fragmentRE = /^\s*<(\w+|!)[^>]*>/,
    uniqueNumber = 1,
    tempParent = document.createElement('div');
  document.ready = function (cb) {
    if (document.readyState === 'complete' || document.readyState !== 'loading' && !document.documentElement.doScroll) setTimeout(function () {
      cb($$1);
    }, 0);else {
      var handler = function handler() {
        document.removeEventListener('DOMContentLoaded', handler, false);
        window.removeEventListener('load', handler, false);
        cb($$1);
      };
      document.addEventListener('DOMContentLoaded', handler, false);
      window.addEventListener('load', handler, false);
    }
  };
  var D = function () {
    function D(doms, sel, name) {
      var _this = this;
      var len = doms ? doms.length : 0;
      for (var i = 0; i < len; i++) this[i] = doms[i];
      this.dom = doms ? doms[0] : null;
      this.length = len;
      this.selector = sel || '';
      if (len && name) {
        doms.forEach(function (el) {
          var ns = $$1.qus('[name]', el);
          ns && ns.length && ns.forEach(function (n) {
            var $n = $$1(n);
            var nm = $n.attr('name');
            if (!_this[nm] || _this[nm].dom !== n) _this[nm] = $n;
          });
        });
      }
    }
    D.isD = function isD(d) {
      return d instanceof D;
    };
    var _proto = D.prototype;
    _proto.hasClass = function hasClass(name) {
      return emptyArray.some.call(this, function (el) {
        return el.classList.contains(name);
      });
    };
    _proto.addClass = function addClass(className, only) {
      if (typeof className === 'undefined') {
        return this;
      }
      var classes = className.split(' ');
      for (var i = 0; i < classes.length; i += 1) {
        for (var j = 0; j < this.length; j += 1) {
          var n = this[j];
          if (typeof n !== 'undefined' && typeof n.classList !== 'undefined') {
            if (arguments.length === 1) n.classList.add(classes[i]);else if (only) {
              $$1('.' + classes[i], n.parentNode).removeClass(classes[i]);
              n.classList.add(classes[i]);
            }
          }
        }
      }
      return this;
    };
    _proto.removeClass = function removeClass(className) {
      var classes = className.split(' ');
      for (var i = 0; i < classes.length; i += 1) {
        for (var j = 0; j < this.length; j += 1) {
          if (typeof this[j] !== 'undefined' && typeof this[j].classList !== 'undefined') this[j].classList.remove(classes[i]);
        }
      }
      return this;
    };
    _proto.clearClass = function clearClass() {
      var n;
      for (var i = 0; i < this.length; i += 1) {
        if (typeof this[i] !== 'undefined' && typeof this[i].classList !== 'undefined') {
          n = this[i];
          for (var j = 0; j < n.classList.length; j++) n.classList.remove(n.classList.item(j));
        }
      }
      return this;
    };
    _proto.replaceClass = function replaceClass(src, dst) {
      var n;
      for (var i = 0; i < this.length; i += 1) {
        if (typeof this[i] !== 'undefined' && typeof this[i].classList !== 'undefined') {
          n = this[i];
          if (n.contains(src)) n.classList.replace(src, dst);else n.classList.add(dst);
        }
      }
      return this;
    };
    _proto.toggleClass = function toggleClass(className, add) {
      var classes = className.split(' ');
      for (var i = 0; i < classes.length; i += 1) {
        for (var j = 0; j < this.length; j += 1) {
          if (typeof this[j] !== 'undefined' && typeof this[j].classList !== 'undefined') {
            if (arguments.length === 1) this[j].classList.toggle(classes[i]);else add ? this[j].classList.add(classes[i]) : this[j].classList.remove(classes[i]);
          }
        }
      }
      return this;
    };
    return D;
  }();
  function likeArray(obj) {
    var length = !!obj && 'length' in obj && obj.length,
      type = $$1.type(obj);
    return 'function' != type && !$$1.isWindow(obj) && ('array' == type || length === 0 || typeof length == 'number' && length > 0 && length - 1 in obj);
  }
  function compact(array) {
    return filter.call(array, function (item) {
      return item != null;
    });
  }
  function flatten(array) {
    return array.length > 0 ? $$1.fn.concat.apply([], array) : array;
  }
  function fragment(html, name, properties) {
    var R;
    if (singleTagRE.test(html)) R = $$1(document.createElement(RegExp.$1));
    if (!R) {
      if (html.replace) html = html.replace(tagExpanderRE, '<$1></$2>');
      if (name === undefined) name = fragmentRE.test(html) && RegExp.$1;
      var containers = {
        tr: 'tbody',
        tbody: 'table',
        thead: 'table',
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
      R = $$1.each(slice.call(container.childNodes), function () {
        container.removeChild(this);
      });
    }
    if ($$1.isPlainObject(properties)) {
      var nodes = $$1(R);
      var methodAttributes = ['val', 'css', 'html', 'text', 'data', 'width', 'height', 'offset'];
      $$1.each(properties, function (key, value) {
        if (methodAttributes.indexOf(key) > -1) nodes[key](value);else nodes.attr(key, value);
      });
    }
    return R;
  }
  function $$1(sel, ctx, name) {
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
        } else if (sel[0] === '<' && fragmentRE.test(sel)) R = fragment(sel, RegExp.$1, ctx), sel = null;else if (ctx) return $$1(ctx).find(sel);else R = $$1.qsa(sel);
      } else if (sel.nodeType || sel === window || sel === document) {
        R = [sel];
        sel = null;
      } else if (D.isD(sel)) return sel;else if ($$1.isFunction(sel)) return document.ready(sel);else if ($$1.isObject(sel) && sel.target && (sel.target.nodeType || sel.target === window || sel.target === document)) {
        R = [sel.target];
        sel = null;
      } else {
        if ($$1.isArray(sel)) R = compact(sel);else if (fragmentRE.test(sel)) R = fragment(sel, RegExp.$1, ctx), sel = null;else if (ctx) return $$1(ctx).find(sel);else R = $$1.qsa(sel);
      }
    }
    return new D(R, sel, name);
  }
  $$1.uuid = 0;
  $$1.expr = {};
  $$1.noop = function () {};
  $$1.support = Support;
  $$1.fragment = fragment;
  var ObjToString = Object.prototype.toString;
  function getTag(value) {
    if (value == null) {
      return value === undefined ? '[object Undefined]' : '[object Null]';
    }
    return ObjToString.call(value);
  }
  $$1.type = function (obj) {
    return obj == null ? String(obj) : class2type[toString.call(obj)] || 'object';
  };
  $$1.isWindow = function (o) {
    return o != null && o == o.window;
  };
  $$1.isObject = function (o) {
    return $$1.type(o) === 'object';
  };
  $$1.isObj = $$1.isObject;
  $$1.isValue = function (o) {
    return $$1.type(o) === 'string' || $$1.type(o) === 'number' || $$1.type(o) === 'boolean';
  };
  $$1.isVal = $$1.isValue;
  $$1.isFunction = function (value) {
    return $$1.type(value) === 'function';
  };
  $$1.isFun = $$1.isFunction;
  $$1.isDocument = function (o) {
    return o != null && o.nodeType == o.DOCUMENT_NODE;
  };
  $$1.isDoc = $$1.isDocument;
  $$1.isPlainObject = function (o) {
    return $$1.isObject(o) && !$$1.isWindow(o) && Object.getPrototypeOf(o) == Object.prototype;
  };
  $$1.isPlain = $$1.isPlainObject;
  $$1.isEmptyObject = function (o) {
    var name;
    for (name in o) return false;
    return true;
  };
  $$1.isEmpty = function (o) {
    if ($$1.isObject(o)) return $$1.isEmptyObject(o);else if ($$1.isArray(o)) return o.length === 0;else return o === '' || o === null || o === undefined;
  };
  $$1.isNull = function (v) {
    return v == null;
  };
  $$1.isBool = function (v) {
    return $$1.type(o) === 'boolean';
  };
  $$1.hasVal = function (o) {
    return !$$1.isEmpty(o);
  };
  $$1.isArray = Array.isArray || function (object) {
    return object instanceof Array;
  };
  $$1.inArray = function (elem, array, i) {
    return emptyArray.indexOf.call(array, elem, i);
  };
  $$1.isNumeric = function (val) {
    return typeof val === 'number' || $$1.isObject(val) && getTag(val) == '[object Number]';
  };
  $$1.isNumber = $$1.isNumeric;
  $$1.isNum = $$1.isNumeric;
  $$1.isString = function (o) {
    return $$1.type(o) === 'string';
  };
  $$1.isStr = $$1.isString;
  $$1.isDom = function (v) {
    return D.isD(v);
  };
  $$1.isDate = function (v) {
    return $$1.type(o) === 'date';
  };
  $$1.isDateStr = function (v) {
    return Date.parse(v) > 0;
  };
  $$1.isNumStr = function (v) {
    return !Number.isNaN(Number(v));
  };
  $$1.funcArg = function (context, arg, idx, payload) {
    return $$1.isFunction(arg) ? arg.call(context, idx, payload) : arg;
  };
  $$1.contains = document.documentElement.contains ? function (parent, node) {
    return parent !== node && parent.contains(node);
  } : function (parent, node) {
    while (node && (node = node.parentNode)) if (node === parent) return true;
    return false;
  };
  $$1.matches = function (el, sel) {
    var R = false;
    try {
      if (!sel || !el) return false;
      if (sel === document) R = el === document;else if (sel === window) R = el === window;else if (sel.nodeType) R = el === sel;else if (sel instanceof D) R = ~sel.indexOf(el);else if (el.nodeType === 1 && typeof sel === 'string') {
        var match = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.oMatchesSelector || el.matchesSelector;
        if (match) R = match.call(el, sel);else {
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
  $$1.trim = function (str) {
    return str == null ? '' : String.prototype.trim.call(str);
  };
  $$1.map = function (els, cb) {
    var R = [];
    if (likeArray(els)) for (var i = 0; i < els.length; i++) {
      try {
        var v = cb(els[i], i);
        if (v != null) R.push(v);
      } catch (e) {
        console.log('map exp:', e.message);
      }
    } else {
      els.keys.forEach(function (k) {
        try {
          var _v = cb(els[k], k);
          if (_v != null) R.push(_v);
        } catch (e) {
          console.log('map exp:', e.message);
        }
      });
    }
    return flatten(R);
  };
  $$1.each = function (els, cb) {
    var i, key;
    if (likeArray(els)) {
      for (i = 0; i < els.length; i++) if (cb.call(els[i], i, els[i]) === false) return els;
    } else {
      for (key in els) if (cb.call(els[key], key, els[key]) === false) return els;
    }
    return els;
  };
  $$1.forEach = function (els, cb) {
    var i, key;
    if (likeArray(els)) {
      for (i = 0; i < els.length; i++) if (cb.call(els[i], els[i], i) === false) return els;
    } else {
      for (key in els) if (cb.call(els[key], els[key], key) === false) return els;
    }
    return els;
  };
  $$1.grep = function (els, cb) {
    return filter.call(els, cb);
  };
  $$1.each('Boolean Number String Function Array Date RegExp Object Error'.split(' '), function (i, name) {
    class2type['[object ' + name + ']'] = name.toLowerCase();
  });
  $$1.id = function (x) {
    return document.getElementById(x);
  };
  $$1.qu = $$1.qs = function (sel, ctx) {
    var R = null;
    try {
      var el = ctx;
      if (!ctx) el = document;else if (D.isD(ctx)) el = ctx[0];
      var maybeID = sel[0] == '#',
        nameOnly = maybeID ? sel.slice(1) : sel,
        isSimple = simpleSelectorRE.test(nameOnly);
      if (document.getElementById && isSimple && maybeID) R = document.getElementById(nameOnly);else R = el.querySelector(sel);
    } catch (e) {
      console.error('$.qu/qs exp:', e.message);
    }
    return R;
  };
  $$1.qus = $$1.qsa = function (sel, ctx) {
    var R = [];
    try {
      var el = ctx;
      if (!ctx) el = document;else if (D.isD(ctx)) el = ctx[0];
      var found,
        maybeID = sel[0] == '#',
        maybeClass = !maybeID && sel[0] == '.',
        nameOnly = maybeID || maybeClass ? sel.slice(1) : sel,
        isSimple = simpleSelectorRE.test(nameOnly);
      if (document.getElementById && isSimple && maybeID) R = (found = document.getElementById(nameOnly)) ? [found] : [];else if (el.nodeType === 1 || el.nodeType === 9 || el.nodeType === 11) {
        try {
          var ns = isSimple && !maybeID && el.getElementsByClassName ? maybeClass ? el.getElementsByClassName(nameOnly) : el.getElementsByTagName(sel) : el.querySelectorAll(sel);
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
  $$1.qn = function qn(name, ctx) {
    var sel = "[name=\"" + name + "\"]";
    return $$1.qu(sel, ctx);
  };
  $$1.qns = function (name, ctx) {
    var R = null;
    if (ctx) R = $$1.qus("[name=\"" + name + "\"]", ctx);else {
      R = document.getElementsByName(name);
      if (R && R.length > 0) R = slice.call(R);else R = [];
    }
    return R;
  };
  $$1.qcs = function (sel, ctx) {
    var R = null;
    if (ctx) R = D.isD(ctx) ? ctx[0].getElementsByClassName(sel) : ctx.getElementsByClassName(sel);else R = document.getElementsByClassName(sel);
    if (R && R.length > 0) return slice.call(R);else return [];
  };
  $$1.qts = function (sel, ctx) {
    var R = null;
    if (ctx) R = D.isD(ctx) ? ctx[0].getElementsByTagName(sel) : ctx.getElementsByTagName(sel);else R = document.getElementsByTagName(sel);
    if (R && R.length > 0) return slice.call(R);else return [];
  };
  function assign(to, src, deep) {
    if (src !== undefined && src !== null) {
      var ks = Object.keys(Object(src));
      for (var i = 0, len = ks.length; i < len; i += 1) {
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
  $$1.assign = function (to) {
    if (!to) return {};
    var deep;
    for (var _len = arguments.length, srcs = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      srcs[_key - 1] = arguments[_key];
    }
    if (typeof to === 'boolean') {
      deep = to;
      to = srcs.shift();
    }
    srcs.forEach(function (src) {
      assign(to, src, deep);
    });
    return to;
  };
  $$1.extend = $$1.assign;
  $$1.merge = function () {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }
    var to = args[0];
    args.splice(0, 1);
    args.forEach(function (src) {
      assign(to, src, false);
    });
    return to;
  };
  $$1.fastLink = function (ctx) {
    try {
      var links = $$1.qus('a.fastLink, a.fastlink', ctx);
      links.forEach(function (link) {
        if ($$1.support.touch) {
          var startX;
          var startY;
          link.ontouchstart = function (ev) {
            startX = ev.changedTouches[0].clientX;
            startY = ev.changedTouches[0].clientY;
          };
          link.ontouchend = function (ev) {
            if (Math.abs(ev.changedTouches[0].clientX - startX) <= 5 && Math.abs(ev.changedTouches[0].clientY - startY) <= 5) {
              if (link.hasAttribute('back') || link.hasClass('back')) return window.history.back();
              if (link.href) window.location.href = link.href;
            }
          };
        } else if (link.hasAttribute('back') || link.hasClass('back')) {
          link.onclick = function (ev) {
            return window.history.back();
          };
        }
      });
    } catch (e) {
      alert("fastLink exp: " + e.message);
    }
  };
  $$1.requestAnimationFrame = function (callback) {
    if (window.requestAnimationFrame) return window.requestAnimationFrame(callback);else if (window.webkitRequestAnimationFrame) return window.webkitRequestAnimationFrame(callback);
    return window.setTimeout(callback, 1000 / 60);
  };
  $$1.cancelAnimationFrame = function (id) {
    if (window.cancelAnimationFrame) return window.cancelAnimationFrame(id);else if (window.webkitCancelAnimationFrame) return window.webkitCancelAnimationFrame(id);
    return window.clearTimeout(id);
  };
  $$1.deleteProps = function (obj) {
    var object = obj;
    Object.keys(object).forEach(function (key) {
      try {
        object[key] = null;
      } catch (e) {}
      try {
        delete object[key];
      } catch (e) {}
    });
  };
  $$1.nextTick = function (cb, delay) {
    if (delay === void 0) {
      delay = 0;
    }
    return setTimeout(cb, delay);
  };
  $$1.nextFrame = function (cb) {
    return $$1.requestAnimationFrame(function () {
      $$1.requestAnimationFrame(cb);
    });
  };
  $$1.now = function () {
    return Date.now();
  };
  $$1.exp = function (info, e) {
    console.error(info + " exp:" + e.message);
  };
  $$1.date = function (fmt, d) {
    if (!fmt) fmt = 'yyyy-MM-dd';else if (/^\d{4}[-/]\d{1,2}[-/]\d{1,2}/.test(fmt)) {
      if (/^\d{4}[-]\d{1,2}[-]\d{1,2}$/.test(fmt)) fmt = fmt.replace(/-/g, '/');
      var R = new Date(fmt);
      if (d && $$1.isNumber(d)) R = new Date(R.getTime() + d * 86400000);
      return R;
    }
    if (!d) d = new Date();else if (typeof d === 'string') {
      if (/^\d{4}[-]\d{1,2}[-]\d{1,2}$/.test(d)) d = d.replace(/-/g, '/');
      d = new Date(d);
    } else if ($$1.isNumber(d)) d = new Date(Date.now() + d * 86400000);
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
    fmt = fmt.replace(/(S+)/g, o.S).replace(/(y+)/gi, function (v) {
      return o.y.slice(-v.length);
    });
    fmt = fmt.replace(/(M+|d+|h+|H+|m+|s+|q+)/g, function (v) {
      return ((v.length > 1 ? '0' : '') + o[v.slice(-1)]).slice(-2);
    });
    return fmt.replace(/\s+00:00:00$/g, '');
  };
  $$1.uniqueNumber = function () {
    uniqueNumber += 1;
    return uniqueNumber;
  };
  $$1.num = $$1.uniqueNumber;
  $$1.uid = function (mask, map) {
    if (mask === void 0) {
      mask = 'xxxxxxxxxx';
    }
    if (map === void 0) {
      map = '0123456789abcdef';
    }
    var _map = map,
      length = _map.length;
    return mask.replace(/x/g, function () {
      return map[Math.floor(Math.random() * length)];
    });
  };
  $$1.camelCase = function (str) {
    return str.toLowerCase().replace(/-+(.)/g, function (match, chr) {
      return chr ? chr.toUpperCase() : '';
    });
  };
  $$1.uniq = function (array) {
    return filter.call(array, function (item, idx) {
      return array.indexOf(item) === idx;
    });
  };
  $$1.promisify = function (f) {
    return function () {
      for (var _len3 = arguments.length, arg = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        arg[_key3] = arguments[_key3];
      }
      return new Promise(function (res, rej) {
        f.apply(void 0, arg.concat([function (err, rs) {
          if (err) rej(err);else res(rs);
        }]));
      });
    };
  };
  $$1.promise = function (f) {
    return function () {
      for (var _len4 = arguments.length, arg = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        arg[_key4] = arguments[_key4];
      }
      return new Promise(function (res, rej) {
        try {
          f.apply(void 0, arg.concat([function (rs) {
            res(rs);
          }]));
        } catch (ex) {
          rej(ex.message);
        }
      });
    };
  };
  $$1.urlParam = function (url) {
    var query = {};
    var urlToParse = url || window.location.href;
    var i;
    var params;
    var param;
    var length;
    if (typeof urlToParse === 'string' && urlToParse.length) {
      urlToParse = urlToParse.indexOf('?') > -1 ? urlToParse.replace(/\S*\?/, '') : '';
      params = urlToParse.split('&').filter(function (paramsPart) {
        return paramsPart !== '';
      });
      length = params.length;
      for (i = 0; i < length; i += 1) {
        param = params[i].replace(/#\S+/g, '').split('=');
        query[decodeURIComponent(param[0])] = typeof param[1] === 'undefined' ? undefined : decodeURIComponent(param.slice(1).join('=')) || '';
      }
    }
    return query;
  };
  $$1.deserializeValue = function (value) {
    try {
      return value ? value == 'true' || (value == 'false' ? false : value == 'null' ? null : +value + '' == value ? +value : /^[\[\{]/.test(value) ? JSON.parse(value) : value) : value;
    } catch (e) {
      return value;
    }
  };
  $$1.fullScreen = function (el) {
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
  $$1.exitFullScreen = function () {
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
  $$1.isFullScreen = function () {
    return !!(document.fullscreen || document.mozFullScreen || document.webkitIsFullScreen || document.webkitFullScreen || document.msFullScreen);
  };
  $$1.ready = document.ready;
  $$1.fn = D.prototype;
  $$1.Class = D;
  $$1.Dom = D;
  $$1.window = window;
  $$1.document = document;

  var events = {};
  function on(event, fn) {
    events[event] = events[event] || [];
    if (!events[event].includes(fn)) events[event].push(fn);
    return this;
  }
  function once(event, fn) {
    var self = this;
    function oncefn() {
      $.off(event, fn);
      if (oncefn.proxy) {
        delete oncefn.proxy;
      }
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      fn.apply(self, args);
    }
    oncefn.proxy = fn;
    $.on(event, oncefn);
    return this;
  }
  function off(event, fn) {
    if (fn) {
      events[event].forEach(function (v, k) {
        if (v === fn || v.proxy && v.proxy === fn) {
          events[event].splice(k, 1);
        }
      });
    } else delete events[event];
    return this;
  }
  function emit(event) {
    var _this = this;
    for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }
    var cache = events[event] && events[event].slice();
    if (cache) {
      cache.forEach(function (fn) {
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

  function set$2(store, key, val, exp) {
    if (exp === void 0) {
      exp = 43200;
    }
    var v = {
      exp: exp,
      time: Math.trunc(Date.now() / 1000),
      val: val
    };
    if (!key) return;
    store.setItem(key, JSON.stringify(v));
  }
  function get$4(store, key) {
    var R = '';
    if (!key) return '';
    var v = store.getItem(key);
    try {
      v = JSON.parse(v);
      if (v) {
        var time = Math.trunc(Date.now() / 1000);
        if (v.time && v.exp) {
          var dur = time - v.time;
          if (dur > v.exp * 60) {
            store.removeItem(key);
            console.info("store.get(" + key + ") dur:" + dur + " > exp:" + v.exp * 60);
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
    for (var i = 0; i < store.length; i++) {
      get$4(store.key(i));
    }
  }

  var lst = localStorage;
  function set$1(key, val, exp) {
    set$2(lst, key, val);
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

  function getStore() {
    return $.device.desktop ? sessionStorage : localStorage;
  }
  function set(key, val) {
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

  function getXhr() {
    var rs = null;
    if (window.XMLHttpRequest) rs = new XMLHttpRequest();else if (window.ActiveXObject) rs = new ActiveXObject('Microsoft.XMLHTTP');
    return rs;
  }
  var parseError = function parseError(xhr) {
    var msg = '';
    var rs = xhr.responseText,
      responseType = xhr.responseType,
      status = xhr.status,
      statusText = xhr.statusText;
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
  var parseSuccess = function parseSuccess(rs) {
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
  function get$1(url, param, header) {
    var pm = new Promise(function (res, rej) {
      var xhr = getXhr();
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            var rs = parseSuccess(xhr.responseText);
            res(rs);
          } else rej(parseError(xhr));
        }
      };
      xhr.onerror = function (e) {
        rej(parseError(xhr));
      };
      if (param) {
        if (typeof patam === 'object') param = Object.keys(param).map(function (k) {
          return k + "=" + data[k];
        }).sort().join('&');
        xhr.open('GET', url + "?" + param, true);
      } else xhr.open('GET', url, true);
      if (header) Object.keys(header).forEach(function (key) {
        xhr.setRequestHeader(key, header[key]);
      });
      xhr.send(null);
    });
    return pm;
  }
  function post(url, data, header) {
    var pm = new Promise(function (res, rej) {
      var xhr = getXhr();
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            var rs = parseSuccess(xhr.responseText);
            res(rs);
          } else rej(parseError(xhr));
        }
      };
      xhr.onerror = function (e) {
        rej(parseError(xhr));
      };
      xhr.open('POST', url, true);
      var param = data;
      if (data && data instanceof FormData) ; else if (data && typeof data === 'object') {
        param = JSON.stringify(data);
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
      } else xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      if (header) Object.keys(header).forEach(function (key) {
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

  var _m = {};
  var _c = {};
  function load(id) {
    if (_c[id]) {
      return _c[id].exports;
    }
    var m = {
      exports: {}
    };
    _c[id] = m;
    if (_m[id]) _m[id](m, m.exports, load);else alert("load module [" + id + "] not exist!");
    return m.exports;
  }
  function ownProp(object, property) {
    return Object.prototype.hasOwnProperty.call(object, property);
  }
  function addProp(exports, name, getter) {
    if (!ownProp(exports, name)) {
      Object.defineProperty(exports, name, {
        enumerable: true,
        get: getter
      });
    }
  }
  function setEsm(exports) {
    if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
      Object.defineProperty(exports, Symbol.toStringTag, {
        value: 'Module'
      });
    }
    Object.defineProperty(exports, '__esModule', {
      value: true
    });
  }
  function fakeNs(value, mode) {
    if (mode & 1) value = load(value);
    if (mode & 8) return value;
    if (mode & 4 && typeof value === 'object' && value && value.__esModule) return value;
    var ns = Object.create(null);
    setEsm(ns);
    Object.defineProperty(ns, 'default', {
      enumerable: true,
      value: value
    });
    if (mode & 2 && typeof value !== 'string') for (var key in value) addProp(ns, key, function (key) {
        return value[key];
      }.bind(null, key));
    return ns;
  }
  function getExport(module) {
    function getDefault() {
      return module["default"];
    }
    function getModuleExports() {
      return module;
    }
    var getter = module && module.__esModule ? getDefault : getModuleExports;
    addProp(getter, 'a', getter);
    return getter;
  }
  function add(ms) {
    Object.keys(ms).forEach(function (k) {
      if (k !== 'R' && k !== 'M') {
        var r = ms[k];
        var ps = r.match(/^function\s*\(\s*(\w+),?\s*(\w*)\s*,?\s*(\w*)\)\s*\{\s*(eval)\s*\(/);
        if (ps && ps[2] === '') {
          if (ps[4]) {
            var rg = new RegExp("^function\\s*\\(\\s*" + ps[1] + "\\s*\\)\\s*\\{\\s*eval\\s*\\(\\s*[\"']");
            r = r.replace(rg, '');
            r = r.substring(0, r.lastIndexOf('");'));
            r = JSON.parse("{\"m\":\"" + r + "\"}").m;
          } else {
            var _rg = new RegExp("^function\\s*\\(\\s*" + ps[1] + "\\s*\\)\\s*\\{");
            r = r.replace(_rg, '');
            r = r.substring(0, r.lastIndexOf('}'));
          }
          r = new Function(ps[1], r);
        } else if (ps && ps[3] === '') {
          if (ps[4]) {
            var _rg2 = new RegExp("^function\\s*\\(\\s*" + ps[1] + ",\\s*" + ps[2] + "\\s*\\)\\s*\\{\\s*eval\\s*\\(\\s*[\"']");
            r = r.replace(_rg2, '');
            r = r.substring(0, r.lastIndexOf('");'));
            r = JSON.parse("{\"m\":\"" + r + "\"}").m;
          } else {
            var _rg3 = new RegExp("^function\\s*\\(\\s*" + ps[1] + ",\\s*" + ps[2] + "\\s*\\)\\s*\\{");
            r = r.replace(_rg3, '');
            r = r.substring(0, r.lastIndexOf('}'));
          }
          r = new Function(ps[1], ps[2], r);
        } else if (ps && ps[3] !== '') {
          if (ps[4]) {
            var _rg4 = new RegExp("^function\\s*\\(\\s*" + ps[1] + ",\\s*" + ps[2] + ",\\s*" + ps[3] + "\\s*\\)\\s*\\{\\s*eval\\s*\\(\\s*[\"']");
            r = r.replace(_rg4, '');
            r = r.substring(0, r.lastIndexOf('");'));
            r = JSON.parse("{\"m\":\"" + r + "\"}").m;
          } else {
            var _rg5 = new RegExp("^function\\s*\\(\\s*" + ps[1] + ",\\s*" + ps[2] + ",\\s*" + ps[3] + "\\s*\\)\\s*\\{");
            r = r.replace(_rg5, '');
            r = r.substring(0, r.lastIndexOf('}'));
          }
          r = new Function(ps[1], ps[2], ps[3], r);
        }
        _m[k] = r;
      }
    });
  }
  function get(cos, fs) {
    var ps = fs.map(function (f) {
      var pos = f.indexOf('?v=');
      var ver = f.substr(pos + 3);
      var key = "" + f.substr(0, pos);
      console.log("get module key:" + key + " ver:" + ver);
      var js = $.store.get(key) || '';
      if (js) {
        console.log("get module local key:" + key + " ok!");
        if (!js.R || !js.R.ver || js.R && js.R.ver && js.R.ver !== ver) {
          $.store.remove(key);
          console.log("get module local key:" + key + " ver:" + js.R.ver + " != " + ver);
          js = '';
        }
      }
      if (js) return Promise.resolve(js);
      if (cos.endsWith('/')) cos = cos.substr(0, cos.length - 1);
      return $.get(cos + "/" + f).then(function (rs) {
        if (rs) {
          console.log("get module clound " + (cos + f) + " ok!");
          $.store.set(key, rs);
          return rs;
        }
      });
    });
    return Promise.all(ps).then(function (rs) {
      rs.forEach(function (r) {
        if (r) add(r);
      });
    });
  }
  load.m = _m;
  load.c = _c;
  load.d = addProp;
  load.r = setEsm;
  load.t = fakeNs;
  load.n = getExport;
  load.o = ownProp;

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
    var android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
    var ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
    var ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
    var iphone = !ipad && ua.match(/(iPhone\sOS|iOS|iPhone;\sCPU\sOS)\s([\d_]+)/);
    var ie = ua.indexOf('MSIE ') >= 0 || ua.indexOf('Trident/') >= 0;
    var edge = ua.indexOf('Edge/') >= 0;
    var firefox = ua.indexOf('Gecko/') >= 0 && ua.indexOf('Firefox/') >= 0;
    var windows = platform === 'Win32';
    var electron = ua.toLowerCase().indexOf('electron') >= 0;
    var nwjs = typeof nw !== 'undefined' && typeof process !== 'undefined' && typeof process.versions !== 'undefined' && typeof process.versions.nw !== 'undefined';
    var macos = platform === 'MacIntel';
    var iPadScreens = ['1024x1366', '1366x1024', '834x1194', '1194x834', '834x1112', '1112x834', '768x1024', '1024x768', '820x1180', '1180x820', '810x1080', '1080x810'];
    if (!ipad && macos && Support.touch && iPadScreens.indexOf(screenWidth + "x" + screenHeight) >= 0) {
      ipad = ua.match(/(Version)\/([\d.]+)/);
      if (!ipad) ipad = [0, 1, '13_0_0'];
      macos = false;
    }
    device.ie = ie;
    device.edge = edge;
    device.firefox = firefox;
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
    if (device.ios && device.osVersion && ua.indexOf('Version/') >= 0) {
      if (device.osVersion.split('.')[0] === '10') {
        device.osVersion = ua.toLowerCase().split('version/')[1].split(' ')[0];
      }
    }
    device.webView = !!((iphone || ipad || ipod) && (ua.match(/.*AppleWebKit(?!.*Safari)/i) || window.navigator.standalone)) || window.matchMedia && window.matchMedia('(display-mode: standalone)').matches;
    device.webview = device.webView;
    device.standalone = device.webView;
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
    device.pixelRatio = window.devicePixelRatio || 1;
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
    device.wechat = /MicroMessenger/i.test(ua);
    device.weixin = device.wechat;
    device.wx = device.wechat;
    _device = device;
    return _device;
  }();

  window.$ === undefined && (window.$ = $$1);
  $$1.device = Device;
  $$1.support = Support;
  Object.keys(Event).forEach(function (k) {
    $$1[k] = Event[k];
  });
  Object.keys(Ajax).forEach(function (k) {
    $$1[k] = Ajax[k];
  });
  $$1.store = {};
  Object.keys(Store).forEach(function (k) {
    $$1.store[k] = Store[k];
  });
  $$1.session = {};
  Object.keys(Session).forEach(function (k) {
    $$1.session[k] = Store[k];
  });
  $$1.M = load;
  Object.keys(Module).forEach(function (k) {
    $$1.M[k] = Module[k];
  });

  return $$1;

}));
