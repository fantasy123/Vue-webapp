<template>
  <div class="ratingselect">
    <div class="rating-type border-1px">
      <!--全部满意不满意 全部推荐吐槽(取决于有没有传入desc)-->
      <span class="block positive" :class="{'active':selectType === 2}" @click="select(2,$event)">{{desc.all}}<span class="count">{{ratings.length}}</span></span>
      <!--在HTML中只能访问data/props/computed里定义的变量,所以ALL POSITIVE NEGATIVE访问不到 只能通过0 1 2访问-->
      <span class="block positive" :class="{'active':selectType === 0}" @click="select(0,$event)">{{desc.positive}}<span class="count">{{positives.length}}</span></span>
      <span class="block negative" :class="{'active':selectType === 1}" @click="select(1,$event)">{{desc.negative}}<span class="count">{{negatives.length}}</span></span>
      <!--点击全部,调用select,传入2,在methods里面把全局的selectType置为2,从而驱动DOM-->
    </div>
    <div class="switch" :class="{'on':onlyContent}" @click="toggleContent($event)">
      <span class="icon-check_circle"></span>
      <span class="text">只看有内容的评价</span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue';

  const POSITIVE = 0;
  const NEGATIVE = 1;
  const ALL = 2;  // 这里用常量存储数字 只是为了语义化 而且只能在script标签里被识别

  export default {
      props: {  // 外部组件传来填充该评论组件的数据结构
          ratings: {  // 用户评论数组
              type: Array,
              default() { // 数组和对象都要返回一个函数
                  return [];
              }
          },
          selectType: { // 当前选择哪种类型的评论
              type: Number,
              default: ALL  // 用常量较为语义化
          },
          onlyContent: {  // 是否选择有内容的评论
              type: Boolean,
              default: false  // 先显示全部
          },
          desc: { // 用的是哪一套评论描述
              type: Object,
              default() { // 父组件没有传另一套描述 就用这一套
                  return {
                      all: '全部',
                      positive: '满意',
                      negative: '不满意'
                  };
              }
          }
      },
      data: function () { // data中新增副本字段
        return {
          mySelectType: this.selectType,  // selectType不可写(防止子组件不小心修改了父组件的状态,使得应用数据流难以理解)
          myOnlyContent: this.onlyContent // 所以创建一个副本 组件内所有对原值的操作改成对副本的操作
        };
      },
      watch: {
        selectType (val) {
            this.mySelectType = val;  // 父组件修改props => 同步到该组件的props上(合法数据流) => 同步到data属性里的副本的修改上
        },
        mySelectType (val) {  // 通知到组件外
            this.$emit('on-select-type-change', val);  // 组件内对mySelectType变更后向外部发送事件通知
        },
        onlyContent (val) {
            this.myOnlyContent = val;
        },
        myOnlyContent (val) {
            this.$emit('on-only-content-change', val);
        }
      },
      methods: {
        select: function (type, event) {
          if (!event._constructed) {
                return;
          }
          this.mySelectType = type; // 修改了副本
          // Vue2中组件的props的数据流动改为了只能单向流动 在组件内，不能修改由外层传来的props数据

          this.$emit('selectRatingType', type); // 派发selectRatingType事件向父组件传递type
        },
        toggleContent: function (event) {
          if (!event._constructed) {
            return;
          }
          this.myOnlyContent = !this.onlyContent; // 基础类型的改变不会影响父组件 可以派发一个事件让父组件来监听

          this.$emit('toggleContent', this.onlyContent);  // 派发toggleContent事件向父组件传递this.onlyContent
        }
      },
      computed: {
          positives() {
            return this.ratings.filter((rating) => {
                return rating.rateType === 0;
            });
          },
          negatives() {
            return this.ratings.filter((rating) => {
              return rating.rateType === 1;
            });
          }
      }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin"

  .ratingselect
    .rating-type
      padding: 18px 0
      margin: 0 18px
      border-1px(rgba(7,17,27,0.1))
      font-size: 0
      .block // 通用样式
        display: inline-block
        font-size: 12px
        padding: 8px 12px
        margin-right: 8px
        border-radius: 1px
        line-height: 16px
        color: rgb(77,85,93)
        .count
          font-size: 8px
          margin-left: 2px
        &.active
          color: #fff
        &.positive
          background: rgba(0,160,220,0.2)
          &.active
            background: rgb(0,160,220)
        &.negative
          background: rgba(77,85,93,0.2)
          &.active
            background: rgb(77,85,93)
  .switch
    padding: 12px 18px
    line-height: 24px
    border-bottom: 1px solid rgba(7,17,27,0.1)
    color: rgb(147,153,159)
    font-size: 0
    &.on
      .icon-check_circle
        color: #00c850
    .icon-check_circle
      display: inline-block
      vertical-align: top
      font-size: 24px
      margin-right: 4px
    .text
      display: inline-block
      vertical-align: top
      font-size: 12px
</style>

