import axios from 'axios'
import { BASEURL } from './config.js'
import { message, Modal } from 'antd'
import * as dd from 'dingtalk-jsapi'
import { getDdCorPId, ddLogin } from '@/services/union'
import { getBrowserType } from '@/utils/utils'

const { confirm } = Modal;
const errorHandle = status => {
  // 判断状态码
  switch (status) {
    case 500:
      message.error('找不到此服务，可能是在路上~');
      break
    case 503:
      message.error('服务器开小差了~请稍后');
      break
    case 404:
      message.error('找不到此服务');
      break
    default:
      message.error('网络错误');
  }
  return { data: '' }
}


// 新建了一个 axios 实例
const request = axios.create({
  baseURL: BASEURL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  withCredentials: true
})

request.interceptors.request.use(
  
  config => {
    config.headers['Authorization'] = localStorage.getItem('token')
    return config
  },
  // 请求错误
  error => {
    Promise.reject(error)
  }
)

// 处理响应数据
request.interceptors.response.use(
  // 请求成功
  res => { 
    if (res.data.code === 0) {
      return res.data
    }else if(res.data.code === 10){
      if(getBrowserType() === 'dd') {
        getDdCorPId().then(rsp => {
          if(rsp &&　rsp.code === 0) {
           dd.ready(function() {
             dd.runtime.permission.requestAuthCode({
                 corpId: rsp.data.corpId,
                 onSuccess: function(res) {
                   ddLogin(res.code).then(rsp => {
                       if(rsp && rsp.code === 0) {
                         localStorage.setItem('userId', rsp.data.data.id)
                         localStorage.setItem('token', rsp.data.data.token)
                       }
                   })
                 },
                 onFail : function(err) {
                    if (err.errorCode == 3) { 
                      confirm({
                         title: '提示',
                         content: '无权限，需要登录，将页面跳转至登录页',
                         okText: '确定',
                         okType: 'warning',
                         cancelText: '取消',
                         onOk() {
                           window.location.href = window.location.href.substring(0, window.location.href.length - window.location.hash.length)
                         }
                       })
                   }
                 }
             })
           })
          }
       })  
      }else {
        confirm({
          title: '提示',
          content: '无权限，需要登录，将页面跳转至登录页',
          okText: '确定',
          okType: 'warning',
          cancelText: '取消',
          onOk() {
            window.location.href = window.location.href.substring(0, window.location.href.length - window.location.hash.length)
          }
        })
      }
    }else if(res.data.code){
      message.error(res.data.msg);
    }
    
    return Promise.resolve(res.data)
  },
  err => {
    const { response } = err
    if (response) {
      errorHandle(response.status, response.data)
      return Promise.reject(response.data)
    }
    return { data: '' }
  }
)

export default request
