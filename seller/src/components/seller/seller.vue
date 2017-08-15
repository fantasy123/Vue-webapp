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
      </div>
      <split></split>
      <div class="bulletin">
        <h1 class="title">公告与活动</h1>
        <div class="content-wrapper border-1px">
          <p class="content">{{seller.bulletin}}</p>
        </div>
      </div>
      <ul v-if="seller.supports" class="supports">
        <li v-for="item in seller.supports" class="support-item border-1px">
          <span class="icon" :class="classMap[item.type]"></span>
          <!--item是对象数组seller.supports里的对象,第一个键type是索引。classMap是索引-类名数组,不同的类名对应不同的icon背景图-->
          <span class="text">{{item.description}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import star from 'components/star/star';
  import split from 'components/split/split';
  import BScroll from 'better-scroll';

  export default {
    props: {
      seller: { // 从router-view接收过来
        type: Object
      }
    },
    created() {
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']; // 索引-类名数组

      this.$nextTick(() => {
        this.scroll = new BScroll(this.$refs.seller, {
          click: true
        });
      });
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
      padding: 0 18px
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
</style>
