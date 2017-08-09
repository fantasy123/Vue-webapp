<template>
  <transition name="move">
    <div v-show="showFlag" class="food" ref="food">
      <!--挂在视口层上,BS给内容层加滚动动画-->
      <div class="food-content">
        <div class="image-header">
          <!--头图不能写死高度(宽高相等,根据屏幕宽度自适应) 不写高度,加载图片会有抖动-->
          <img :src="food.image">
          <div class="back" @click="hide">
            <i class="icon-arrow_lift"></i>
          </div>
        </div>
        <div class="content">
          <h1 class="title">{{food.name}}</h1>
          <div class="detail">
            <span class="sell-count">月售{{food.sellCount}}份</span>
            <span class="rating">好评率{{food.rating}}%</span>
          </div>
          <div class="price">
            <span class="now">¥{{food.price}}</span><span class="old" v-show="food.oldPrice">¥{{food.oldPrice}}</span>
          </div>
          <div class="cartcontrol-wrapper">
            <cartcontrol :food="food"></cartcontrol>
          </div>
          <transition name="fade">
            <div class="buy" v-show="!food.count || food.count === 0" @click.stop.default="addFirst($event)">加入购物车</div>
          </transition>
          <!--点它可以操作food.count,同时它的显示也依赖于food.count-->
        </div>
        <split v-if="food.info"></split>
        <!--跟下面的商品介绍是相互依存的,没有商品介绍空有一个分割线是非常奇怪的-->
        <div class="info" v-if="food.info">
          <h1 class="title">商品介绍</h1>
          <p class="text">{{food.info}}</p>
        </div>
        <split></split>
        <div class="rating">
          <h1 class="title">商品评价</h1>
          <ratingselect :ratings="food.ratings" :selectType="selectType" :onlyContent="onlyContent" :desc="desc"></ratingselect>
          <!--ratings属性通过遍历得到(不是在下方定义的)-->
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';  // 这个长页面会超出屏幕高度
  import cartcontrol from 'components/cartcontrol/cartcontrol';
  import Vue from 'vue';  // 后面需要用到Vue.set方法
  import split from 'components/split/split';
  import ratingselect from 'components/ratingselect/ratingselect';

  //  const POSITIVE = 0;
  //  const NEGATIVE = 1;
  const ALL = 2;

  export default {
      props: {
          food: {
              type: Object  // goods组件传来,保存当前选中的food
          }
      },
      data() {
          return {
            showFlag: false, // 需要在data里去观测showFlag的变化
            // 挂一些对需要传给ratingselect组件props属性的变量的依赖跟踪
            selectType: ALL,
            onlyContent: true, // 跟子组件的默认值不同,体现改变
            desc: { // 跟子组件的默认值不同,体现改变
              all: '全部',
              positive: '推荐',
              negative: '吐槽'
            }
            // ratings数组读取该food的ratings属性
          };
      },
      methods: {  // 父组件可以调用子组件方法 反之则不行(这个show方法是供goods组件来调用的)
          show: function () { // 以下划线开头的方法,一般作为组件私有方法 没有下划线的方法是可能被外部调用的方法
            this.showFlag = true; // 父组件点击food列表来调用

            // 食品页展现的时候初始化一些对评论区块的设置
            this.selectType = ALL;  //  全部选择
            this.onlyContent = true;  // 只显示有内容的评论

            // 这个页面被展示=>计算页面高度,初始化better-scroll
            this.$nextTick(() => {
              if (!this.scroll) {
                this.scroll = new BScroll(this.$refs.food, {
                  click: true
                });
              } else {
                this.scroll.refresh();
              }
            });
          },
          hide: function () {
            this.showFlag = false;
          },
          addFirst: function (event) {  // food可以不传,因为全局维护 event必须传 要做点击筛选
            if (!event._constructed) {
                return; // better-scroll上的点击事件都要去除原生点击
            }
            Vue.set(this.food, 'count', 1); // count这个属性可能为0 也可能不存在

            // 不同的组件操作同一组数据 然后各自读取这组数据来填充自己的内容、影响自身DON 所以组件状态可以保持一致
          }
      },
      components: {
          cartcontrol,
          split,
          ratingselect
      }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .food
    position: fixed
    z-index: 30 // 在购物车组件和已选商品列表的下面
    top: 0
    left: 0
    bottom: 48px  // 让出购物车组件的高度
    width: 100%
    background: #fff
    transform: translate3d(0,0,0) // 结束状态 覆盖屏幕
    .food-content
      .image-header
        position: relative
        width: 100% // 自适应屏幕宽度
        height: 0 // 高度由padding撑开
        padding-bottom: 100% // padding百分比根据盒子宽度来算,保证了这个盒子是正方形
        img // 让图片去适应容器
          position: absolute
          top: 0
          left: 0
          width: 100%
          height: 100%
        .back
          position: absolute
          top: 10px
          left: 0
          .icon-arrow_lift
            display: block // 为了设置padding
            padding: 10px  // 增大点击区域
            font-size: 20px
            color: #fff
      .content
        position: relative
        padding: 18px
        .title
          line-height: 14px
          color: rgb(7,17,27)
          font-size: 14px
          font-weight: 700
          margin-bottom: 8px
        .detail
          height: 10px
          margin-bottom: 18px
          line-height: 10px
          font-size: 0
          .sell-count, .rating
            font-size: 10px
            color: rgb(147,153,159)
          .sell-count
            margin-right: 12px
        .price
          font-weight: 700
          line-height: 24px
          .now
            margin-right: 8px
            font-size: 14px
            color: rgb(240,20,20)
          .old
            text-decoration: line-through
            font-size: 10px
            color: rgb(147,153,159)
        .cartcontrol-wrapper
          position: absolute
          right: 12px
          bottom: 12px  // 有6px的padding
        .buy
          position: absolute
          right: 18px
          bottom: 18px
          z-index: 10   // 要盖在cartcontrol上
          font-size: 10px
          height: 24px
          line-height: 24px
          padding: 0 12px
          box-sizing: border-box
          border-radius: 12px
          background: rgb(0,160,220)
          color: #fff
        .fade-enter-active, .fade-leave-active
          transition: all 0.2s
        .fade-enter, .fade-leave-to
          opacity: 0
      .info
        padding: 18px
        .title
          font-size: 14px
          line-height: 14px
          margin-bottom: 6px
          color: rgb(7,17,27)
        .text
          font-size: 12px
          line-height: 24px
          padding: 0 8px
          color: rgb(77,85,93)
      .rating
        padding-top: 18px
        .title
          font-size: 14px
          line-height: 14px
          margin-left: 18px
          color: rgb(7,17,27)
  // food的缓动样式
  .move-enter-active, .move-leave-active
    transition: all 0.2s linear
  .move-enter, .move-leave-to
    transform: translate3d(100%,0,0)  // 初始状态 藏在屏幕右边
</style>
