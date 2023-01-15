const path = require('path')
const CompressionPlugin = require('compression-webpack-plugin');//引入gzip压缩插件
function resolve(dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  productionSourceMap: false, // 关闭源码映射
  lintOnSave: false, //是否开启eslint
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src')) //配置别名
  },
  configureWebpack: config => {
    // 开发环境不配置
    if (process.env.NODE_ENV !== 'production') return
    // 生产环境才去配置
    return {
      plugins: [
        new CompressionPlugin({ //此插件不能使用太高的版本，否则报错：TypeError: Cannot read property 'tapPromise' of undefined
          // filename: "[path][base].gz", // 这种方式是默认的，多个文件压缩就有多个.gz文件，建议使用下方的写法
          filename: '[path].gz[query]', //  使得多个.gz文件合并成一个文件，这种方式压缩后的文件少，建议使用
          algorithm: 'gzip', // 官方默认压缩算法也是gzip
          test: /\.js$|\.css$|\.html$|\.ttf$|\.eot$|\.woff$/, // 使用正则给匹配到的文件做压缩，这里是给html、css、js以及字体（.ttf和.woff和.eot）做压缩
          threshold: 10240, //以字节为单位压缩超过此大小的文件，使用默认值10240吧
          minRatio: 0.8, // 最小压缩比率，官方默认0.8
          //是否删除原有静态资源文件，即只保留压缩后的.gz文件，建议这个置为false，还保留源文件。以防：
          // 假如出现访问.gz文件访问不到的时候，还可以访问源文件双重保障
          deleteOriginalAssets: false
        })
      ]
    }
  },
  devServer: {
    open: false,
    host: "0.0.0.0",
    port: 8080,
    https: false,
    hotOnly: false,
    proxy: {
      "/auth": {
        target: "http://localhost:9999",
        changeOrigin: true, // 虚拟的站点需要更管origin
        pathRewrite: {
          "/auth": ""
        }
      },
    }
  }
}
