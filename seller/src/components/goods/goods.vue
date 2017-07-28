<template>
  <div class="goods">
    <div class="menu-wrapper">
      <ul>
        <li v-for="item in goods" class="menu-item">
          <!--text包含活动图标和活动文字描述-->
          <span class="text border-1px">
            <!--border-1px在base里面,用媒体查询的方式使得在不同设备像素比的设备下边框粗细保持一致-->
            <!--item.type>0才有classMap索引对应的类名,否则不显示活动标识-->
            <span class="icon" v-show="item.type>0" :class="classMap[item.type]"></span>
            {{item.name}}
            <!--这个name在右侧foods-wrapper里还要用到-->
          </span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper">
      <ul>
        <li v-for="item in goods" class="food-list">
          <h1 class="title">{{item.name}}</h1>
          <ul>
            <li v-for="food in item.foods" class="food-item border-1px">
              <div class="icon">
                <img width="57" height="57" :src="food.icon">
              </div>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="desc">{{food.description}}</p>
                <div class="extra">
                  <span class="count">月售{{food.sellCount}}份</span>
                  <span>好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span class="now">¥{{food.price}}</span>
                  <span v-if="food.oldPrice" class="old">{{food.oldPrice}}</span>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const ERR_OK = 0;

  export default {
      props: {
          seller: {
              type: Object  // props down
          }
      },
      data () { // data必须是函数
          return {
              goods: [] //  该组件全局变量,初始化为空,待后端数据返回来填充
          };
      },
      created () {  // hook
          this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];

          this.$http.get('/api/goods').then(response => {
              response = response.body;
              if (response.errno === ERR_OK) {
                  this.goods = response.data; // 用这个数据来填充goods组件的数据
              }
          });
      }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin"

  .goods
    display:flex
    position: absolute
    width: 100%
    top: 174px
    bottom: 46px
    overflow: hidden  // 外层超出隐藏,内层各自滚动
    .menu-wrapper
      flex: 0 0 80px  //flex缩写:flex-grow为0不放大 flex-shrink为0不缩小 flex-basis直接规定占轴宽度
      width: 80px // 安卓浏览器兼容性
      background: #f3f5f7
      .menu-item  // class选择器速度比标签选择器快
        display: table  // 多行居中
        height: 54px
        width: 56px
        padding:0 12px
        line-height: 14px
        .text
          display:table-cell
          width: 56px
          vertical-align: middle
          border-1px(rgba(7,17,27,0.1))
          font-size: 12px
          .icon
            display: inline-block
            vertical-align: top
            width: 12px
            height: 12px
            margin-right: 2px
            background-size: 12px 12px
            background-repeat: no-repeat
            &.decrease
              bg-image('decrease_3')  // 不同风格的活动标识,在写样式的时候引入不同的背景图
            &.discount
              bg-image('discount_3')  // 这些背景图标在goods组件文件夹里就近维护
            &.guarantee
              bg-image('guarantee_3')
            &.invoice
              bg-image('invoice_3')
            &.special
              bg-image('special_3')
    .foods-wrapper
      flex: 1
      .food-list
        .title
          padding-left: 14px
          height: 26px
          line-height: 26px
          border-left:2px solid #d9dde1
          font-size: 12px
          color: rgb(147,153,159)
          background: #f3f5f7
        .food-item
          display: flex
          margin: 18px  // 上下margin会重叠
          padding-bottom: 18px
          border-1px(rgba(7,17,27,0.1))
          &:last-child
            border-none()
            margin-bottom: 0
          .icon
            flex: 0 0 57px
            width: 57px // 和右侧的content构成flex布局 宽度和内部的img(宽高写在标签里)一样 高度由右边的content决定(flex左右等高)
            margin-right: 10px
          .content
            flex: 1
            .name
              margin: 2px 0 8px 0
              font-size: 14px
              height: 14px
              line-height: 14px
              color: rgb(7,17,27)
            .desc,.extra  // 共用的写一起
              font-size: 10px
              line-height: 10px
              color: rgb(147,153,159)
            .desc // 各自特有的样式
              margin-bottom: 8px
            .extra
              .count
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
</style>
