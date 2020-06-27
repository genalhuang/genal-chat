const Host = 'http://localhost:3000';

module.exports = {
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
    proxy: {
      '/': {
        target: Host,
        ws: true,
        changeOrigin: true,
      },
    },
  },
};
