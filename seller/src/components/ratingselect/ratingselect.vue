<template>
  <div class="ratingselect">
    <div class="rating-type">
      <span>{{desc.all}}</span>
      <span>{{desc.positive}}</span>
      <span>{{desc.negative}}</span>
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
//  const ALL = 2;

  export default {
      props: {  // 外部组件传来填充该评论组件的数据结构
          ratings: {  // 用户评论数组
              type: Array,
              default() { // 数组和对象都要返回一个函数
                  return [];
              }
          },
          selectType: { // 当前选择哪种类型的评论
              type: Number
//              default: ALL
          },
          onlyContent: {  // 是否选择有内容的评论
              type: Boolean,
              default: false
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

</style>
