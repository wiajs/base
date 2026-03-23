import Support from './support';

let _device;

const Device = (function Device() {
  // 已经运算，直接返回，避免重复运算
  if (_device) return _device;

  const ua = navigator.userAgent;
  const platform = navigator.platform;
  const screenWidth = screen.width;
  const screenHeight = screen.height;

  // 预定义常用匹配结果
  const androidMatch = ua.match(/(Android);?[\s/]+([\d.]+)?/);
  const ipadMatch = ua.match(/(iPad).*OS\s([\d_]+)/);
  const ipodMatch = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
  const iphoneMatch = !ipadMatch && ua.match(/(iPhone\sOS|iOS|iPhone;\sCPU\sOS)\s([\d_]+)/);
  const ieMatch = ua.indexOf('MSIE ') >= 0 || ua.indexOf('Trident/') >= 0;
  const edgeMatch = ua.indexOf('Edge/') >= 0;
  const firefoxMatch = ua.indexOf('Gecko/') >= 0 && ua.indexOf('Firefox/') >= 0;
  const windowsMatch = platform === 'Win32'; // windows浏览器模拟，都是Win32
  const electronMatch = ua.toLowerCase().indexOf('electron') >= 0;
  const nwjsMatch = typeof nw !== 'undefined' && process?.versions?.nw !== undefined;
  let macosMatch = platform === 'MacIntel';

  // iPadOS 13+ 修复：Mac 设备 + 触摸支持 + iPad 屏幕尺寸
  const iPadScreenSet = new Set([
    '1024x1366', '1366x1024', '834x1194', '1194x834',
    '834x1112', '1112x834', '768x1024', '1024x768',
    '820x1180', '1180x820', '810x1080', '1080x810',
  ]);
  let ipadFinal = ipadMatch;
  if (!ipadFinal && macosMatch && Support.touch && iPadScreenSet.has(`${screenWidth}x${screenHeight}`)) {
    // iPadOS 13+ 伪装成 Mac，根据屏幕尺寸判断
    ipadFinal = ua.match(/(Version)\/([\d.]+)/);
    if (!ipadFinal) ipadFinal = [0, 1, '13_0_0'];
    macosMatch = false;
  }

  // 基础设备对象
  const device = {
    ios: false,
    android: false,
    androidChrome: false,
    desktop: false,
    iphone: false,
    ipod: false,
    ipad: false,
    edge: edgeMatch,
    ie: ieMatch,
    firefox: firefoxMatch,
    macos: macosMatch,
    windows: windowsMatch,
    cordova: !!window.cordova,
    electron: electronMatch,
    capacitor: !!window.Capacitor,
    nwjs: nwjsMatch,
    wechat: /MicroMessenger/i.test(ua),
    wx: false, // 稍后赋值
    pixelRatio: window.devicePixelRatio || 1,
  };

  // Android 系列
  if (androidMatch) {
    device.os = 'android';
    device.osVersion = androidMatch[2];
    device.android = true;
    device.androidChrome = ua.toLowerCase().includes('chrome');
  }

  // iOS 系列
  if (ipadFinal || iphoneMatch || ipodMatch) {
    device.os = 'ios';
    device.ios = true;
  }
  if (iphoneMatch && !ipodMatch) {
    device.osVersion = iphoneMatch[2].replace(/_/g, '.');
    device.iphone = true;
  }
  if (ipadFinal) {
    device.osVersion = ipadFinal[2].replace(/_/g, '.');
    device.ipad = true;
  }
  if (ipodMatch) {
    device.osVersion = ipodMatch[3] ? ipodMatch[3].replace(/_/g, '.') : null;
    device.ipod = true;
  }

  // iOS 8+ 的 UA 修正
  if (device.ios && device.osVersion && ua.includes('Version/')) {
    const versionPart = ua.toLowerCase().split('version/')[1];
    if (versionPart) {
      device.osVersion = versionPart.split(' ')[0];
    }
  }

  // WebView / Standalone 模式
  const isWebView = !!(
    (device.iphone || device.ipad || device.ipod) &&
    (ua.match(/.*AppleWebKit(?!.*Safari)/i) || navigator.standalone)
  ) || (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches);
  device.webView = isWebView;
  device.webview = isWebView;
  device.standalone = isWebView;

  // 桌面环境
  device.desktop = !(device.ios || device.android) || device.electron || device.nwjs;
  if (device.desktop) {
    if (device.macos) device.os = 'macos';
    if (device.windows) device.os = 'windows';
    }

  // 颜色主题检测（方法保留）
  device.prefersColorScheme = function() {
    const darkQuery = '(prefers-color-scheme: dark)';
    const lightQuery = '(prefers-color-scheme: light)';
    if (window.matchMedia && window.matchMedia(lightQuery).matches) return 'light';
    if (window.matchMedia && window.matchMedia(darkQuery).matches) return 'dark';
    return undefined;
  };

  // 微信
  device.weixin = device.wechat;
  device.wx = device.wechat;

  _device = device;
  return _device;
})();

export default Device;
