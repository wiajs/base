/********************
! ** * 动态模块管理 ** * !
***********************/

// The modules object
/** @type {*} */
const _m = {} // 已下载并缓存的模块，通过add添加，在load时被执行，并返回模块输出部分

// The module cache
/** @type {*} */
const _c = {} // 已执行并缓存的模块，已提供输出接口

/**
 * 执行模块代码，返回模块输出部分 (__webpack_require__)
 * 类似 node.js 的 require函数 "./owner/app/src/index.js"
 * @param {*} id 模块id，一般为
 * @returns {*}
 */
function load(id) {
  // Check if module is in cache
  if (_c[id]) {
    return _c[id].exports
  }

  // Create a new module (and put it into the cache)
  const m = {
    exports: {},
  }
  _c[id] = m

  // M.m 保存所有模块，需动态加载
  // Execute the module function
  // 执行每个模块的代码
  if (_m[id])
    // 执行函数，this指针指向 window
    // 比如 箭头函数内的this
    _m[id](m, m.exports, load)
  else alert(`load module [${id}] not exist!`)

  // Return the exports of the module
  // 返回模块输出部分
  return m.exports
}

/**
 * 对象自有属性 (.o)
 * @param {*} obj
 * @param {*} prop
 * @returns
 */
function ownProp(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop)
}

/**
 * 将模块的输出define到exports对象的get (.d)
 * @param {*} exports
 * @param {*} definition
 */
function addProp(exports, definition) {
  for (const key in definition) {
    if (ownProp(definition, key) && !ownProp(exports, key)) {
      Object.defineProperty(exports, key, {enumerable: true, get: definition[key]})
    }
  }
}

/**
 * 标记为esm模块，define __esModule on exports (.r)
 * @param {*} exports
 */
function setEsm(exports) {
  if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
    Object.defineProperty(exports, Symbol.toStringTag, {value: 'Module'})
  }
  Object.defineProperty(exports, '__esModule', {value: true})
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
 */
function fakeNs(value, mode) {
  // eslint-disable-line
  if (mode & 1) value = load(value)

  if (mode & 8)
    // eslint-disable-line
    return value

  if (
    mode & 4 && // eslint-disable-line
    typeof value === 'object' &&
    value &&
    value.__esModule
  )
    return value

  const ns = Object.create(null)
  setEsm(ns)

  Object.defineProperty(ns, 'default', {
    enumerable: true,
    value,
  })

  if (mode & 2 && typeof value !== 'string') addProp(ns, value)

  return ns
}

/**
 * getDefaultExport function for compatibility with non-ESM modules
 * (.n)
 * @param {*} module
 * @returns
 */
function getExport(module) {
  const getter = module?.__esModule ? () => module.default : () => module

  addProp(getter, {a: getter})

  return getter
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
 */
function add(ms) {
  for (const k of Object.keys(ms)) {
    if (k !== 'R' && k !== 'M') { // && !_m[k] 是否覆盖？
      const code = ms[k]
      // 函数
      const ps = code.match(/^function\s*\(\s*(\w+),?\s*(\w*)\s*,?\s*(\w*)\)\s*\{/)
      if (ps) {
        const body = code.replace(ps[0], '').replace(/\};?\s*$/, '')
        let fun
        if (ps[3]) fun = new Function(ps[1], ps[2], ps[3], body)
        else if (ps[2]) fun = new Function(ps[1], ps[2], body)
        else if (ps[1]) fun = new Function(ps[1], body)
        // 覆盖或添加到模块管理器
        _m[k] = fun
      }
    }
  }
}

/**
 * 应用切换时，需清理缓存的 cache 和 模块
 * 从安全角度，用户不能覆盖系统模块!!!
 */
function clear() {}

/**
 * 动态并发下载资源，涉及依赖，需按次序加载
 * @param {string} cos 资源下载网址
 * @param {string[]} fs 需加载文件数组 ['/wia/wia.js?v=1.0.2', '/mall/page.js?v=ver']
 */
function get(cos, fs) {
  // 获得一个promise数组
  const ps = fs.map(f => {
    // f = 'wia/wia.js?v=1.0.18';
    const pos = f.indexOf('?v=')
    const ver = f.slice(pos + 3)
    const key = f.slice(0, pos)
    console.log(`get module file:${key} ver:${ver}`)

    // 本地缓存
    let js = $.store.get(key) || ''
    // 如已经本地缓存，则直接加载
    if (js) {
      console.log(`get module local:${key} ok!`)
      if (!js.R || !js.R.ver || (js.R && js.R.ver && js.R.ver !== ver)) {
        $.store.remove(key)
        console.log(`get module local:${key} ver:${js.R.ver} != ${ver}`)
        js = ''
      }
    }

    if (js) return Promise.resolve(js)

    if (cos.endsWith('/')) cos = cos.slice(0, cos.length - 1)
    return $.get(`${cos}/${f}`).then(rs => {
      if (rs) {
        console.log(`get module clound ${cos + f} ok!`)
        $.store.set(key, rs)
        return rs
      }
    })
  })

  return Promise.all(ps).then(rs => {
    for (const r of rs) {
      if (r) add(r)
    }
  })
}

// expose the modules object (__webpack_modules__)
// 与webpack编译代码兼容

load.m = _m
// expose the module cache
load.c = _c
load.d = addProp
load.r = setEsm
load.t = fakeNs
load.n = getExport
load.o = ownProp
load.rv = '1.1.8'
load.ruid = 'bundler=rspack@1.1.8'

// 对外输出，可通过 $.M 访问，$.M 本身就是 load，$.M === $.M.load
export {_c as cache, _m as module, load, add, get}
