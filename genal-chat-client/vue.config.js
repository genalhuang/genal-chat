const Host = 'http://localhost:3000';
const webpack = require('webpack');

// cdn链接
const cdn = {
  css: [
    // antd css 由于引入失败只好放弃了antd的按需引入
  ],
  js: [
    // vue
    'https://cdn.bootcdn.net/ajax/libs/vue/2.6.10/vue.min.js',
    // vue-router
    'https://cdn.bootcdn.net/ajax/libs/vue-router/3.1.3/vue-router.min.js',
    // vuex
    'https://cdn.bootcdn.net/ajax/libs/vuex/3.1.2/vuex.min.js',
    // axios
    'https://cdn.bootcdn.net/ajax/libs/axios/0.18.0/axios.min.js',
    // moment
    'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.27.0/moment.min.js',
  ],
};

const CompressionWebpackPlugin = require('compression-webpack-plugin');

module.exports = {
  chainWebpack: (config) => {
    // 需要打包分析时取消注释
    // config.plugin('webpack-bundle-analyzer').use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin);

    // 配置cdn引入
    if (process.env.NODE_ENV === 'production') {
      let externals = {
        vue: 'Vue',
        axios: 'axios',
        'vue-router': 'VueRouter',
        vuex: 'Vuex',
        moment: 'moment',
      };
      config.externals(externals);
      // 通过 html-webpack-plugin 将 cdn 注入到 index.html 之中
      config.plugin('html').tap((args) => {
        args[0].cdn = cdn;
        return args;
      });
    }
  },
  configureWebpack: (config) => {
    // 代码 gzip
    const productionGzipExtensions = ['html', 'js', 'css'];
    config.plugins.push(
      new CompressionWebpackPlugin({
        filename: '[path].gz[query]',
        algorithm: 'gzip',
        test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
        threshold: 10240, // 只有大小大于该值的资源会被处理 10240
        minRatio: 0.8, // 只有压缩率小于这个值的资源才会被处理
        deleteOriginalAssets: false, // 删除原文件
      })
    );

    // 不打包moment的语言包
    config.plugins.push(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/));

    // 去除console
    if (process.env.NODE_ENV === 'production') {
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true;
    }
  },
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: {
            'primary-color': 'skyblue',
            // 'link-color': '#1DA57A',
            // 'border-radius-base': '2px',
          },
          javascriptEnabled: true,
        },
      },
      sass: {
        prependData: "@import '@/theme/index.scss';",
      },
    },
  },
  // webSocket本身不存在跨域问题，所以我们可以利用webSocket来进行非同源之间的通信。
  publicPath: '/',
  devServer: {
    port: 1997,
    proxy: {
      '/api': {
        target: Host,
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/api': '',
        },
      },
      'socket.io': {
        target: Host,
        ws: true,
        changeOrigin: true,
      },
    },
  },
  productionSourceMap: false,
};
