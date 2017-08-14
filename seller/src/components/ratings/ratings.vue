<template>
  <div class="ratings">
    <div class="ratings-content">
      <div class="overview">
        <div class="overview-l">
          <h1 class="score">{{seller.score}}</h1>
          <div class="title">综合评分</div>
          <div class="rank">高于周边商家{{seller.rankRate}}%</div>
        </div>
        <div class="overview-r">
          <div class="score-wrapper">
            <span class="title">服务态度</span>
            <star :size="36" :score="seller.serviceScore"></star>
            <span class="score">{{seller.serviceScore}}</span>
          </div>
          <div class="score-wrapper">
            <span class="title">商品评分</span>
            <star :size="36" :score="seller.foodScore"></star>
            <span class="score">{{seller.foodScore}}</span>
          </div>
          <div class="delivery-wrapper">
            <span class="title">送达时间</span>
            <span class="delivery">{{seller.deliveryTime}}分钟送达</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import star from 'components/star/star';

  export default {
      // router-view传seller rating组件接收
    props: {
        seller: {
            type: Object
        }
    },
    components: {
        star
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .ratings
    position: absolute
    top: 174px  // 去掉头部和tab
    bottom:46px
    width: 100%
    overflow: hidden
    .overview
      display: flex
      padding: 18px 0
      .overview-l
        flex: 0 0 137px // 左边定宽
        padding: 6px 0
        width: 137px
        border-right: 1px solid rgba(7,17,27,0.1)
        text-align: center
        .score
          margin-bottom: 6px
          line-height: 28px
          font-size: 24px
          color: rgb(255,153,0)
        .title
          margin-bottom: 8px
          line-height: 12px
          font-size: 12px
          color: rgb(7,17,27)
        .rank
          line-height: 10px
          font-size: 10px
          color: rgb(147,153,159)
      @media only screen and (max-width: 320px)
        .overview-l
          flex: 0 0 120px
          width: 120px
      .overview-r
        flex: 1 // 右边自适应
        padding: 6px 0 6px 24px
        .score-wrapper
          margin-bottom: 8px
          font-size: 0
          .title
            display: inline-block
            vertical-align: top
            font-size: 12px
            line-height: 18px
            color: rgb(7,17,27)
          .star
            display: inline-block
            vertical-align: top
            margin: 0 12px
          .score
            display: inline-block
            vertical-align: top
            font-size: 12px
            line-height: 18px
            color: rgb(255,153,0)
        .delivery-wrapper
          font-size: 0
          .title
            font-size: 12px
            line-height: 18px
            color: rgb(7,17,27)
          .delivery // 都是文字的情况下 vertical-align不用设置 垂直方向默认是对齐的 文字和图片才要设置
            font-size: 12px
            margin-left: 12px
            color: rgb(147,153,159)
      @media only screen and (max-width: 320px)
        .overview-r
          padding-left: 6px
  /*.ratings-content*/
</style>
