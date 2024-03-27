/**
 * @name WebUtilPro
 * @version 1.0.0
 * @description 网页工具
 * @license MIT
 * 
 * (c) 2023-12-29 Wang Jia Ming
 * 
 * https://opensource.org/licenses/MIT
 */
const _WebUtilPro_VERSION = "2.5.0";
var Html = document.getElementsByTagName("html")[0];
var Head = document.head;
var Body = document.body;
const MainWindow = document.getElementById("MainWindow");
const CaleBack_ID = 0;
const CaleBack_FN = 1;
const CaleBack_CONDITION = 2;
var _INIT_PAGE_WebUtilPro_FN = () => { };
// 点击的元素
var WClickElement = null;
var WClickElementCount = 1;
// 经过的元素
var WMouseElement = null;
// 样式
const _WebUtilPro__STYLE_INIT = document.createElement("style");
(function () {
  _WebUtilPro__STYLE_INIT.id = "_WebUtilPro__STYLE_INIT";
  _WebUtilPro__STYLE_INIT.innerText = `
body {
    opacity: 0;
    transition: opacity 0.3s;
}
  `;
  Head.appendChild(_WebUtilPro__STYLE_INIT);
})();

function _WebUtilPro_isString(str) {
  return typeof str === 'string' || str instanceof String;
}

function _WebUtilPro_isFunction(func) {
  return typeof func === 'function' || func instanceof Function;
}

function _WebUtilPro_isClass(obj) {
  return typeof obj === 'function' && /^\s*class\s+/.test(obj.toString());
}

function _WebUtilPro_isPlainObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}

function _WebUtilPro_isArray(arr) {
  return Array.isArray(arr);
}

function _WebUtilPro_isNumber(num) {
  return typeof num === 'number' || num instanceof Number;
}

function _WebUtilPro_isBoolean(bool) {
  return typeof bool === 'boolean' || bool instanceof Boolean;
}

function _WebUtilPro_isNegative(num) {
  return num < 0;
}

function _WebUtilPro_isObject(obj) {
  return typeof obj === 'object' && obj !== null;
}

function _WebUtilPro_isHTMLElement(obj) {
  return typeof obj === 'object' && obj.nodeType === 1 && typeof obj.style === 'object' && typeof obj.ownerDocument === 'object';
}

function _WebUtilPro_isTextNode(node) {
  return node && node.nodeType === 3;
}

// 类型转换

function _WebUtilPro_strToBoolean(str) {
  if (str === "true" || str === "1") {
    return true;
  } else if (str === "false" || str === "0") {
    return false;
  }
  return NaN;
}

// 事件
const _WebUtilPro_event = {
  click: "click",           // 鼠标点击
  mousedown: "mousedown",   // 鼠标按下元素
  input: "input",           // 输入框输入
  change: "change",         // 表单字段值变化
  submit: "submit",         // 提交表单
  mouseover: "mouseover",   // 鼠标移入元素
  mouseout: "mouseout",     // 鼠标移出元素
  keydown: "keydown",       // 键盘按下
  keyup: "keyup",           // 键盘释放
  focus: "focus",           // 元素获得焦点
  blur: "blur"              // 元素失去焦点
};

// 窗口模式
const _WebUtilPro_window_model = {
  default: "default",
  fullscreen: "fullscreen"
}

// 窗口操作
const _WebUtilPro_window_operation = {
  default: "none",
  both: "both",
  horizontal: "horizontal",
  vertical: "vertical"
}

/**
 * 事件级别定义
 * - `normal`: 正常
 * - `warning`: 警告
 * - `severe`: 严重
 * - `safety`: 安全
 * - `ok`: 通过
 */
const _WebUtilPro_event_level = {
  normal: 'normal',
  warning: 'warning',
  severe: 'severe',
  safety: 'safety',
  ok: 'ok'
}

// 输入类型
const _WebUtilPro_input_type = {
  text: "text",                      // 文本
  password: "password",              // 密码
  search: "search",                  // 搜索
  email: "email",                    // 邮箱
  tel: "tel",                        // 电话号码
  url: "url",                        // URL
  number: "number",                  // 数字
  date: "date",                      // 日期
  datetimeLocal: "datetime-local",   // 本地日期时间
  month: "month",                    // 月份
  time: "time",                      // 时间
  week: "week"                       // 周数
};

// 

// 方向
const _WebUtilPro_direction = {
  Top: 0,
  Bottom: 1,
  Left: 2,
  Right: 3
};
// 位置
const _WebUtilPro_place = {
  Left: {
    Top: 0,
    Center: 1,
    Bottom: 2
  },
  Center: {
    Top: 3,
    Center: 4,
    Bottom: 5
  },
  Right: {
    Top: 6,
    Center: 7,
    Bottom: 8
  }
};
// 解析位置
const _WebUtilPro_analysisPlace = function (value) {
  if (_WebUtilPro_isNumber(value)) {
    switch (value) {
      case 0: { return "LT" }
      case 1: { return "LC" }
      case 2: { return "LB" }
      case 3: { return "CT" }
      case 4: { return "CC" }
      case 5: { return "CB" }
      case 6: { return "RT" }
      case 7: { return "RC" }
      case 8: { return "RB" }
    }
  } else if (_WebUtilPro_isString(value)) {
    const value_ = value.toUpperCase();
    switch (value_) {
      case "LT": { return _WebUtilPro_place.Left.Top }
      case "LC": { return _WebUtilPro_place.Left.Center }
      case "LB": { return _WebUtilPro_place.Left.Bottom }
      case "CT": { return _WebUtilPro_place.Center.Top }
      case "CC": { return _WebUtilPro_place.Center.Center }
      case "CB": { return _WebUtilPro_place.Center.Bottom }
      case "RT": { return _WebUtilPro_place.Right.Top }
      case "RC": { return _WebUtilPro_place.Right.Center }
      case "RB": { return _WebUtilPro_place.Right.Bottom }
    }
  }
  return null;
};

