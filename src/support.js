/** 
 * 设备功能检测模块（优化版）
 * 单例模式，检测浏览器支持的各种特性和API
*/

let _support;

const Support = (function Support() {
  if (_support) return _support;

  // 触摸支持（现代浏览器优先使用 touch 事件检测）
  const checkTouch = () => 'ontouchstart' in window;

  // 指针事件支持（现代浏览器）
  const checkPointerEvents = () => !!(window.PointerEvent && navigator.maxTouchPoints >= 0);

  // MutationObserver 支持
  const checkObserver = () => 'MutationObserver' in window;

  // Passive 事件监听器支持
  const checkPassiveListener = () => {
    let supportsPassive = false;
    try {
      const opts = Object.defineProperty({}, 'passive', {
        get() { supportsPassive = true; },
      });
      window.addEventListener('test', null, opts);
      window.removeEventListener('test', null);
    } catch (e) {
      // 不支持
    }
    return supportsPassive;
  };

  // 手势事件支持（iOS Safari）
  const checkGestures = () => 'ongesturestart' in window;

  // IntersectionObserver 支持
  const checkIntersectionObserver = () => 'IntersectionObserver' in window;

  _support = {
    touch: checkTouch(),
    pointerEvents: checkPointerEvents(),
    observer: checkObserver(),
    passiveListener: checkPassiveListener(),
    gestures: checkGestures(),
    intersectionObserver: checkIntersectionObserver(),
  };

	return _support;
})();

export default Support;
