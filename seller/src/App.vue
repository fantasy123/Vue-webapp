<template>
  <div>
    <v-header :seller="seller"></v-header>
    <div class="tab border-1px">
      <div class="tab-item">
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings">评论</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
      </div>
    </div>

    <!--路由外链-->
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import header from 'components/header/header.vue';

  const ERR_OK = 0;

  export default {
    data() { // data必须是函数
        return {
            seller: {} // 给app.vue定义一个seller对象来接收ajax返回值并传递给子组件供其渲染
        };
    },
    created() { // Vue生命周期
      this.$http.get('/api/seller').then((response) => { // 通过header组件的父组件App来发送ajax请求,再通过prop传递给header mock数据一定会成功,所以只写成功回调
          response = response.body; // 要转化成对象的形式

          if (response.errno === ERR_OK) {
              this.seller = response.data;
          }
      });
    },
    components: {
      'v-header': header
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "./common/stylus/mixin.styl"

  .tab
    display: flex
    height: 40px
    line-height: 40px
    border-1px(rgba(7,17,27,0.1))
    .tab-item
      flex:1
      text-align center
      &>a
        display: block
        font-size: 14px
        color: rgb(77,85,93)
        &.active
          color:rgb(240,20,20)
</style>

