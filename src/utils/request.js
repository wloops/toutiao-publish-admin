// 基于axios封装的请求模块

import axios from 'axios'

// 创建一个 axios 实例 , 说白了就是复制一个 axios
// 我们通过这个实例去发请求,把需要的配置 配置给这个实例来处理
const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/' // 请求的基础路径
})

// 请求拦截器

// 响应拦截器

// 导出请求方法
export default request

// 谁要用,谁就加载 request 模块
// import request from 'request.js'
// request.xx
// request({
//   methods:'',
//   url: ''
// })