(function () {
  'use strict';
  /**
   * 定义 `setVisibility` 方法，用于设置元素的可见性
   *
   * @param {boolean} isVisible  
   */
  // 将 `Visibility` 属性添加到 `HTMLElement` 的原型上，用于保存元素的可见性状态
  HTMLElement.prototype.Visibility;
  HTMLElement.prototype.setVisibility = function (isVisible) {
    if (isVisible) {
      this.Visibility = true;
      this.setStyle({
        visibility: "visible",
      });
    } else {
      this.Visibility = false;
      this.setStyle({
        visibility: "hidden",
      });
    }
  };

  /**
   *
   * 给当前 HTML 元素设置样式。
   * @param {Object} styleObj - 表示 CSS 样式属性和值的键值对对象
   * @return {HTMLElement} 返回当前 HTML 元素本身，以便实现链式调用
   */
  HTMLElement.prototype.setStyle = function (styleObj) {
    for (let property in styleObj) {
      this.style[property] = styleObj[property];
    }
    return this;
  };

  /**
   * 移除元素的所有绑定事件
   */
  HTMLElement.prototype.removeAllEventListeners = function () {
    // 移除当前元素的绑定事件
    const events = this.__events || {};
    for (let eventName in events) {
      if (events.hasOwnProperty(eventName)) {
        for (let i = 0; i < events[eventName].length; i++) {
          element.removeEventListener(eventName, events[eventName][i].listener);
        }
      }
    }
  }
  /**
   * 移除元素及其所有子元素的所有绑定事件
   */
  HTMLElement.prototype.removeElementAllEventListeners = function () {
    // 移除当前元素的绑定事件
    this.removeAllEventListeners();

    // 检查当前元素是否有子节点，递归调用函数对子节点进行同样的操作
    const children = this.children;
    for (let i = 0; i < children.length; i++) {
      children[i].removeElementAllEventListeners();
    }
  }
  /**
   * 在移除指定元素前，先移除其及其所有子元素的所有绑定事件
   * 然后再将该元素从其父节点中删除
   */
  HTMLElement.prototype.RemovePro = function () {
    this.removeElementAllEventListeners();
    this.remove();
  }
  HTMLElement.prototype.removePro = function () {
    this.removeAllEventListeners();
    this.remove();
  }

  /**
   * 获取指定元素的上级节点
   * @param {Number} levels - 要获取的上级级数
   * @returns {Object|null} - 返回获取到的上级节点，若超出根节点则返回 null
   */
  HTMLElement.prototype.getParentLevelsUp = function (levels) {
    let parent = this;
    for (let i = 0; i < levels; i++) {
      if (parent.parentNode) {
        parent = parent.parentNode;
      } else {
        return null; // 若超出根节点，则返回 null
      }
    }
    return parent;
  }

  /**
   * 为 HTMLElement 原型添加自定义方法，用于注册唯一事件监听器
   * @param {string} eventName - 事件名称
   * @param {Function} fn - 事件处理函数
   * @param {boolean} trigger - 是否触发一次事件
   */
  HTMLElement.prototype.wAddSoleEventListener = function (eventName, fn = () => { }, trigger = false, arg = {}) {
    this.removeEventListener(eventName, fn);
    this.addEventListener(eventName, fn, arg);

    if (trigger) {
      const event = new MouseEvent(eventName, {
        bubbles: true,
        cancelable: true,
        view: window,
        button: 0
      });
      this.dispatchEvent(event);
    }
  };
  document.wAddSoleEventListener = function (eventName, fn = () => { }, trigger = false, arg = {}) {
    this.removeEventListener(eventName, fn);
    this.addEventListener(eventName, fn, arg);

    if (trigger) {
      const event = new MouseEvent(eventName, {
        bubbles: true,
        cancelable: true,
        view: window,
        button: 0
      });
      this.dispatchEvent(event);
    }
  };

  /**
   * 为 HTMLElement 原型添加自定义方法，用于注册唯一事件监听器并触发事件
   * @param {Array<string>} eventNames - 事件名称数组
   * @param {Array<Function>} fns - 事件处理函数数组
   * @param {Array<boolean>} triggers - 触发器数组，用于指定是否触发对应的事件
   */
  HTMLElement.prototype.wAddsSoleEventListener = function (eventNames = [], fns = [], triggers = [], arg = []) {
    for (let index = 0; index < eventNames.length; index++) {
      const eventName = eventNames[index];
      // 移除已存在的事件监听器
      this.removeEventListener(eventName, fns[index]);
      // 注册新的事件监听器
      this.addEventListener(eventName, fns[index], arg[index]);

      if (triggers[index]) {
        // 创建一个模拟事件对象，并触发该事件
        const event = new MouseEvent(eventName, {
          bubbles: true,
          cancelable: true,
          view: window,
          button: 0
        });
        this.dispatchEvent(event);
      }
    }
  };
  document.wAddsSoleEventListener = function (eventNames = [], fns = [], triggers = [], arg = []) {
    for (let index = 0; index < eventNames.length; index++) {
      const eventName = eventNames[index];
      // 移除已存在的事件监听器
      this.removeEventListener(eventName, fns[index]);
      // 注册新的事件监听器
      this.addEventListener(eventName, fns[index], arg[index]);

      if (triggers[index]) {
        // 创建一个模拟事件对象，并触发该事件
        const event = new MouseEvent(eventName, {
          bubbles: true,
          cancelable: true,
          view: window,
          button: 0
        });
        this.dispatchEvent(event);
      }
    }
  };

  /**
   * 为 HTMLElement 原型添加自定义方法，用于注册带条件的事件监听器
   * @param {string} eventName - 事件名称
   * @param {Function} fn - 事件处理函数
   * @param {Function} okFn - 条件满足时执行的回调函数
   */
  HTMLElement.prototype.wAddWEventListener = function (eventName, fn, okFn = () => { }) {
    if (this.getAttribute("WEvent") === eventName) {
      this.wAddSoleEventListener(eventName, fn);
      okFn();
    }
  };

  /**
   * 为 HTMLElement 的原型添加 SoleID 属性，用于生成唯一标识符
   * @returns {string} - 生成的唯一标识符
   */
  Object.defineProperty(HTMLElement.prototype, "SoleID", {
    get: function () {
      if (!this._SoleID) {
        this._SoleID = (function () {
          let timestamp = new Date().getTime(); // 获取当前时间戳
          timestamp = timestamp - Math.floor(Math.random() * 10000);
          let random = Math.floor(Math.random() * 9996); // 生成一个随机数
          timestamp = timestamp.toString(12);
          return `SoleID_${timestamp}_${random}`; // 拼接生成唯一ID
        })();
      }
      return this._SoleID;
    }
  });

})();

