export function formatDate(date, fmt) {  // 暴露一个函数 接收一个Date类型的对象(时间戳转化而来)和时间格式字符串
  // 原理:把传进去的yyyy-MM-dd hh:mm(时间格式字符串) 用Date类型对象通过内置方法拆解出来的年月日对应的真实数据逐步替换
  // 年份比较特殊 单独写匹配 可能为4位(2017) 也可能为2位(17)
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length)); // RegExp.$1是第一个匹配到的子匹配
    // 如果是yy 那么截最后2位 如果是yyyy 那么取整4位
  }

  // 其余用2位表示即可 这个对象对应的是每一个正则表达式应该替换的内容
  let o = {
    'M+': date.getMonth() + 1,  // 月份时间格式特殊
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes()
  };

  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) { //  通过遍历动态构造正则表达式
      let str = o[k] + '';
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
      // RegExp.$1.length是匹配的字符串长度。如果是1，那么要求1位，直接替换。如果是2，那么要求2位，缺的补0替换 RegExp(regular exp)
    }
  }

  return fmt; // 所有时间位替换完成的结果
}

function padLeftZero(str) { // 给要求是2位的字符串左边加0
  return ('00' + str).substr(str.length);
}

