<template>
  <div class="goods">
    <div class="menu-wrapper" ref="menuWrapper">
      <ul>
        <!--Vue 2.0遍历方式升级-->
        <li v-for="(item ,index) in goods" class="menu-item" :class="{'current': curIndex === index}" @click="selectMenu(index , $event)">
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
    <div class="foods-wrapper" ref="foodsWrapper">
      <ul>
        <li v-for="item in goods" class="food-list food-list-hook">
          <!--food-list-hook表示专用被JS选择,不写任何样式-->
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
                  <span class="count">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
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
    <!--绑定在一般元素上,ref指DOM.绑定在组件上时,ref为一组件实例-->
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';  // npm安装的模块不用写相对路径

  const ERR_OK = 0;

  export default {
      props: {
          seller: {
              type: Object  // props down
          }
      },
      data () { // data必须是函数 里面的数据在JS里要加this 在html里直接用
          return {
              goods: [], //  该组件全局变量,初始化为空,待后端数据返回来填充
              listHeight: [], // 右侧foodlist高度区间数组
              scrollY: 0  // 滚动的纵坐标
          };
      },  // data对象里都是需要全局跟踪的变量
      computed: {
        curIndex() {  // 计算属性获得左侧menu的索引
          // 高度区间数组(DOM就绪后得到<nextTick>)和右侧食品列表的纵向滚距(绑定滚动事件得到)做一个映射 根据滚距落在的高度区间确定左侧菜单高亮索引
            for (let i = 0; i < this.listHeight.length; i++) {
                let h1 = this.listHeight[i];
                let h2 = this.listHeight[i + 1];

                if (!h2 || (this.scrollY >= h1 && this.scrollY < h2)) {  // 第一个条件代表是最后一个高度区间了
                  // 左边是闭区间 当h1是0的时候 说明并没有开始累加 索引i应该是0 那么第一块也能高亮
                    return i;
                }
            }

            return 0;
        }
      },
      created () {  // hook
          this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];

          this.$http.get('/api/goods').then(response => {
              response = response.body;

              if (response.errno === ERR_OK) {
                  this.goods = response.data; // 用这个数据来填充goods组件的数据

                  this.$nextTick(() => {
                      this._initScroll();
                      // 依然是DOM就位后再计算高度
                      this._calculateHeight();  // 计算高度、构造高度区间数组
                  });
              }
          });
      },
      methods: {
          selectMenu(index, event) {
              if (!event._constructed) {  // 在BS里区分派发事件还是原生点击事件的属性
                return; // 过滤掉PC上的原生点击事件 防止在PC端内核浏览器上重复点击
              }

//              console.log(index); // 只执行派发的点击事件
              let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
              let ele = foodList[ index ];

              this.foodsScroll.scrollToElement(ele, 400);
          },
          _initScroll: function() {
            this.menuScroll = new BScroll(this.$refs.menuWrapper, {
                click: true
            });
            this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
                probeType: 3
            }); // BS的接口 用来实时获取scroll列表的实时位置 起到一个探侦的效果

            this.foodsScroll.on('scroll', (pos) => {  // 给右侧食品列表绑定滚动事件,获取它的纵坐标
                this.scrollY = Math.abs(Math.round(pos.y));
            });
          },
          _calculateHeight: function() {
            let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');  // 获取所有标题+foods构成的列表 得到一个数组
            // 先通过vue的 $refs 接口拿到一个原生dom 再利用原生dom方法取下面的食物列表 得到一个类数组(nodeList)
            let height = 0; // 没有列表进入数组的时候,初始高度为0
            this.listHeight.push(height); // 推入第一个区块的高度

            for (let i = 0; i < foodList.length; i++) {
              let item = foodList[i];
              height += item.clientHeight;  // DOM原生方法 表示元素可视区域高度
              this.listHeight.push(height); // 不断获取递增的height,高度递增的区间数组构造完毕
            }
          }
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
        &.current
          position: relative
          z-index: 10
          margin-top: -1px
          background: #fff
          font-weight: 700
          .text
            border-none()
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
              line-height: 12px
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
