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
    <router-view :seller="seller" keep-alive></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import header from 'components/header/header.vue';
  import {urlParse} from 'common/js/util';

  const ERR_OK = 0;

  export default {
    data() { // data必须是函数
        return {
            seller: {
              id: (() => {  // 立即执行函数
                let queryParam = urlParse();  // 调用urlParse方法(一个模块)
                return queryParam.id; // 返回一个queryParam对象,得到其中的id
              })()  // id绑定到seller.id,vue-resource请求的时候传到url里面作为一个筛选参数向后端发送请求
            } // 给app.vue定义一个seller对象来接收ajax返回值并传递给子组件供其渲染
        };
    },
    created() { // 向后端读数据的时候多传一个商家id
      this.$http.get('/api/seller?id=' + this.seller.id).then((response) => { // 通过header组件的父组件App来发送ajax请求,再通过prop传递给header mock数据一定会成功,所以只写成功回调
          response = response.body; // 要转化成对象的形式

          if (response.errno === ERR_OK) {
              // data里不包含id,会丢失,需要给它新增一个id属性 Vue推荐的给对象扩展属性的方法
              this.seller = Object.assign({}, this.seller, response.data); // 相当于extend方式扩展this.seller的属性 结果赋值给{} 再返回给this.seller
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

