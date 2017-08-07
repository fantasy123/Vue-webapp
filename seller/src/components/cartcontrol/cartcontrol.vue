<template>
  <div class="cartcontrol">
    <transition name="move">
      <div class="decrease" v-if="food.count>0" @click.stop.default="decreaseCart($event)">
        <i class="inner icon-remove_circle_outline"></i>
      </div>
    </transition>
    <!--左右按钮是2个字体-->
    <div class="count" v-if="food.count>0">{{food.count}}</div>
    <div class="add icon-add_circle" @click.stop.default="addCart($event)"></div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue';  // 全局引入Vue

  export default {
    props: {
        food: {
            type: Object  // 这个数目控件跟单个食品关联,操作它的数目 => 所以food对象要从goods组件传进来(goods组件异步返回商品模块的数据并存在全局变量goods里
            // => 遍历goods得到item,遍历item.foods拿到food) => food下放给子组件cartcontrol => 在这个组件里添加并操作food的count属性
        }
    },
    methods: {
        addCart: function (event) {
          if (!event._constructed) {
              return;
          }
          // 只认派发的点击事件
          if (!this.food.count) {
//            this.food.count = 1;  给观测对象添加一个不存在的属性时,直接去赋值是不可以的,defineProperty检测不到属性变化
              Vue.set(this.food, 'count', 1); // 调用Vue的一个接口来新增(删除)属性 就能观测到这种变化 进而影响DOM
          } else {
            this.food.count++;
          }
        },
        decreaseCart: function(event) {
          if (!event._constructed) {
            return;
          }

          if (this.food.count) {
            this.food.count--;
          }
        }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .cartcontrol
    font-size: 0
    .decrease // 减少按钮分2层 外层(.decrease)负责平移 内层(.icon-remove_circle_outline)负责旋转(以及外观)
      display: inline-block
      padding: 6px  // 在维持设计美观的前提下增大点击区域
      .icon-remove_circle_outline
        line-height: 24px
        font-size: 24px
        color: rgb(0,160,220)
    .move-enter-active, .move-leave-active  // 动画结束时候的状态 transition也写在这里面
      transition: all .4s linear
      opacity: 1
      transform: translate3D(0,0,0) // 开启硬件加速
      .inner
        display: inline-block // 设置inline-block,才能有宽高,动画才能做起来
        transition: all .4s linear
        transform: rotate(0)
    .move-enter, .move-leave-to // 动画开始的时候
      opacity: 0
      transform: translate3D(24px,0,0)
      .inner
        transform: rotate(180deg)
    .add  // add按钮把图标外观和定位写在一起
      display: inline-block
      padding: 6px
      line-height: 24px
      font-size: 24px
      color: rgb(0,160,220)
    .count
      display: inline-block
      vertical-align: top
      font-size: 10px
      width: 12px
      line-height: 24px
      padding-top: 6px
      color: rgb(147,153,159)
      text-align: center
</style>
