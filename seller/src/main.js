// 项目入口JS,用于向index里动态插入资源
import Vue from 'vue';// 全局依赖Vue
import App from './App'; // 页面根元素#app的模板

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app', // 页面容器
  template: '<App/>', // 等价于直接在index里写<App></App>
  components: { App }// 注册App这个组件 使得index里可以直接用<App></App>
});
