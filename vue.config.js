const { defineConfig } = require('@vue/cli-service');
const package = require('./package.json');
const fs = require('fs');

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: '/',
  devServer: {
    open: process.platform === 'darwin',
    host: process.env.TEST_DEVICE ? '0.0.0.0' : 'snooker-shootout.local',
    port: 8080, // CHANGE YOUR PORT HERE!
    https: process.env.TEST_DEVICE ? true : {
      key: fs.readFileSync('./certs/snooker-shootout.local+4-key.pem'),
      cert: fs.readFileSync('./certs/snooker-shootout.local+4.pem'),
    },
  },
  pwa: {
    assetsVersion: package.version,
    // ...Other pwa config options
    name: "Shootout",
    themeColor: "#09100A",
    background_color: '#283A20',
    iconPaths: {
      favicon32: 'favicon-32x32.png',
      favicon16: 'favicon-32x32.png',
      appleTouchIcon: 'img/icons/icon-152x152.png',
      // maskIcon: 'img/icons/safari-pinned-tab.svg',
      // msTileImage: 'img/icons/icon-144x144.png'
    }
  }
});
