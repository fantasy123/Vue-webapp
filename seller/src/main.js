// 项目入口JS,用于向index里动态插入资源
import Vue from 'vue';// 全局依赖Vue
import VueRouter from 'vue-router'; // 选项卡切换
import VueResource from 'vue-resource'; // 从后端(mock)获取数据
import App from './App';  // 顶层组件

// 引入三个次级组件
import goods from 'components/goods/goods';
import ratings from 'components/ratings/ratings';
import seller from 'components/seller/seller';

// 引入全局出口样式,webpack特性,可以在JS里依赖样式,从而加载公共样式
import 'common/stylus/index.styl';

Vue.use(VueRouter);// 全局注册并安装路由插件
Vue.use(VueResource);// 全局注册并安装取数据插件

// 定义路由 实例化router
var router = new VueRouter({
  routes: [// 取代map 建立路径和组件的对应关系
    {path: '/goods', component: goods},
    {path: '/ratings', component: ratings},
    {path: '/seller', component: seller}
  ],
  linkActiveClass: 'active'
});

/* eslint-disable no-new */
new Vue({ // 全局Vue实例
  el: '#app',
  router: router, // 初始化路由
  components: { App },  // 声明顶层组件
  template: '<App/>'
});

// router.push('/goods'); // 无论在哪个router-view下 一旦刷新 就会调用这句 去到第一个选项卡 并移除rating组件
// 和seller组件的DOM 再执行nextTick的时候 就找不到被移除组件的DOM了 可能会初始化失败

Vue.config.productionTip = false;
