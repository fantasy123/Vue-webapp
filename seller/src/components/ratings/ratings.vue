<template>
  <div class="ratings" ref="ratings">
    <!--在容器上挂钩子-->
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
      <split></split>
      <ratingselect :ratings="ratings" :selectType="selectType" :onlyContent="onlyContent" v-on:selectRatingType="setRatingType" v-on:toggleContent="setBoolContent" v-on:on-select-type-change="onSelectTypeChange" v-on:on-only-content-change="onOnlyContentChange"></ratingselect>
      <!--可以先用data里维护的假数据填充-->
      <div class="rating-wrapper">
        <ul>
          <li v-for="rating in ratings" class="rating-item border-1px" v-show="needShow(rating.rateType,rating.text)">
            <div class="avatar">
              <img width="28" height="28" :src="rating.avatar">
            </div>
            <div class="content">
              <h1 class="name">{{rating.username}}</h1>
              <div class="star-wrapper">
                <star :size="24" :score="rating.score"></star>
                <span class="delivery" v-show="rating.deliveryTime">{{rating.deliveryTime}}分钟送达</span>
              </div>
              <p class="text">{{rating.text}}</p>
              <div class="recommend" v-show="rating.recommend && rating.recommend.length">
                <span class="icon-thumb_up"></span>
                <span v-for="item in rating.recommend" class="item">{{item}}</span>
              </div>
              <div class="time">{{rating.rateTime | formatDate}}</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  // ESlint只针对JS进行校验 对模板不起作用
  import star from 'components/star/star';
  import split from 'components/split/split';
  import ratingselect from 'components/ratingselect/ratingselect';
  import BScroll from 'better-scroll';
  import {formatDate} from 'common/js/date';  // 引入date模块

  const POSITIVE = 0;
  const NEGATIVE = 1;
  const ALL = 2;
  const ERR_OK = 0;

  export default {
      // router-view传seller rating组件接收
    props: {
        seller: {
            type: Object
        }
    },
    data() {  // 维护这2个变量 改变它们的值并填充
      return {
        ratings: [], // 后端API的方式拿到
        selectType: ALL,
        onlyContent: true
      };
    },
    created() {
      this.$http.get('/api/ratings').then(function (response) { // vue resource的方法
        response = response.body; // 得到一个对象
        if (response.errno === ERR_OK) {
          this.ratings = response.data; // 用后端API返回的结果给全局变量ratings赋值

          // ratings拿到 最后一块DOM => 评价列表就位 初始化better-scroll
          this.$nextTick(() => {
            if (!this.scroll) {
                  this.scroll = new BScroll(this.$refs.ratings, {
                      click: true
                  });
              } else {
                  this.scroll.refresh();
              }
          });
        }
      });
    },
    methods: {
      needShow: function (type, text) { // 筛选列表用
        // 根据该列表项的文本内容和评论类型 结合父组件的onlyContent和selectType两个数据(跟子组件同步更新) 影响needShow的值 最终驱动列表DOM的筛选
        if (this.onlyContent && !text) {
          return false;
        } else if (this.selectType === ALL) {
          return true;
        } else {
          return this.selectType === type;
        }
      },
      setRatingType: function (type) {  // 父组件接收到子组件的事件,设置响应函数 更新父组件的数据状态
        this.selectType = type;

        this.$nextTick(() => {
          this.scroll.refresh();  // DOM有改变就刷新BScroll
        });
      },
      setBoolContent: function (bool) {
        this.onlyContent = bool;

        this.$nextTick(() => {
          this.scroll.refresh();
        });
      },
      onSelectTypeChange: function (val) {
        this.selectType = val;  // 外层调用组件方注册变更方法，将组件内的数据变更，同步到组件外的数据状态中
      },
      onOnlyContentChange: function (val) {
        this.onlyContent = val;
      }
      // 要尽可能的少用双向绑定，过于复杂的数据处理建议使用Vuex
      // 使用双向绑定的条件: 组件内部需要修改props 组件需要可以由外部在运行时动态控制，而非单纯初始化 组件外部需要读取组件内的状态来进行处理
    },
    filters: {
      formatDate: function (time) {
        let date = new Date(time);  // 转化成Date对象
        return formatDate(date, 'yyyy-MM-dd hh:mm');
      }
    },
    components: {
        star,
        split,
        ratingselect
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin"

  .ratings
    position: absolute
    top: 174px  // 去掉头部和tab
    /*bottom:46px*/
    bottom: 0
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
    .rating-wrapper
      padding: 0 18px
      .rating-item
        display: flex
        padding: 18px 0
        border-1px(rgba(7,17,27,0.1))
        .avatar
          flex: 0 0 28px
          width: 28px
          margin-right: 12px
          img
            border-radius: 50%  // 直接在图片上加圆角
        .content
          position: relative
          flex: 1
          .name
            margin-bottom: 4px
            line-height: 12px
            font-size: 10px
            color: rgb(7,17,27)
          .star-wrapper
            font-size: 0
            margin-bottom: 6px
            .star
              display: inline-block
              vertical-align: top // 文字和图片混合 需要加这两句
              margin-right: 6px
            .delivery
              display: inline-block
              vertical-align: top
              font-size: 10px
              line-height: 12px
              color: rgb(147,153,159)
          .text
            font-size: 12px
            margin-bottom: 8px
            line-height: 18px
            color: rgb(7,17,27)
          .recommend
            line-height: 16px
            font-size: 0
            .icon-thumb_up,.item
              display: inline-block
              font-size: 9px
              margin: 0 8px 4px 0
            .icon-thumb_up
              color: rgb(0,160,220)
            .item
              padding: 0 6px  // 上下是用line-height撑开
              border: 1px solid rgba(7,17,27,0.1)
              border-radius: 1px
              background: #fff
              color: rgb(147,153,159)
          .time
            position: absolute
            top: 0
            right: 0
            font-size: 10px
            line-height: 12px
            color: rgb(147,153,159)
</style>
