<template>
  <div>
    <div class="shopcart">
      <div class="content" @click="toggleList">
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
        <div class="content-r" @click.stop.prevent="pay">
          <div class="pay" :class="payClass">
            {{payDesc}}
          </div>
        </div>
      </div>

      <transition name="fold">
        <div class="shopcart-list" v-show="listShow">
          <!--listShow是一个计算属性,根据是否有内容,是否折叠计算得出-->
          <div class="list-header">
            <h1 class="title">购物车</h1>
            <span class="empty" @click="empty">清空</span>
          </div>
          <div class="list-content" ref="listContent">
            <ul>
              <!--和底部购物车状态条依赖同一个数据结构-->
              <li class="food border-1px" v-for="food in selectFoods">
                <!--点击cartcontrol,改变food.count,满足food.count>0的food推入selectFoods,然后遍历selectFoods填充list-content-->
                <span class="name">{{food.name}}</span>
                <div class="price">
                  <span>¥{{food.price*food.count}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <cartcontrol :food="food"></cartcontrol>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
    <transition name="fade">
      <div class="list-mask" v-show="listShow" @click="hideList"></div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import cartcontrol from 'components/cartcontrol/cartcontrol'; // 这是组件 需要注册
  import BScroll from 'better-scroll';  // 这是插件 不需要注册

  export default {
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
      data() {
        return {
          fold: true // 默认折叠
        };
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
          },
          listShow() {
              // 先考虑没有商品的情况
              if (!this.totalCount) {
                  this.fold = true;
                  return false; // 不显示
              }

              // 有商品
              let show = !this.fold;

              // 在商品弹层显示的时候调用BS初始化
              if (show) {
                this.$nextTick(() => {  // better-scroll严重依赖DOM
                  if (!this.scroll) {
                    this.scroll = new BScroll(this.$refs.listContent, {
                      click: true // 使listContent超出滚动,cartcontrol允许点击 food.count=>food=>selectedFoods=>填充
                    });
                  } else {  // 如果scroll已经创建 那么只要刷新一下
                    this.scroll.refresh();  // 重新计算视口和内容的高度 决定是否滚动
                  }
                });
              }

              return show;
          }
      },
      components: {
        cartcontrol
      },
      methods: {
          toggleList: function () {
            // 没有商品
            if (!this.totalCount) {
              return;
            }
            // 有商品
            this.fold = !this.fold;
          },
          empty: function () {
            this.selectFoods.forEach((food) => {
                food.count = 0;
            });
          },
          hideList: function () {
            this.fold = true;
          },
          pay: function () {
            if (this.totalPrice < this.minPrice) {
                return;
            }
            alert(`支付${this.totalPrice}元`);
          }
      }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin"

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
    .shopcart-list
      position: absolute
      left: 0
      top: 0
      width: 100%
      z-index: -1 // 从下面展开
      transform: translate3D(0,-100%,0);  // 默认状态:运动到下方(官网的例子省略了opacity:1)
      .list-header
        height: 40px
        line-height: 40px
        padding:0 18px
        background: #f3f5f7
        border-bottom: 1px solid rgba(7,17,27,0.1)
        .title
          float: left
          font-size: 14px
          color: rgb(7,17,27)
        .empty
          float: right
          font-size: 12px
          color: rgb(0,160,220)
      .list-content
        padding: 0 18px
        max-height: 217px // 超出就滚动
        overflow: hidden
        background: #fff
        .food
          position: relative
          padding: 12px 0
          box-sizing: border-box
          border-1px: rgba(7,17,27,0.1)
          .name
            font-size: 14px
            line-height: 24px
            color: rgb(7,17,27)
          .price
            position: absolute
            right: 90px
            bottom: 12px
            font-size: 14px
            line-height: 24px
            font-weight: 700
            color: rgb(240,20,20)
          .cartcontrol-wrapper
            position: absolute
            right: 0
            bottom: 5px
    .fold-enter-active, .fold-leave-active  // 只写过渡
      transition: all .5s
    .fold-enter, .fold-leave-to   // 最终状态
      transform: translate3D(0,0,0);
  .list-mask
    position: fixed
    left: 0
    top: 0
    width: 100%
    height: 100%  // 撑满
    z-index: 40 // 层级比shopcart低
    backdrop-filter: blur(10px) // IOS模糊

    opacity: 1
    background: rgba(7,17,27,0.6)
  .fade-enter-active, .fade-leave-active
    transition: all .5s
  .fade-enter, .fade-leave-to
    opacity: 0
    background: rgba(7,17,27,0)
</style>
