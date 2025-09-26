/**
 * 找到页面中的元素并执行指定操作
 * @param {string} selector - 用于查找元素的选择器
 * @param {function} action - 要在元素上执行的操作函数，常见类型如：
 *                            - 点击操作: (el) => el.click()
 *                            - 输入操作: (el) => el.value = '输入内容'
 *                            - 聚焦操作: (el) => el.focus()
 *                            - 读取文本: (el) => console.log(el.textContent)
 * @returns {Promise<boolean>} - 返回一个 Promise，成功执行操作返回 true，未找到元素或执行失败返回 false
 */
async function findAndPerformAction(selector, action) {
  try {
    const element = document.querySelector(selector);
    if (element) {
      await action(element);
      return true;
    }
    return false;
  } catch (error) {
    console.error("执行元素操作时出错:", error);
    return false;
  }
}

/**
 * 定义元素操作类型枚举
 */
const ElementActionType = {
  CLICK: "click",
  INPUT: "input",
  FOCUS: "focus",
  READ_TEXT: "readText",
};

/**
 * 根据操作类型生成对应的操作函数
 * @param {ElementActionType} type - 操作类型
 * @param {string} [value] - 输入值，仅在输入操作时需要
 * @returns {function} 操作函数
 */
function generateActionByType(type, value = "") {
  switch (type) {
    case ElementActionType.CLICK:
      return (el) => el.click();
    case ElementActionType.INPUT:
      return (el) => {
        el.value = value;
      };
    case ElementActionType.FOCUS:
      return (el) => el.focus();
    case ElementActionType.READ_TEXT:
      return (el) => console.log(el.textContent);
    default:
      throw new Error(`不支持的操作类型: ${type}`);
  }
}

/**
 * 找到页面中的元素并根据操作类型执行操作
 * @param {string} selector - 用于查找元素的选择器
 * @param {ElementActionType} type - 操作类型
 * @param {string} [value] - 输入值，仅在输入操作时需要
 * @returns {Promise<boolean>} - 返回一个 Promise，成功执行操作返回 true，未找到元素或执行失败返回 false
 */
async function findAndPerformActionByType(selector, type, value = "") {
  const action = generateActionByType(type, value);
  return findAndPerformAction(selector, action);
}

/**
 * 定义元素配置接口
 * @typedef {Object} ElementConfig
 * @property {string} selector - 用于查找元素的选择器
 * @property {ElementActionType} type - 操作类型
 * @property {string} [value] - 输入值，仅在输入操作时需要
 * @property {number} [waitBefore] - 执行操作前等待的时间(毫秒)
 * @property {number} [retries] - 失败时重试的次数
 * @property {function} [onError] - 错误处理函数
 */

/**
 * 等待指定时间
 * @param {number} ms - 等待的毫秒数
 * @returns {Promise<void>}
 */
function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 带重试机制执行操作
 * @param {Function} action - 要执行的操作函数
 * @param {number} retries - 重试次数
 * @param {Function} [onError] - 错误处理函数
 * @returns {Promise<boolean>}
 */
async function withRetry(action, retries, onError) {
  let lastError;
  for (let i = 0; i <= retries; i++) {
    try {
      const result = await action();
      if (result) {
        return true;
      }
    } catch (error) {
      lastError = error;
      if (onError) {
        onError(error);
      }
    }
  }
  return false;
}

/**
 * 根据配置执行元素操作
 * @param {ElementConfig} config - 元素配置对象
 * @returns {Promise<boolean>} - 返回一个 Promise，成功执行操作返回 true，未找到元素或执行失败返回 false
 */
async function performActionByConfig(config) {
  const {
    selector,
    type,
    value = "",
    waitBefore = 0,
    retries = 0,
    onError,
  } = config;

  // 执行前等待
  if (waitBefore > 0) {
    await wait(waitBefore);
  }

  // 带重试机制执行操作
  return withRetry(
    async () => findAndPerformActionByType(selector, type, value),
    retries,
    onError
  );
}

/**
 * 批量执行元素操作
 * @param {ElementConfig[]} configs - 元素配置对象数组
 * @returns {Promise<boolean[]>} - 返回一个 Promise，包含每个操作的执行结果
 */
async function performActionsByConfigs(configs) {
  return Promise.all(configs.map((config) => performActionByConfig(config)));
}

// /**
//  * 配置文件实例，展示如何使用 ElementConfig 类型配置元素操作
//  * 除了元素选择器、操作类型，还抽象了等待时间、重试次数和错误处理行为
//  */
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

// // 使用示例
// (async () => {
//   const results = await performActionsByConfigs(configExamples);
//   console.log("操作执行结果:", results);
// })();
