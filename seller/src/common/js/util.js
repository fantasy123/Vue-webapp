/**
 * 解析url参数
 * @example ?id=12345&a=b
 * @return Object {id:12345,a:b}
 */
export function urlParse() {
  let url = window.location.search; // ?id=12345&a=b
  let obj = {};
  let reg = /[?&][^?&]+=[^?&]+/g;
  let arr = url.match(reg); // 匹配到若干个符合要求的子串组成数组
  // ['?id=12345','&a=b']
  if (arr) {
    arr.forEach((item) => {
      let trimHeadStr = item.substr(1); // 'id=12345' 'a=b'
      let tempArr = trimHeadStr.split('='); // ['id','12345'] ['a','b']
      let key = tempArr[0];
      let val = tempArr[1];
      obj[key] = val;
    });

    return obj;
  }
}
