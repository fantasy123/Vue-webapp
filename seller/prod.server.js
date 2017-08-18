// 利用express搭建一个小型的http server
var express = require('express');
var config = require('./config/index');

var port = process.env.PORT || config.build.port; // 当前环境变量下的port 或者是config里配置的port

var app = express();  // 启动express

var router = express.Router();  // 定义一个router

router.get('/', function (req, res, next) { // 请求根目录
  req.url = '/index.html';
  next();
});

app.use(router);  // 使用这个router

// 关于异步接口的router 在dev-server已定义过
var appData = require('./data.json');  // 获得data对象
var seller = appData.seller; // 商家
var goods = appData.goods; // 商品
var ratings = appData.ratings; // 评论

var apiRoutes = express.Router(); // 定义一个router

apiRoutes.get('/seller',function (req,res) {
  res.json({  // 服务端吐数据到客户端
    errno:0,// 表示成功
    data:seller
  })
});

apiRoutes.get('/goods',function (req,res) {
  res.json({
    errno:0,
    data:goods
  })
});

apiRoutes.get('/ratings',function (req,res) {
  res.json({
    errno:0,
    data:ratings
  })
});

app.use('/api',apiRoutes); // path

// 定义static目录
app.use(express.static('./dist'));

// 启动express
module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err);
    return
  }
  console.log('Listening at http://localhost:' + port + '\n')
});

// npm run dev <=> node build/dev-server.js 启动默认http服务器(打包前 端口8080)
// node prod.server.js  启动新建的http服务器(打包后 端口9000)  network中:css和js和调试环境下是完全不一样的
