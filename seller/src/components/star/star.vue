<template>
  <!--starType绑在父元素上,决定了该组星星的尺寸-->
  <div class="star" :class="starType">
    <!--遍历得到每一颗星的状态:(全星 半星 灰色) itemClasses这个数组是通过父组件传下来的score通过计算属性计算得到-->
    <span v-for="itemClass in itemClasses" :class="itemClass" class="star-item"></span>
    <!--itemClass决定每一个星星的背景图样式-->
  </div>
</template>

<script type="text/ecmascript-6">
  const LENGTH = 5;
  const CLS_ON = 'on';
  const CLS_HALF = 'half';
  const CLS_OFF = 'off';

  export default {
      props: { // props down
        size: {
            type: Number
        },
        score: {
            type: Number
        }
      },
      computed: {
          starType() { // 取得this.size拼接成能用的类名,放在父元素上决定一组星星的尺寸
              return 'star-' + this.size;
          },
          itemClasses() {
              let result = [];  // 决定每个星星背景图的数组
              let score = Math.floor(this.score * 2) / 2; // 以0.5为倍数向下取整
              let hasDecimal = score % 1 !== 0; // 对1取余,不为0说明有小数部分(即0.5)
              let integer = Math.floor(score);  // 取得整数部分
              for (let i = 0; i < integer; i++) { // 填入全星代表的类名
                result.push(CLS_ON);
              }
              if (hasDecimal) { // 填入一个半星代表的类名
                result.push(CLS_HALF);
              }
              while (result.length < LENGTH) {  // 根据数组长度,用无星代表的类名来填满数组剩余的部分
                result.push(CLS_OFF);
              }

              return result;  // 返回该数组
          }
      }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
// 引入用来设置星星的背景

  .star
    font-size: 0
    .star-item  // 不用把字体重置回来,因为没有相对单位em或rem
      display: inline-block
      background-repeat: no-repeat  // 共用的样式先写好
    &.star-48 // 计算属性1 starType
      .star-item
        width: 20px
        height: 20px
        margin-right: 22px
        background-size: 20px 20px
        &:last-child
          margin-right: 0
        &.on
          bg-image('star48_on')
        &.half
          bg-image('star48_half')
        &.off
          bg-image('star48_off')
    &.star-36
      .star-item
        width: 15px
        height: 15px
        margin-right: 6px
        background-size: 15px 15px
        &:last-child
          margin-right: 0
        &.on
          bg-image('star36_on')
        &.half
          bg-image('star36_half')
        &.off
          bg-image('star36_off')
    &.star-24
      .star-item
        width: 10px
        height: 10px
        margin-right: 3px
        background-size: 10px 10px
        &:last-child
          margin-right: 0
        &.on
          bg-image('star24_on')
        &.half
          bg-image('star24_half')
        &.off
          bg-image('star24_off')
</style>
