<template>
  <div class="shopcart">
    <div class="content">
      <div class="content-l">
        <div class="logo-wrapper">
          <div class="logo" :class="{'highlight':totalCount>0}">
            <i class="icon-shopping_cart" :class="{'highlight':totalCount>0}"></i>
          </div>
          <div class="num" v-if="totalCount>0">
            {{totalCount}}
          </div>
        </div>
        <div class="price" :class="{'highlight':totalPrice>0}">¥{{totalPrice}}</div>
        <div class="desc">另需配送费¥{{deliveryPrice}}元</div>
        <!--这些数据的动态展示依赖于选择了多少商品 在goods组件中选择了之后再下放到shopcart组件(props down)来做插值或计算(computed)-->
      </div>
      <div class="content-r">
        <div class="pay" :class="payClass">
          {{payDesc}}
        </div>
      </div>
    </div>
    <div class="ball-container">
      <transition name="drop">
        <!--外层管水平方向移动-->
        <div class="ball" v-for="ball in balls" v-if="ball.show">
          <!--内层管垂直方向-->
          <div class="inner"></div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
      data() {
          return {
              balls: [
                {
                    show: false  // 每个小球先隐藏
                },
                {
                    show: false
                },
                {
                    show: false
                }
              ]
          };
      },
      props: {
        selectFoods: {  // 在父组件goods中:通过cartcontrol操作food的count属性 => 计算属性selectedFoods也产生了变化
          //  => 把selectedFoods下放到shopcart子组件进而填充购物车的数据、影响购物车的状态 (目前我们使用假数据来进行填充)
          // 这个数据保存了我们选择的商品数组 每个商品(food)又包含数目和单价这2个字段 这个数据是很多插值的计算依据
            type: Array,
            default() { // 在vue里 当props是一个数组或对象时 default就需要是一个函数
                return [{
                    price: 10,
                    count: 5
                }];
            }
        },
        deliveryPrice: {
            // 组件通信流程:  异步获取数据=>赋值给全局变量=>路由外链(props下放)=>goods接收对象=>读取对象,继续下放=>接收变量,插值,计算
            // 1 App.vue里异步获取/api/seller目录下的数据 , 赋值给App组件的全局变量seller
            // 2 通过路由外链<router-view :seller="seller">(props down) 把这个seller对象传给goods组件
            // goods组件在props里接收seller (type: Object)
            // goods组件读取seller对象 , 读出来的参数进一步传给它的shopcart子组件 <shopcart :delivery-price="seller.deliveryPrice">
            // shopcart在props里接收变量 (type Number) 然后插值或计算
            type: Number,
            default: 0
        },
        minPrice: {
            type: Number,
            default: 0
        }
      },
      computed: {
          totalPrice() {
              let total = 0;

              this.selectFoods.forEach((food) => {
                  total += food.count * food.price;
              });

              return total;
          },
          totalCount() {
              let count = 0;

              this.selectFoods.forEach((food) => {
                 count += food.count;
              });

              return count;
          },
          payDesc() {
              if (this.totalPrice === 0) {
                  return `¥${this.minPrice}元起送`;
              } else if (this.totalPrice < this.minPrice) {
                  let diff = this.minPrice - this.totalPrice;
                  return `还差¥${diff}元起送`;
              } else {
                  return '去结算';
              }
          },
          payClass() {
              if (this.totalPrice < this.minPrice) {
                  return 'not-enough';
              } else {
                  return 'enough';
              }
          }
      }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .shopcart
    position: fixed
    left: 0
    bottom: 0
    z-index: 50
    width: 100%
    height: 48px
    .content
      display: flex
      background: #141d27
      color: rgba(255,255,255,.4)
      .content-l
        flex: 1
        font-size: 0
        .logo-wrapper // 三块横向排列
          position: relative
          top: -10px
          display: inline-block
          vertical-align: top
          width: 56px
          height: 56px
          padding: 6px
          box-sizing: border-box  // IE盒模型
          border-radius: 50%
          margin:0 12px
          background: #141d27
          .logo
            width: 100%
            height: 100%
            border-radius: 50%
            background: #2b343c
            text-align: center
            &.highlight
              background: rgb(0,140,220)
            .icon-shopping_cart
              font-size: 24px
              line-height: 44px
              color: #80858a
              &.highlight
                color: #fff
          .num
            position: absolute
            right: 0
            top: 0
            font-size: 9px
            width: 24px
            height: 16px
            line-height: 16px
            border-radius: 16px
            text-align: center
            background: rgb(240,20,20)
            color: #fff
            font-weight: 700
            box-shadow: 0 4px 8px 0 rgba(0,0,0,0.4)
        .price
          display: inline-block
          vertical-align: top
          font-size: 16px
          line-height: 24px
          margin-top: 12px
          padding-right: 12px
          border-right: 1px solid rgba(255,255,255,.1)
          box-sizing: border-box
          font-weight: 700
          &.highlight
            color: #fff
        .desc
          display: inline-block
          vertical-align: top
          font-size: 10px
          margin: 12px 0 0 12px
          line-height: 24px
      .content-r
        flex: 0 0 105px
        width: 105px
        .pay
          font-size: 12px
          height: 48px
          line-height: 48px
          font-weight: 700
          text-align: center
          &.not-enough
            background: #2b333b
          &.enough
            background: #00b43c
            color: #fff
    .ball-container
      .ball
        position: fixed
        left: 32px
        bottom: 22px  // 小球的最终位置
        z-index: 200
        &.drop-transition
          transition: all 0.4s
          .inner
            width: 16px
            height: 16px
            border-radius: 50%
            background: rgb(0,160,220)
            transition: all 0.4s
</style>
