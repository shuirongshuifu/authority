/**
 * cnpm i安装依赖
 * 同级目录下，执行nodemon app.js跑起来
 * 前提是要安装数据mysql库
 * 推荐使用navicat
 * */ 

const express = require('express')
const app = express()

// 使用body-parser中间件解析post请求主体
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

const stuRouter = require('./router') // 引入分模块管理的路由

// 设置模板引擎
app.set("view engine", "ejs")

// 加载静态资源   
app.use(express.static('public')) // 静态读取public文件夹里面的内容

/* app.get('/', (req, res) => res.send('Hello World!')) 
  监听路由的两种方式，方式一是通过express()实例app去做最外层监听
  方式二是express.Router()实例，去做模块化解耦监听，中间件形式使用
  方式二会好一些，具体代码在router.js文件中写的有
*/
app.use(stuRouter)

app.listen(9999, (req, res) => {
  console.log('访问：http://localhost:9999');
})