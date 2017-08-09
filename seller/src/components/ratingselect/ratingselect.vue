<template>
  <div class="ratingselect">
    <div class="rating-type border-1px">
      <!--全部满意不满意 全部推荐吐槽(取决于有没有传入desc)-->
      <span class="block positive">{{desc.all}}<span class="count">47</span></span>
      <span class="block positive">{{desc.positive}}<span class="count">40</span></span>
      <span class="block negative">{{desc.negative}}<span class="count">7</span></span>
    </div>
    <div class="switch">
      <span class="icon-check_circle"></span>
      <span class="text">只看有内容的评价</span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
//  const POSITIVE = 0;
//  const NEGATIVE = 1;
  const ALL = 2;

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
</style>
