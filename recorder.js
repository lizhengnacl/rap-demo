/**
 * 配置文件实例，展示如何使用 ElementConfig 类型配置元素操作
 * 除了元素选择器、操作类型，还抽象了等待时间、重试次数和错误处理行为
 */

/**
 * 录制器类，支持在页面可视化录制配置
 */
class VisualRecorder {
  constructor() {
    this.recordedConfig = [];
    this.eventListeners = {};
    // 添加一个标志位，用于标记是否是第一次点击
    this.isFirstClick = true;
  }

  /**
   * 初始化录制器，添加页面事件监听
   */
  startRecording() {
    // 监听点击事件
    this._addEventListener("click", this._handleClick);
    // 监听输入事件
    this._addEventListener("input", this._handleInput);
    // 监听聚焦事件
    this._addEventListener("focus", this._handleFocus);
  }

  /**
   * 停止录制，移除页面事件监听
   */
  stopRecording() {
    Object.keys(this.eventListeners).forEach((eventType) => {
      document.removeEventListener(eventType, this.eventListeners[eventType]);
    });
    this.eventListeners = {};
  }

  /**
   * 获取录制的配置
   * @returns {Array} 录制的配置数组
   */
  getRecordedConfig() {
    return this.recordedConfig;
  }

  /**
   * 添加事件监听器
   * @param {string} eventType - 事件类型
   * @param {Function} handler - 事件处理函数
   */
  _addEventListener(eventType, handler) {
    const boundHandler = handler.bind(this);
    document.addEventListener(eventType, boundHandler);
    this.eventListeners[eventType] = boundHandler;
  }

  /**
   * 处理点击事件
   * @param {Event} event - 点击事件对象
   */
  _handleClick(event) {
    // 如果是第一次点击，不记录配置并将标志位设为 false
    if (this.isFirstClick) {
      this.isFirstClick = false;
      return;
    }
    const element = event.target;
    const selector = this._getElementSelector(element);
    const config = {
      selector,
      type: ElementActionType.CLICK,
      waitBefore: 200,
      retries: 2,
      onError: (error) => console.error(`点击 ${selector} 失败:`, error),
    };
    this.recordedConfig.push(config);
  }

  /**
   * 处理输入事件
   * @param {Event} event - 输入事件对象
   */
  _handleInput(event) {
    const element = event.target;
    const selector = this._getElementSelector(element);
    const config = {
      selector,
      type: ElementActionType.INPUT,
      value: element.value,
      waitBefore: 200,
      retries: 2,
      onError: (error) => console.error(`输入到 ${selector} 失败:`, error),
    };
    this.recordedConfig.push(config);
  }

  /**
   * 处理聚焦事件
   * @param {Event} event - 聚焦事件对象
   */
  _handleFocus(event) {
    const element = event.target;
    const selector = this._getElementSelector(element);
    const config = {
      selector,
      type: ElementActionType.FOCUS,
      waitBefore: 200,
      retries: 2,
      onError: (error) => console.error(`聚焦 ${selector} 失败:`, error),
    };
    this.recordedConfig.push(config);
  }

  /**
   * 获取元素的选择器
   * @param {HTMLElement} element - DOM 元素
   * @returns {string} 元素选择器
   */
  _getElementSelector(element) {
    if (element.id) {
      return `#${element.id}`;
    }
    // 这里可以添加更多选择器生成逻辑，当前仅返回 id 选择器
    return "";
  }
}

// 示例使用
// const recorder = new VisualRecorder();
// recorder.startRecording();

// 这里可以添加停止录制的逻辑，例如在某个按钮点击时停止
// recorder.stopRecording();
// const configExamples = recorder.getRecordedConfig();

// // 保留原有的配置示例作为参考
// const configExamples = [
//   {
//     selector: "#login-button",
//     type: ElementActionType.CLICK,
//     waitBefore: 1000, // 执行操作前等待 1 秒
//     retries: 3, // 失败时重试 3 次
//     onError: (error) => console.error("点击登录按钮失败:", error), // 错误处理函数
//   },
//   {
//     selector: "#username-input",
//     type: ElementActionType.INPUT,
//     value: "testUser",
//     waitBefore: 500, // 执行操作前等待 0.5 秒
//     retries: 2, // 失败时重试 2 次
//     onError: (error) => console.error("输入用户名失败:", error), // 错误处理函数
//   },
//   {
//     selector: "#password-input",
//     type: ElementActionType.INPUT,
//     value: "testPassword",
//     waitBefore: 500, // 执行操作前等待 0.5 秒
//     retries: 2, // 失败时重试 2 次
//     onError: (error) => console.error("输入密码失败:", error), // 错误处理函数
//   },
//   {
//     selector: "#welcome-message",
//     type: ElementActionType.READ_TEXT,
//     waitBefore: 2000, // 执行操作前等待 2 秒
//     retries: 1, // 失败时重试 1 次
//     onError: (error) => console.error("读取欢迎消息失败:", error), // 错误处理函数
//   },
//   {
//     selector: "#search-input",
//     type: ElementActionType.FOCUS,
//     waitBefore: 300, // 执行操作前等待 0.3 秒
//     retries: 2, // 失败时重试 2 次
//     onError: (error) => console.error("聚焦搜索框失败:", error), // 错误处理函数
//   },
// ];