const WebUtilPro = (function () {
  'use strict';
  /**
   * $ 函数用于获取指定的 DOM 元素。
   *
   * @param {String} element_Name CSS 选择器、ID、类名或属性名
   * @return {Object} 包含获取到的 DOM 元素及相关方法的对象
   * @return {HTMLElement} DOM 元素
   */
  function $(element_Name, obj = document) {
    try {
      function selectorF(selector) {
        const selectorType = {
          "#": "id",
          ".": "class",
          "[": "attr",
          ">": "son",
          "&": "SoleID",
        };
        const type = selectorType[selector.charAt(0)];

        let ReturnElement = null;
        if (type === "id") {
          // 如果是 ID 选择器
          ReturnElement = obj.getElementById(selector.substring(1));
        } else if (type === "class") {
          // 如果是 class 选择器
          ReturnElement = obj.querySelectorAll(selector);
        } else if (type === "attr") {
          // 如果是 attr 选择器
          ReturnElement = obj.querySelectorAll(selector);
        } else if (type === "son") {
          // 如果是 son 选择器
          if (selectorType[selector.charAt(1)]) {
            const elements = obj.querySelectorAll("*");
            let arrs = Array.from(elements).filter((element) => element.parentNode === obj);
            let arr = new Array;
            const V = selector.substring(2);
            const V2 = selector.substring(2, selector.length - 1);
            switch (selectorType[selector.charAt(1)]) {
              case "class":
                arrs.forEach(e => {
                  if (e.classList.contains(V)) {
                    arr.push(e);
                  }
                });
                break;
              case "attr":
                {
                  const nameAndValue = V2.split("=");
                  if (nameAndValue.length > 1)
                    arrs.forEach(e => { if (e.getAttribute(nameAndValue[0]) === nameAndValue[1]) arr.push(e) });
                  else
                    arrs.forEach(e => { if (e.hasAttribute(V2)) arr.push(e) });
                }
                break;
              default:
                arr = null;
                break;
            }
            ReturnElement = arr;
          } else {
            const elements = obj.querySelectorAll(selector.substring(1));
            ReturnElement = Array.from(elements).filter((element) => element.parentNode === obj);
          }
        } else if (type === "SoleID") {
          // 如果是 SoleID 选择器
          const allE = obj.querySelectorAll("*");
          allE.forEach(e => {
            if (e.SoleID === selector.substring(1)) {
              ReturnElement = e;
            }
          });
          ReturnElement = null;
        } else {
          // 默认使用标签名选择器
          ReturnElement = obj.getElementsByTagName(selector);
        }
        if (ReturnElement === null) {
          return null;
        }
        return ReturnElement;
      }
      let elementM = null;
      if (_WebUtilPro_isHTMLElement(element_Name)) {
        elementM = element_Name;
      } else {
        elementM = selectorF(element_Name);
      }
      elementM.$ = function (eName) {
        return $(eName, this);
      };
      return elementM;
    } catch (error) {
      console.error(error);
    }
  }
  /**
   * 扩展 HTMLElement 原型的 $ 方法，用于选择子元素
   * @param {string} element_Name - 子元素的选择器
   * @returns {HTMLElement} - 选中的子元素
   */
  HTMLElement.prototype.$ = function (element_Name) {
    return $(this).$(element_Name);
  }

  /**
   * 获取指定的父级返回 true 或者直到 MainWindow 结束
   * @param {HTMLELEMENT} element - 要获取指定父级的元素
   * @param {function} fn - 验证功能 如果当前的父级是与预期一样的则需要返回 true
   */
  function getAppointParent(element, fn = () => { }) {
    if (element === MainWindow) {
      return false;
    }
    if (!fn(element) && element.parentNode)
      return getAppointParent(element.parentNode, fn) || false;
    else
      return element;
  }

  /**
   * 检查给定类及其原型链上是否存在指定方法名
   * @param {function} klass 给定的类
   * @param {string} functionName 指定的方法名
   * @returns {boolean} 是否存在指定方法名
   */
  function checkClassHasFunction(klass, functionName) {
    // 获取类原型对象
    const proto = klass.prototype;
    // 检查类原型对象和类本身是否具有该方法
    if (
      proto.hasOwnProperty(functionName) ||
      klass.hasOwnProperty(functionName)
    ) {
      return true;
    }
    // 遍历原型链，查找是否具有该方法
    let currentProto = proto;
    while (currentProto !== null) {
      if (currentProto.hasOwnProperty(functionName)) {
        return true;
      }
      currentProto = Object.getPrototypeOf(currentProto);
    }
    return false;
  }

  /**
   * 函数用于获取当前时间的格式化字符串。
   *
   * @param {String} separator 时分秒之间的分隔符，默认为 ":"
   * @return {String} 当前时间的格式化字符串，格式为 "YYYY-MM-DD HH:mm:ss"
   */
  function getNowFormatDate(template = "YYYY-MM-DD HH:mm:ss") {
    if (!getNowFormatDate.template) {
      // 检查是否已缓存格式化字符串
      getNowFormatDate.template = template;
    }

    const date = new Date();
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    const hour = ("0" + date.getHours()).slice(-2);
    const minute = ("0" + date.getMinutes()).slice(-2);
    const second = ("0" + date.getSeconds()).slice(-2);

    return getNowFormatDate.template
      .replace("YYYY", year)
      .replace("MM", month)
      .replace("DD", day)
      .replace("HH", hour)
      .replace("mm", minute)
      .replace("ss", second);
  }

  /**
   * 生成唯一ID
   * @returns {string} 生成的唯一ID
   */
  function generateUniqueId(length = 18) {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    let t1 = '';
    let t2 = '';
    for (let i = 0; i < 9; i++) {
      t1 += letters.charAt(Math.floor(Math.random() * letters.length));
      t2 += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }
    return `ID_${t1}_${t2}`.substring(0, length);
  }

  /**
   * addDraggable 用于实现拖拽功能
   *
   * @param {Element} element 需要添加拖拽功能的元素
   * @param {Element} effectElement 对该元素进行移动效果的元素，默认为 element 本身
   * @param {function} fn 回调函数，在拖拽过程中会不断地触发该函数，并将一个字符串参数传入以表示当前拖拽的状态（包括 "onMove"、"endMove"、"onClick" 等）
   * @param {Object} limit 用于限制元素移动的范围的对象，包括 top、bottom、left、right 四个属性
   */
  class addDraggable {
    constructor({
      element,
      effectElement = element,
      fn = () => { },
      limit = {},
      isKeyOperation = true,
    }) {
      this.element = element;
      this.effectElement = effectElement;
      this.fn = fn;
      this.limit = limit;
      this.isKeyOperation = isKeyOperation || true;

      this.startX = 0;
      this.startY = 0;
      this.startTransformX = 0;
      this.startTransformY = 0;
      this.values = [];
      this.timer = null;

      this.onKeyPress = this.onKeyPress.bind(this);
      this.onPointerDown = this.onPointerDown.bind(this);
      this.onPointerMove = this.onPointerMove.bind(this);
      this.onPointerUp = this.onPointerUp.bind(this);

      this.element.addEventListener("mousedown", this.onPointerDown, { passive: false });
      this.element.addEventListener("touchstart", this.onPointerDown, { passive: false });
    }

    updateLimit(limit) {
      this.limit = limit;
    }

    getTranslate3d(element) {
      const transform = element.style.transform;
      const match = transform.match(/translate3d\((.+?)\)/);

      if (match) {
        const values = match[1].split(", ");
        const x = parseInt(values[0]);
        const y = parseInt(values[1]);
        const z = parseInt(values[2]);

        return { x, y, z };
      }

      return { x: 0, y: 0, z: 0 };
    }

    onKeyPress(event) {
      const { key } = event;
      // 根据按键调整偏移量
      switch (key) {
        case "ArrowUp":
          this.setTransformXY(
            this.getTranslate3d(this.effectElement).x,
            this.getTranslate3d(this.effectElement).y - 1
          );
          break;
        case "ArrowDown":
          this.setTransformXY(
            this.getTranslate3d(this.effectElement).x,
            this.getTranslate3d(this.effectElement).y + 1
          );
          break;
        case "ArrowLeft":
          this.setTransformXY(
            this.getTranslate3d(this.effectElement).x - 1,
            this.getTranslate3d(this.effectElement).y
          );
          break;
        case "ArrowRight":
          this.setTransformXY(
            this.getTranslate3d(this.effectElement).x + 1,
            this.getTranslate3d(this.effectElement).y
          );
          break;
        default:
          return;
      }
    }

    onPointerDown(event) {
      if (this.isKeyOperation) {
        document.addEventListener("keydown", this.onKeyPress);
      }
      event.preventDefault();

      this.startX =
        event.clientX ||
        (event.touches && event.touches.length > 0 && event.touches[0].clientX) ||
        0;
      this.startY =
        event.clientY ||
        (event.touches && event.touches.length > 0 && event.touches[0].clientY) ||
        0;

      const transform = this.getTransformXY();
      this.startTransformX = transform.x;
      this.startTransformY = transform.y;

      document.addEventListener("mousemove", this.onPointerMove);
      document.addEventListener("touchmove", this.onPointerMove);
      document.addEventListener("mouseup", this.onPointerUp);
      document.addEventListener("touchend", this.onPointerUp);

      this.timer = setTimeout(() => {
        this.timer = null;
      }, 300);
    }

    onPointerMove(event) {
      const offsetX =
        ((event.clientX || (event.touches && event.touches[0].clientX)) || 0) -
        this.startX;
      const offsetY =
        ((event.clientY || (event.touches && event.touches[0].clientY)) || 0) -
        this.startY;

      if (this.timer !== null) {
        // 判断是否移动超过阈值
        if (Math.abs(offsetX) > 10 || Math.abs(offsetY) > 10) {
          clearTimeout(this.timer);
          this.timer = null;
        }
      } else {
        this.setTransformXY(
          this.startTransformX + offsetX,
          this.startTransformY + offsetY
        );
      }
    }

    onPointerUp(event) {
      document.removeEventListener("keydown", this.onKeyPress);

      document.removeEventListener("mousemove", this.onPointerMove);
      document.removeEventListener("touchmove", this.onPointerMove);
      document.removeEventListener("mouseup", this.onPointerUp);
      document.removeEventListener("touchend", this.onPointerUp);

      if (this.timer !== null) {
        clearTimeout(this.timer);
        this.timer = null;
        this.fn("onClick", event);
      }
    }

    getTransformXY() {
      let transform;
      if (this.effectElement != this.element) {
        transform = window
          .getComputedStyle(this.effectElement)
          .getPropertyValue("transform");
      } else {
        transform = window
          .getComputedStyle(this.element)
          .getPropertyValue("transform");
      }
      const matrix = transform.match(/^matrix\((.+)\)$/);

      if (!matrix) {
        return {
          x: 0,
          y: 0,
        };
      }

      if (
        this.values.length == 0 ||
        this.values.join("") != matrix[1]
      ) {
        this.values = matrix[1].split(", ");
      }

      return {
        x: parseInt(this.values[4] || "0"),
        y: parseInt(this.values[5] || "0"),
      };
    }

    setTransformXY(x, y) {
      const { top = -Infinity, bottom = Infinity, left = -Infinity, right = Infinity } =
        this.limit;

      if (y <= top) {
        y = top;
      }
      if (y >= bottom) {
        y = bottom;
      }
      if (x <= left) {
        x = left;
      }
      if (x >= right) {
        x = right;
      }

      if (!this.fn("onMove", x, y)) return;
      this.effectElement.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    }
  }

  /**
   * 获取设备方向函数
   * @returns {number} 设备方向指示，0 表示竖屏、1 表示横屏、-1 表示无法确定
   */
  function getDeviceOrientation() {
    if (window.matchMedia("(orientation: portrait)").matches) {
      return 0; //竖
    } else if (window.matchMedia("(orientation: landscape)").matches) {
      return 1;
    } else {
      return -1;
    }
  }

  /**
   * 创建HTML元素
   * @param {object} options - 元素选项
   * @param {string} options.tagName - 元素标签名
   * @param {array} options.classList - 元素类名列表
   * @returns {HTMLElement} - 新创建的HTML元素
   */
  function createElement({
    tagName = "div",
    classList = [],
    attribute = [],
    text = null,
    contentText = "",
    html = null,
    child = null,
    callback = () => { }
  }) {
    const element = document.createElement(tagName);
    forEnd(classList, (e) => {
      element.classList.add(e);
    });
    forEnd(attribute, (e) => {
      element.setAttribute(e[0], e[1]);
    });

    if (contentText) {
      element.textContent = contentText;
    } else if (text) {
      element.innerText = text;
    } else if (html) {
      element.innerHTML = html;
    }

    if (child)
      if (_WebUtilPro_isArray(child) && child.length > 1) {
        forEnd(child, (e) => {
          element.appendChild(e.cloneNode(true));
        });
      } else if (_WebUtilPro_isHTMLElement(child)) {
        element.appendChild(child);
      }
    if (callback) callback(element);
    return element;
  }

  /**
   * 从给定的数组中删除重复的元素
   * 
   * @param {Array} oldElement - 需要处理的数组
   */
  function UniquenessElement(oldElement) {
    if (oldElement.length > 0) {
      forEnd(oldElement, (e) => {
        if (_WebUtilPro_isHTMLElement(e)) e.remove()
      });
    }
  }

  /**
   * 修正控件内部弹出框的位置，确保不超出控件的边界范围
   *
   * @param {number} x - 弹出框的 X 轴坐标
   * @param {number} y - 弹出框的 Y 轴坐标
   * @param {HTMLElement} content - 弹出框的 HTML 内容
   * @param {HTMLElement} [Control=MainWindow] - 弹出框所在的控件，默认为 MainWindow
   * @returns {number[]} 返回修正后的弹出框坐标 [y, x]
   */
  function RangeCorrection(x, y, content, Control = MainWindow) {
    const ControlW = Control.offsetWidth;
    const ControlH = Control.offsetHeight;
    const contentW = content.offsetWidth;
    const contentH = content.offsetHeight;

    if (x + contentW > ControlW) {
      x = ControlW - contentW;
    }
    if (y + contentH > ControlH) {
      y = ControlH - contentH;
    }

    return [y || 0, x || 0];
  }

  /**
   * 表单验证函数
   * @param {string} data 待验证数据
   * @param {string} mode 验证模式，可选值为 "password"、"idCard"、"phone" 和 "email"
   * @returns {boolean} 验证结果，true 表示验证通过，false 表示验证失败
   */
  function formValidation(data, mode) {
    let is;
    if (mode !== "") {
      if (mode === "password") {
        is = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
      } else if (mode === "idCard") {
        is =
          /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}[\dX]$/;
      } else if (mode === "phone") {
        is = /^[1][3-9]\d{9}$/;
      } else if (mode === "email") {
        is = /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i;
      }
      return is.test(data);
    } else {
      return false;
    }
  }

  /**
   * 验证文件夹名字或文件名是否合法
   * @param {string} data 待验证数据
   * @returns {boolean} 验证结果
   */
  function isValidFilename(data) {
    // 定义合法字符的正则表达式
    const regex = /^[a-zA-Z0-9-_()\u4e00-\u9fa5]+$/;

    // 使用正则表达式进行匹配判断
    if (regex.test(data)) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * 更新网站 Favicon 的链接
   * @param {string} newIconUrl 新的 Favicon 的 URL
   */
  function updateFavicon(newIconUrl) {
    // 获取 link 元素
    let linkElement =
      document.querySelector('link[rel="shortcut icon"]') ||
      document.querySelector('link[rel="icon"]');

    // 创建一个新 link 元素
    let newLinkElement = document.createElement("link");
    newLinkElement.rel = "shortcut icon";
    newLinkElement.type = "image/x-icon";
    newLinkElement.href = newIconUrl;

    // 替换或添加 link 元素
    if (linkElement) {
      linkElement.parentNode.replaceChild(newLinkElement, linkElement);
    } else {
      document.head.appendChild(newLinkElement);
    }
  }

  /**
   * 获取浏览器信息
   * @returns {Object} 返回一个包含浏览器信息的对象
   */
  function getBrowserInfo() {
    return {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      isOnline: navigator.onLine,
      isCookieEnabled: navigator.cookieEnabled,
      colorScheme: (function () {
        return window.matchMedia &&
          window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "Dark"
          : "Light";
      })()
    };
  }

  /**
   * 返回柔和亮的随机颜色
   * @returns {string} 返回一个颜色字符串
   */
  function getRandomColor(type = 'rgba') {
    let hue = Math.floor(Math.random() * 360);  // 随机生成色相值 (0 - 359)
    hue = hue - Math.floor(Math.random() * 99) + Math.floor(Math.random() * 66);
    let saturation = Math.floor(Math.random() * 30 + 70);  // 随机生成饱和度值 (70 - 100)
    let lightness = Math.floor(Math.random() * 10 + 60);  // 随机生成亮度值 (60 - 70)

    let color;

    if (type === 'rgb') {
      color = `rgb(${hue}, ${saturation}, ${lightness})`;
    } else if (type === 'rgba') {
      let alpha = (Math.random() * (1 - 0.2) + 0.2).toFixed(2);  // 随机生成透明度值 (0.2 - 1)
      color = `rgba(${hue}, ${saturation}, ${lightness}, ${alpha})`;
    } else if (type === 'hsl') {
      color = `hsl(${hue}$, ${saturation}%, ${lightness}%)`;
    } else {
      throw new Error('Invalid color type');
    }

    return color;
  }

  /**
   * easyStorageTool - Web Storage 工具函数
   * 
   * 这个工具函数用于简化对 Web Storage（localStorage 或 sessionStorage）的操作
   * @returns {Object} - 一个包含 setItem、getItem、removeItem 和 clear 方法的对象
   */
  function easyStorageTool() {
    // 设置键值对
    function setItem(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (error) {
        console.error('存储错误：', error);
        return false;
      }
    }

    // 获取指定键的值
    function getItem(key) {
      try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : null;
      } catch (error) {
        console.error('读取错误：', error);
        return null;
      }
    }

    // 删除指定键值对
    function removeItem(key) {
      try {
        localStorage.removeItem(key);
        return true;
      } catch (error) {
        console.error('删除错误：', error);
        return false;
      }
    }

    // 清空存储
    function clear() {
      try {
        localStorage.clear();
        return true;
      } catch (error) {
        console.error('清空错误：', error);
        return false;
      }
    }

    // 返回公共方法
    return {
      setItem,
      getItem,
      removeItem,
      clear
    };
  }

  /**
   * Cookie 工具函数，用于设置、获取和删除 Cookie。
   * @param {string} cookieName - Cookie 名称前缀
   * @returns {object} - 包含 set、get 和 Delete 方法的对象
   */
  function cookieUtil(cookieName) {
    return {
      set: function (name, value, days, path = "/") {
        var expires = "";
        if (days) {
          var date = new Date();
          date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
          expires = "; expires=" + date.toUTCString();
        }
        const cookieData =
          cookieName + "_" + name + "=" + value + expires + "; path=" + path;
        document.cookie = cookieData;
      },

      get: function (name) {
        var fullNameEQ = cookieName + "_" + name + "=";
        var ca = document.cookie.split(";");

        for (var i = 0; i < ca.length; i++) {
          var c = ca[i];
          while (c.charAt(0) === " ") c = c.substring(1, c.length);
          if (c.indexOf(fullNameEQ) === 0)
            return c.substring(fullNameEQ.length, c.length);
        }
        return null;
      },

      Delete: function (name, path = "/") {
        this.set(name, "", -1, path);
      },
    };
  }

  /**
   * WAudioPlayer 音频播放器对象
   */
  function WAudioPlayer() {
    const audio = new Audio();
    let audioFileList = new Map();
    let progressCallback = null;

    /**
     * 添加音频文件路径
     * @param {string} src - 音频文件路径
     */
    function addAudioFile(src) {
      // 将音频文件路径以文件名（不包含扩展名）为键存储到 Map 中
      audioFileList.set(src.split("/").pop().split(".").slice(0, -1).join("."), src);
    }

    /**
     * 删除音频文件路径
     * @param {string} audioName - 音频文件名（不包含扩展名）
     */
    function removeAudioFile(audioName) {
      audioFileList.delete(audioName);
    }

    /**
     * 加载音频
     * @param {string} audioName - 音频文件名（不包含扩展名）
     */
    function loadAudio(audioName) {
      const audioInfo = audioFileList.get(audioName);
      if (audioInfo) {
        audio.src = audioInfo;
        audio.load();
      } else {
        console.log("not audio");
      }
    }

    /**
     * 播放音频
     */
    function play() {
      audio.play();
    }

    /**
     * 暂停音频
     */
    function pause() {
      audio.pause();
    }

    /**
     * 设置进度回调函数
     * @param {Function} callback - 进度回调函数，接收两个参数：当前时间和总时间
     */
    function setProgressCallback(callback) {
      progressCallback = callback;
      audio.addEventListener("timeupdate", handleProgressUpdate);
    }

    /**
     * 处理进度更新事件
     */
    function handleProgressUpdate() {
      if (progressCallback) {
        const currentTime = audio.currentTime;
        const duration = audio.duration;
        progressCallback(currentTime, duration);
      }
    }

    return {
      audio,
      audioFileList,

      addAudioFile,
      removeAudioFile,
      loadAudio,
      play,
      pause,
      setProgressCallback,
    };
  }

  /**
   * 格式化日期字符串为"YYYY-MM-DD"格式
   * @param {string} dateString - 需要格式化的日期字符串，格式为"YYYY-M-D"
   * @returns {string} 格式化后的日期字符串，格式为"YYYY-MM-DD"
   */
  function formatDateString(dateString) {
    let parts = dateString.split("-");
    let year = parts[0];
    let month = ("0" + parts[1]).slice(-2); // 补零
    let day = ("0" + parts[2]).slice(-2); // 补零

    return year + "-" + month + "-" + day;
  }

  /**
   * 计算给定起始日期与指定日期之间的天数差
   * @param {string} strStartDate - 起始日期
   * @param {string} [strEndtDate=new Date] - 结束日期 默认为当前日期
   * @returns {number} - 天数差
   */
  function calculateDaysDiff(strStartDate, strEndtDate = new Date) {
    let startDate = new Date(strStartDate);
    let todayDate = new Date(strEndtDate);
    let timeDiff = Math.abs(todayDate.getTime() - startDate.getTime());
    let daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff;
  }

  /**
   * 获取元素相对于屏幕的坐标
   * @param {HTMLElement} element - 要获取坐标的元素
   * @returns {Object} - 元素相对于屏幕的坐标，包含 x 和 y 值
   */
  function getElementScreenPosition(element) {
    const rect = element.getBoundingClientRect(); // 获取矩形对象
    const scrollLeft = window.scrollX || document.documentElement.scrollLeft;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    return {
      x: rect.left + scrollLeft,
      y: rect.top + scrollTop
    };
  }

  /**
   * 字符串转 innerHTML
   * @param {String} str - 要转换的字符串
   * @returns {innerHTML} - 解析后的 innerHTML
   */
  function strToinnerHTML(str) {
    const div = document.createElement("div");
    div.innerHTML = str;
    return div.innerHTML;
  }

  /**
   * 元素在动画结束后自动删除
   * @param {HTMLElement} element - 目标元素
   * @param {any} an - 动画
   */
  function elementAnEndDel(element, an, removeElement = element, fn = () => { }) {
    if (_WebUtilPro_isPlainObject(an)) {
      element.setStyle(an);
      let time = 500;
      if (an.time) { time = an.time; }
      clearTimeout(an.timeID);
      an.timeID = setTimeout(() => {
        fn();
        if (removeElement) {
          removeElement.remove();
        }
      }, time);
    } else {
      element.style.animation = "";
      element.style.animation = an;
      element.addEventListener("animationend", () => {
        fn();
        if (removeElement) {
          removeElement.remove();
        }
      });
    }
  }

  /**
   * 元素动画
   * @param {HTMLElement} element - 目标元素
   * @param {any} an - 动画
   */
  function elementAnimation(element, an) {
    element.style.animation = "";
    element.style.animation = an;
    element.addEventListener("animationend", () => {
      element.style.animation = "";
    });
  }

  /**
   * 元素出现动画函数
   * @param {HTMLElement} element - 目标元素
   * @param {any} an - 动画
   */
  function elementAppearAnimation(element, an) {
    const observer = new IntersectionObserver(onIntersection, {
      threshold: 0.5,
    });

    element.style.animation = "";

    function onIntersection(entries) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          observer.unobserve(entry.target);

          const e = entry.target;
          e.style.animation = an;
        }
      });
    }
  }

  /**
   * 完整循环数组，并根据条件返回匹配的元素
   * @param {Array} Arrs 需要循环的数组
   * @param {Function} condition 循环终止条件函数，接受当前元素和索引作为参数，返回布尔值
   * @param {Number} start 开始索引
   * @param {Array} skip 跳过指定索引的元素
   * @returns {any} 匹配到的元素
   */
  function forEnd(Arrs, condition, start = 0, skip = null) {
    if (!Arrs) {
      return null;
    }
    for (let index = start; index < Arrs.length; index++) {
      if (skip !== null && skip.includes(index)) {
        continue;
      }
      const element = Arrs[index];
      const value = condition(element, index);
      if (value === true) {
        return element;
      } else if (value === "continue") {
        continue;
      } else if (value === "break") {
        break;
      }
    }
    return null; // 如果没有匹配到任何元素，则返回null
  }

  /**
   * 递归设置元素及其子元素的原型链
   * @param {HTMLElement} element - 要设置原型链的根元素
   * @param {Object} prototype - 要设置的原型对象
   */
  function setElementInAllPrototypeRecursive(element, prototype) {
    // 设置当前元素的原型
    Object.setPrototypeOf(element, prototype);

    // 遍历当前元素的子元素
    const childNodes = element.childNodes;
    for (let i = 0; i < childNodes.length; i++) {
      const child = childNodes[i];

      // 递归调用，将子元素的原型也设置为相同的原型
      if (child.nodeType === Node.ELEMENT_NODE) {
        setElementInAllPrototypeRecursive(child, prototype);
      }
    }
  }

  /**
   * 动态引入 JavaScript 文件
   * @param {string} path - JavaScript 文件路径
   * @param {function} fn - 在加载完成后执行的回调函数
   * @param {boolean} endDelete - 是否在加载结束后删除 script 标签
   */
  function includeJsFile(path, fn = () => { }, endDelete = false) {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = path;

    script.onload = function () {
      fn(true, script);
      if (endDelete) {
        setTimeout(() => {
          script.remove();
        }, 5);
      }
    };

    script.onerror = function () {
      fn(false, script);
      if (endDelete) {
        setTimeout(() => {
          script.remove();
        }, 5);
      }
    };

    document.body.appendChild(script);
  }

  /**
   * 动态引入 CSS 文件
   * @param {string} path - CSS 文件路径
   * @param {function} fn - 在加载完成后执行的回调函数
   */
  function includeCssFile(path, fn = () => { }, parentNode = document.head) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = path;
    if (fn) fn(link);
    parentNode.appendChild(link);
  }

  /**
   * 动态引入多个 CSS 文件
   * @param {Array} arr - 包含 CSS 文件路径的数组
   *   每个数组项应包含以下结构：
   *     - {string} path - CSS 文件路径
   *     - {function} fn - 在加载完成后执行的回调函数 (可选)
   *     - {HTMLElement} parentNode - CSS 文件插入的父节点 (默认为 document.head) (可选)
   */
  function includeCssFiles(arr = []) {
    forEnd(arr, (e) => {
      includeCssFile(e[0], e[1], e[2]);
    });
  }

  /*
   * 标准初始化页功能
   */
  function _INIT_PAGE_WebUtilPro_(callback = () => { }) {
    Body.style.display = "block";
    setTimeout(() => {
      Body.style.opacity = "1";
      _INIT_PAGE_WebUtilPro_FN();
      callback();
    }, 100);
  }

  return {
    $,
    _INIT_PAGE_WebUtilPro_,
    addDraggable,
    calculateDaysDiff,
    checkClassHasFunction,
    cookieUtil,
    createElement,
    easyStorageTool,
    elementAnEndDel,
    elementAnimation,
    elementAppearAnimation,
    getElementScreenPosition,
    forEnd,
    formValidation,
    formatDateString,
    generateUniqueId,
    getAppointParent,
    getBrowserInfo,
    getDeviceOrientation,
    getElementScreenPosition,
    getRandomColor,
    getNowFormatDate,
    includeCssFile,
    includeCssFiles,
    includeJsFile,
    isValidFilename,
    RangeCorrection,
    setElementInAllPrototypeRecursive,
    strToinnerHTML,
    UniquenessElement,
    updateFavicon,
    WAudioPlayer
  };

})();

