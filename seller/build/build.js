require('./check-versions')();

process.env.NODE_ENV = 'production'; // 当前环境设置为生产环境

var ora = require('ora');  // 给长时间运行的异步任务一个提示
var rm = require('rimraf');
var path = require('path');
var chalk = require('chalk');
var webpack = require('webpack');
var config = require('../config');
var webpackConfig = require('./webpack.prod.conf');

var spinner = ora('building for production...'); // 打包过程中的提示文案
spinner.start();

rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
  if (err) throw err
  webpack(webpackConfig, function (err, stats) {  // 结束编译打包
    spinner.stop();   // 结束提示文案
    if (err) throw err
    process.stdout.write(stats.toString({ // 输出打包信息
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n\n');

    console.log(chalk.cyan('  Build complete.\n'));
    console.log(chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n' +  // 编译后的文件要用http server去启动
      '  Opening index.html over file:// won\'t work.\n'
    ))
  })
});
