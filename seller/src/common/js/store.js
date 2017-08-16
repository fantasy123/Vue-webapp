/**
 * 通用的数据存取方案
 */
export function saveToLocal(id, key, val) {
  let seller = localStorage.__seller__; // 用一个特殊的标识存储在localStorage里 这里是一个对象

  if (!seller) {  // 没有创建过seller
    seller = {};  // 初始化seller为一个空对象 以便继续扩展
    seller[id] = {};  // 指定商家 再结合后面的键值对存储 一个流程走完
  } else {  // 不是第一次存取 localStorage下已经有一个seller
    seller = JSON.parse(seller);  // 先把已经存好的JSON字符串解析成对象 才能进一步操作
    if (!seller[id]) {  // 没有当前商家
      seller[id] = {};  // 设为一个空对象 以便存储键值对
    }
    // 有seller[id] 就直接执行最后的键值对存储逻辑(else逻辑就不用写了)
    // 有商家就直接存键值对 没有商家就设置一个空对象再存
  }

  seller[id][key] = val;  // 存储键值对-公用逻辑
  localStorage.__seller__ = JSON.stringify(seller); // 把操作后的对象转化成一个JSON字符串存进去(localStorage不允许直接存对象)
}

export function loadFromLocal(id, key, def) {
  let seller = localStorage.__seller__; // 先拿到这个对象

  if (!seller) {
    return def; // 没有存储过seller 直接返回默认值
  } else {  // 有seller 要进一步操作就需要将JSON字符串解析成对象
    let sellerId = JSON.parse(seller)[id];  // 解析成对象之后立即传入id获取商家对象

    if (!sellerId) {  // 不存在该商家
      return def;
    } else {  // 存在该商家
      let result = sellerId[key];
      return result || def; // 不存在key 返回默认值 这是一个缩略版if else
    }
  }
}

