const path = require('path')
export default {
 "extraBabelPlugins": [
   ["import", { "libraryName": "antd", "libraryDirectory": "es", "style": "css" }]
  ],
  es5ImcompatibleVersions: true,
  define: {
     'process.env': {
      'API_EVN': process.env.API_EVN,
    },
  },
  env: {
    development: {
      extraBabelPlugins: ['dva-hmr']
    }
  },
  alias: {
    '@': path.resolve(__dirname, 'src')
  },
  // proxy: {
  //   '/api': {
  //     target: process.env.API_URL,
  //     changeOrigin: true,
  //     pathRewrite: { '^/api': '' }
  //   }
  // }
}