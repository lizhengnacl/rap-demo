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
 */

/**
 * 根据配置执行元素操作
 * @param {ElementConfig} config - 元素配置对象
 * @returns {Promise<boolean>} - 返回一个 Promise，成功执行操作返回 true，未找到元素或执行失败返回 false
 */
async function performActionByConfig(config) {
  const { selector, type, value = "" } = config;
  return findAndPerformActionByType(selector, type, value);
}

/**
 * 批量执行元素操作
 * @param {ElementConfig[]} configs - 元素配置对象数组
 * @returns {Promise<boolean[]>} - 返回一个 Promise，包含每个操作的执行结果
 */
async function performActionsByConfigs(configs) {
  return Promise.all(configs.map((config) => performActionByConfig(config)));
}

/**
 * 配置文件实例，展示如何使用 ElementConfig 类型配置元素操作
 */
const configExamples = [
  {
    selector: "#login-button",
    type: ElementActionType.CLICK,
  },
  {
    selector: "#username-input",
    type: ElementActionType.INPUT,
    value: "testUser",
  },
  {
    selector: "#password-input",
    type: ElementActionType.INPUT,
    value: "testPassword",
  },
  {
    selector: "#welcome-message",
    type: ElementActionType.READ_TEXT,
  },
  {
    selector: "#search-input",
    type: ElementActionType.FOCUS,
  },
];

// 使用示例
(async () => {
  const results = await performActionsByConfigs(configExamples);
  console.log("操作执行结果:", results);
})();
