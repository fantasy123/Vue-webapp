<template>
  <div class="seller" ref="seller">
    <div class="seller-content">
      <div class="overview">
        <h1 class="title">{{seller.name}}</h1>
        <div class="desc border-1px">
          <star :size="36" :score="seller.score"></star>
          <span class="text">({{seller.ratingCount}})</span>
          <span class="text">月售{{seller.sellCount}}单</span>
        </div>
        <ul class="remark">
          <li class="block">
            <h2>起送价</h2>
            <div class="content">
              <span class="stress">{{seller.minPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <h2>商家配送</h2>
            <div class="content">
              <span class="stress">{{seller.deliveryPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <h2>平均配送时间</h2>
            <!--这里的数据跟商家弹层一样-->
            <div class="content">
              <span class="stress">{{seller.deliveryTime}}</span>分钟
            </div>
          </li>
        </ul>
        <div class="favorite" @click="toggleFavorite($event)">
          <span class="icon-favorite" :class="{'active': favorite}"></span>
          <span class="text">{{favoriteText}}</span>
        </div>
      </div>
      <split></split>
      <div class="bulletin">
        <h1 class="title">公告与活动</h1>
        <div class="content-wrapper border-1px">
          <p class="content">{{seller.bulletin}}</p>
        </div>
        <ul v-if="seller.supports" class="supports">
          <li v-for="item in seller.supports" class="support-item border-1px">
            <span class="icon" :class="classMap[item.type]"></span>
            <!--item是对象数组seller.supports里的对象,第一个键type是索引。classMap是索引-类名数组,不同的类名对应不同的icon背景图-->
            <span class="text">{{item.description}}</span>
          </li>
        </ul>
      </div>
      <split></split>
      <div class="pics">
        <h1 class="title">商家实景</h1>
        <div class="pic-wrapper" ref="picWrapper">
          <ul class="pic-list" ref="picList">
            <!--ul超出pic-wrapper宽度才会滚动-->
            <li class="pic-item" v-for="pic in seller.pics">
              <img :src="pic" width="120" height="90">
            </li>
          </ul>
        </div>
      </div>
      <split></split>
      <div class="info">
        <h1 class="title border-1px">商家信息</h1>
        <ul>
          <li v-for="info in seller.infos" class="info-item">{{info}}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import star from 'components/star/star';
  import split from 'components/split/split';
  import BScroll from 'better-scroll';
  import {saveToLocal, loadFromLocal} from 'common/js/store';

  export default {
    props: {
      seller: { // 从router-view接收过来
        type: Object
      }
    },
    data() {
      return {
        favorite: (() => {
          return loadFromLocal(this.seller.id, 'favorite', false);
        })() // 这里不能写死 要从本地缓存里去读
      };
    },
    watch: {  // 页面刷新对应watch seller(异步获取) tab切换对应mounted重新准备DOM 在这两个hook里面都要调用_initScroll
      'seller'() {  // seller是异步获取 后端请求到seller数据时 seller发生变化 调用_initScroll
        this._initScroll(); // 只有刷新页面 请求后端数据的时候 seller才会改变 从其他tab切过来(替换router-view的DOM) seller数据并不会发生变化 BS不会被初始化
        this._initPicScroll();
      }
    },
    created() {
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']; // 索引-类名数组
    },
    mounted () {  // 替换 vue 1.0 的ready函数,不能保证DOM渲染完成,所以仍需vm.$nextTick
      this._initScroll(); // mouted在watch之前执行

      // 默认ul宽度和外层pic-wrapper是一样的 我们需要手动去设置ul的宽度 使他超出外层
      this._initPicScroll();
    }, // 顺序是先DOM再数据(回调)
    computed: {
      favoriteText(ev) {
          return this.favorite ? '已收藏' : '收藏';
      }
    },
    methods: {
      _initScroll: function () {  // 抽象成一个方法
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.seller, {
              click: true
            });
          } else {
            this.scroll.refresh();
          }
        });
      },
      _initPicScroll: function () {
        if (this.seller.pics) { // seller是异步获取 所以pics不一定有值 需要在watch这个hook里写一遍
          let picWidth = 120;
          let margin = 6;
          let width = this.seller.pics.length * (picWidth + margin) - margin; // 计算ul宽度
          this.$refs.picList.style.width = width + 'px';  // 设置ul宽度 超出wrapper

          // 初始化better-scroll
          this.$nextTick(() => {
            if (!this.picScroll) {
              this.picScroll = new BScroll(this.$refs.picWrapper, {
                scrollX: true,
                eventPassthrough: 'vertical'  // 忽略纵向滚动
              });
            } else {
              this.picScroll.refresh();
            }
          });
        }
      },
      toggleFavorite: function (ev) {
        if (!ev._constructed) {
          return;
        }

        this.favorite = !this.favorite;
        // 点选收藏按钮的时候 当前的favorite缓存到localStrorage里
        // 不能直接localStorage.favotite = this.favorite 因为要关联商家id(App.vue组件传下来)
        saveToLocal(this.seller.id, 'favorite', this.favorite); // 无论是false或是true 都会存到localStorage里 以供读取
      }
    },
    components: {
      star,
      split
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"

  .seller
    position: absolute
    width: 100%
    top: 174px
    bottom: 0
    overflow: hidden
    .overview
      position: relative
      padding: 18px
      .title
        font-size: 14px
        margin-bottom: 8px
        line-height: 14px
        color: rgb(7,17,27)
      .desc
        padding-bottom: 18px
        font-size: 0
        border-1px(rgba(7,17,27,0.1))
        .star
          display: inline-block
          vertical-align: top
          margin-right: 8px
        .text
          position: relative
          bottom: 2px
          display: inline-block
          vertical-align: top
          margin-right: 12px
          line-height: 18px
          font-size: 10px
          color: rgb(77,85,93)
      .remark
        display: flex
        padding-top: 18px
        .block
          flex: 1
          text-align: center
          border-right: 1px solid rgba(7,17,27,0.1)
          h2
            margin-bottom: 4px
            line-height: 10px
            font-size: 10px
            color: rgb(147,153,159)
          .content
            line-height: 24px
            font-size: 10px
            color: rgb(7,17,27)
            font-weight: 700
            .stress
              font-size: 24px
          &:last-child
            border-right:none
      .favorite
        position: absolute
        right: 11px
        top: 18px
        width: 50px
        text-align: center
        .icon-favorite
          display: block
          margin-bottom: 4px
          font-size: 24px
          line-height: 24px
          color: #d4d6d9
          &.active
            color: rgb(240,20,20)
        .text
          font-size: 10px
          line-height: 10px
          color: rgb(77,85,93)
    .bulletin
      padding: 18px 18px 0 18px
      .title
        font-size: 14px
        margin-bottom: 8px
        line-height: 14px
        color: rgb(7,17,27)
      .content-wrapper
        padding: 0 12px 16px 12px
        border-1px(rgba(7,17,27,0.1))
        .content
          line-height: 24px
          font-size: 12px
          color: rgb(240,20,20)
      .supports
        .support-item
          padding: 16px 12px
          font-size: 0
          border-1px(rgba(7,17,27,0.1))
          &:last-child
            border-none()
          .icon // 规定背景图的一些通用样式
            display: inline-block
            vertical-align: top
            width: 16px
            height: 16px
            margin-right: 6px
            background-size:16px 16px
            background-repeat:no-repeat
            &.decrease  // 第二个类名决定具体的URL
              bg-image('decrease_4')
            &.discount
              bg-image('discount_4')
            &.guarantee
              bg-image('guarantee_4')
            &.invoice
              bg-image('invoice_4')
            &.special
              bg-image('special_4')
          .text
            font-size: 12px
            line-height:16px
            color: rgb(7,17,27)
    .pics
      padding: 18px
      .title
        font-size: 14px
        margin-bottom: 12px
        line-height: 14px
        color: rgb(7,17,27)
      .pic-wrapper
        width: 100%
        overflow: hidden
        white-space: nowrap // 图片不会折行
        .pic-list
          font-size: 0
          .pic-item
            display: inline-block
            margin-right: 6px
            width: 120px
            height: 90px
            &:last-child
              margin-right: 0
    .info
      padding: 18px 18px 0 18px
      color: rgb(7,17,27)
      .title
        font-size: 14px
        padding-bottom: 12px
        line-height: 14px
        border-1px(rgba(7,17,27,0.1))
      .info-item
        line-height: 16px
        padding: 16px 12px
        border-1px(rgba(7,17,27,0.1))
        font-size: 12px
        &:last-child
          border-none()
</style>
