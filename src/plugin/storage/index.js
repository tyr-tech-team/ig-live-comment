// key對應表
export const keys = {
  theme: "THEME", // @param object，主題
  countdonw: "COUNTDONW", // 計時器資訊
  productCard: "PRODUCTCARD", // 商品卡片資訊
  commentsHistory: "COMMENTSHISTORY", // 留言列表
};

// 設定項目
export const Set = function (key, valueObj) {
  console.log("set", key);
  try {
    const _data = JSON.stringify(valueObj);
    localStorage.setItem(key, _data);
    return true;
  } catch (error) {
    return false;
  }
};

// 提取項目
export const Get = function (key = "") {
  try {
    const _data = localStorage.getItem(key);
    return JSON.parse(_data);
  } catch (error) {
    return undefined;
  }
};

// 清除項目
export const Remove = function (key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    return false;
  }
};

// 清除項目
export const RemoveAll = function () {
  try {
    localStorage.clear(); // 全清
  } catch (error) {
    return false;
  }
};
