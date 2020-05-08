module.exports = {
    chainWebpack: config => {
        //发布阶段打包入口
        config.when(process.env.NODE_ENV === 'production', config => {
            config.entry('app').clear().add('./src/main-prod.js')
            config.plugin('html').tap(args => {
                args[0].isProd = true
            })
            return args
            // config.set('externals', {
            //     vue: 'Vue',
            //     'vue-router': 'VueRouter',
            //     axios: 'axios',
            //     lodash: '_',
            //     echarts: 'echarts',
            //     nprogress: 'NProgress',
            //     'vue-quill-editor': 'VueQuillEditor'
            // })
        })
        //开发文件打包入口
        config.when(process.env.NODE_ENV === 'development', config => {
            config.entry('app').clear().add('./src/main-dev.js')
            config.plugin('html').tap(args => {
                args[0].isProd = false
            })
            return args
        })
    },
    // publicPath: '/app',     //项目前面加  /app
    outputDir: 'shop',         //这是项目文件的名称
    // indexPath: 'index.html',     //项目入口名称 单页面index.html
    lintOnSave: false,   //这个可以关闭esline
    // productionSourceMap: true,     //隐藏main.js
    // chainWebpack: (config) => {          //防止一次性加載所有文件0.js  1.js 2.js ........
    //     config.plugins.delete('prefetch');
    // }
}