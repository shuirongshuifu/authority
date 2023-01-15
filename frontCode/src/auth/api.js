// 引入axios包，并创建一个axios实例
import axios from "axios";
const http = axios.create({
    timeout: 5000
})

import { Message } from "element-ui";

import NProgress from 'nprogress' // 引入NProgress 当然，要提前npm下载一下
import 'nprogress/nprogress.css'  // 引入NProgress和对应的样式
NProgress.configure({ showSpinner: false }) // 隐藏右侧的旋转进度条

// 给这个axios实例加上请求拦截器和相应拦截器
//请求拦截
http.interceptors.request.use(
    (config) => {
        NProgress.start() // 开启进度条
        return config;
    },
    (err) => {
        return Promise.reject(err);
    }
)
//响应拦截
http.interceptors.response.use(
    (res) => {
        NProgress.done() // 关闭进度条
        if (res.data.code == 1) {
            Message({ message: res.data.data, type: "error" });
        }
        return res.data
    },
    (error) => {
        NProgress.done() // 关闭进度条
        return Promise.reject(error);
    }
)

/*
    暴露一个函数，在函数中使用刚创建的且加上拦截器的axios实例去发请求。
    因为发请求需要指定请求方式、请求地址、请求参数、请求头、响应类型等相关信息
    所以，需要接收相应的method、url、data、headers、responseType等参数
    这里最终暴露的请求函数是留给lss/index.js文件中定义的接口函数使用的
*/
export default (method, url, data = null, headers = 'application/json;charset=UTF-8', responseType) => {
    if (method == "post") {
        return http({
            method: 'post',
            url: url,
            data: data,
            headers: {
                'Content-Type': headers,
            },
            responseType: responseType
        });
    } else if (method == "get") {
        return http({
            method: 'get',
            url: url,
            params: data,
            headers: {
                'Content-Type': headers
            },
            responseType: responseType
        });
    } else if (method == "put") {
        // ......
        return;
    } else if (method == "delete") {
        // .....
        return;
    }
}