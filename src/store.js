/**
 * 本地离线存储
 */
import * as st from './storage';

const lst = localStorage;

/**
 * 离线存储，缺省 180 天
 * @param {*} key
 * @param {*} val
 * @param {*} exp 过期时长，单位分钟，365天 x 24小时 x 60分 = 525_600 分
 */
function set(key, val, exp = 525_600) {
  st.set(lst, key, val, exp);
}

function get(key) {
  return st.get(lst, key);
}

function remove(key) {
  st.remove(lst, key);
}

function clear() {
  st.clear(lst);
}

function check() {
  st.check(lst);
}

export {set, get, remove, clear, check};
