module.exports = {
      devServer: {
      //     host: 'localhost',
      //     port: 8080,
      //     proxy: {
      //         '/api': {
      //             target: 'http://mall-pre.springboot.cn',
      //             changeOrigin: true,
      //             pathRewrite: {
      //                 '/api': ''
      //             }
      //         }
      //     }
      },
      // publicPath: '/app',     //项目前面加  /app
      // outputDir: 'dist',         //这是项目文件的名称
      // indexPath: 'index.html',     //项目入口名称 单页面index.html
      lintOnSave: false,   //这个可以关闭esline
      // productionSourceMap: true,     //隐藏main.js
      // chainWebpack: (config) => {          //防止一次性加載所有文件0.js  1.js 2.js ........
      //     config.plugins.delete('prefetch');
      // }
  }