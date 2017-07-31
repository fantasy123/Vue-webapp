<template>
  <div class="shopcart">
    <div class="content">
      <div class="content-l">
        <div class="logo-wrapper">
          <div class="logo">
            <i class="icon-shopping_cart"></i>
          </div>
        </div>
        <div class="price">¥100.00</div>
        <div class="desc"></div>
      </div>
      <div class="content-r"></div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {};
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
            .icon-shopping_cart
              font-size: 24px
              line-height: 44px
              color: #80858a
        .price
          display: inline-block
          vertical-align: top
          font-size: 16px
          line-height: 24px
          margin-top: 12px
          padding-right: 12px
          border-right: 1px solid rgba(255,255,255,.1)
          box-sizing: border-box
          color: red
          font-weight: 700
        .desc
          display: inline-block
      .content-r
        flex: 0 0 105px
        width: 105px
</style>
