const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    open: process.platform === 'darwin',
    host: '0.0.0.0',
    port: 8080, // CHANGE YOUR PORT HERE!
    https: true,
  },
  pwa: {
    // ...Other pwa config options
    name: "Shootout",
    themeColor: "#ffd100",
    icons: {
      favicon32: 'img/icons/icon-32x32.png',
      favicon16: 'img/icons/icon-16x16.png',
      appleTouchIcon: 'img/icons/icon-152x152.png',
      maskIcon: 'img/icons/safari-pinned-tab.svg',
      msTileImage: 'img/icons/icon-144x144.png'
    }
  }
})
