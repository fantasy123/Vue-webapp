export function formatDate(date, fmt) {  // 暴露一个函数 接收时间戳和时间格式字符串
  // 原理:把传进去的yyyy-MM-dd hh:mm 用时间戳通过Date方法拆解出来的年月日时分秒逐步替换
  // 先替换年 年份比较特殊 单独写匹配 可能为4位 也可能为2位
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length)); // RegExp.$1是第一个匹配到的子匹配
    // 如果是yy 那么截最后2位 如果是yyyy 那么取整4位
  }

  // 其余用2位表示即可
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes()
  };

  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) { //  构造正则表达式
      let str = o[k] + '';
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
    }
  }

  return fmt;
}

function padLeftZero(str) { // 给要求是2位的字符串左边加0
  return ('00' + str).substr(str.length);
}

