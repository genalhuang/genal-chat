const Host = 'http://localhost:3001';

module.exports = {
  // webSocket本身不存在跨域问题，所以我们可以利用webSocket来进行非同源之间的通信。
  publicPath: '/',
  // devServer: {
  //   proxy: {
  //     '/': {
  //       target: Host,
  //       ws: true,
  //       changeOrigin: true
  //     },
  //   },
  // },
};
