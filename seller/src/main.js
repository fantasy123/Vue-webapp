// 项目入口JS,用于向index里动态插入资源
import Vue from 'vue';// 全局依赖Vue
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import App from './App';

// 引入三个组件
import goods from 'components/goods/goods';
import ratings from 'components/ratings/ratings';
import seller from 'components/seller/seller';

// 引入全局出口样式,webpack特性,可以在JS里依赖样式,从而加载公共样式
import 'common/stylus/index.styl';

Vue.use(VueRouter);// 安装这个插件
Vue.use(VueResource);// 全局注册

// 定义路由 实例化router
var router = new VueRouter({
  routes: [// 取代map
    {path: '/goods', component: goods},
    {path: '/ratings', component: ratings},
    {path: '/seller', component: seller}
  ],
  linkActiveClass: 'active'
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router: router,
  components: { App },
  template: '<App/>'
});

router.push('/goods');

Vue.config.productionTip = false;