try {
  (function () { // 核心事件

    const {
      $
    } = WebUtilPro;

    MainWindow.wAddSoleEventListener("mousedown", (event) => {
      const TargetElement = event.target;
      event.wEventName = "mousedown";
      {
        { // 触发事件
          if (!TargetElement.w_Event)
            TargetElement.w_Event = () => { }
          TargetElement.w_Event(event);
        }
        { // 是否把事件传递给子级
          if (TargetElement.hasAttribute("WTriggerSon") && TargetElement.firstElementChild) {
            const Str = TargetElement.getAttribute("WTriggerSon");
            let IndexWClickElementFirstElementChild = TargetElement.firstElementChild;

            let event = new MouseEvent('mousedown', {
              bubbles: true,
              cancelable: true,
              view: window
            });
            if (Str === "click") {
              event = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
              });
            }
            if (IndexWClickElementFirstElementChild.tagName.toLowerCase() === "input") {
              IndexWClickElementFirstElementChild.focus();
            }
            IndexWClickElementFirstElementChild.dispatchEvent(event);
          }
        }
        {
          if (WClickElement !== TargetElement) {
            WClickElementCount = 1;
            // 移除其他的 WClick
            $(".WClick").forEach(e => {
              e.parentNode.classList.remove("WClickParent");
              e.parentNode.removeAttribute("WClickParent");
              e.classList.remove("WClick");
              e.removeAttribute("WClick");
            });
            // 设置点击元素的 WClick 属性
            TargetElement.classList.add("WClick");
            TargetElement.setAttribute("WClick", "");
            TargetElement.parentNode.classList.add("WClickParent");
            TargetElement.parentNode.setAttribute("WClickParent", "");

            WClickElement = TargetElement;
          } else WClickElementCount++;
        }
        { // 删除元素
          const wDelElement = TargetElement.getAttribute("WDelElement");
          switch (wDelElement) {
            case "{parent}":
              TargetElement.parentNode.remove();
              break;
            case "{this}":
              TargetElement.remove();
              break;
            default:
              break;
          }
        }
      }
    });
    MainWindow.wAddSoleEventListener("click", (event) => {
      const TargetElement = event.target;
      event.wEventName = "click";
      {
        { // 触发事件
          if (!TargetElement.w_Event)
            TargetElement.w_Event = () => { }
          TargetElement.w_Event(event);
        }
      }
    });
    MainWindow.wAddSoleEventListener("input", (event) => {
      const TargetElement = event.target;
      event.wEventName = "input";
      {
        { // 触发事件
          if (!TargetElement.w_Event)
            TargetElement.w_Event = () => { }
          TargetElement.w_Event(event);
        }
        {
          if (TargetElement.value && TargetElement.value.trim() != "") {
            TargetElement.setAttribute("WValue", "");
          } else {
            TargetElement.removeAttribute("WValue");
          }
        }
      }
    });
    MainWindow.wAddSoleEventListener("mouseover", (event) => {
      const TargetElement = event.target;
      event.wEventName = "mouseover";
      {
        { // 触发事件
          if (!TargetElement.w_Event)
            TargetElement.w_Event = () => { }
          TargetElement.w_Event(event);
          WMouseElement = TargetElement;
        }
      }
    });
    MainWindow.wAddSoleEventListener("dblclick", (event) => {
      const TargetElement = event.target;
      event.wEventName = "dblclick";
      {
        { // 触发事件
          if (!TargetElement.w_Event)
            TargetElement.w_Event = () => { }
          TargetElement.w_Event(event);
          WMouseElement = TargetElement;
        }
      }
    });

    Object.freeze(_WebUtilPro_place);
    Object.freeze(_WebUtilPro_direction);
    Object.freeze(_WebUtilPro_input_type);
    Object.freeze(_WebUtilPro_event_level);
    Object.freeze(_WebUtilPro_window_operation);
    Object.freeze(_WebUtilPro_window_model);
    Object.freeze(_WebUtilPro_event);

  })();
} catch (error) {
  console.error(error);
}
// WebUtilPro SQJM 2023