import Cookies from 'js-cookie'
import { BASEURL } from '@/utils/config'
import moment from 'moment'
/**
 * 获取url参数
 * @param name 查询名称
 * @param notDecode 不进行url解码，传true表示不解码，false或不传表示进行解码
 * @returns {*}
 * @constructor
 */
export function GetQueryString(name, notDecode = false)
{
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var str = window.location.hash.split('?')[1]
    var r = str.match(reg);
    if(r!=null){
        if(notDecode){
            return r[2];
        }
        return decodeURIComponent(r[2]);
    }
    return '';
}


// 获取cookie里的token
export function getCookieToken() {
   return Cookies.get('token');
}

// 图片路径转换
export function imgFormat(value) {
    if(value && value.startsWith('http')) {
        return value
    }else if(value) {
        return BASEURL + value
    }else {
        return null
    }
}


// 根据key获取数组value
export function getArrayProps(arr, key) {
    let keys = `${key}`
    let res = []
    if(arr.length > 0) {
        arr.forEach(t => {
            res.push(t[keys])
        })
    }
    return res
}

// 判断浏览器环境
export function getBrowserType(){
    var ua = navigator.userAgent.toLowerCase();
    if(ua.match("micromessenger")){
        return 'wx';
    }
    else if(ua.match("dingtalk")){
        return 'dd';
    }
    else if(ua.match("iphone|ipod|ipad|android|nokia|symbian|phone|mobile")){
        return 'mobile';
    }
    else{
        return 'pc';
    }
}

// 时间格式化
export function dateTimeFormat(value) {
    if(!value) {
        return null
    }else {
        
        return moment(value).format('YYYY-MM-DD HH')
    }
}

// 补0
export function inputZero(value) {
    if(value < 10) {
        return `0${value}`
    }else {
        return value
    }
}

//二进制文件下载
export function binaryDown(rsp, type = '报名列表.xlsx'){
      let url = window.URL.createObjectURL(new Blob([rsp])) 
      let link = document.createElement('a') 
      link.style.display = 'none' 
      link.href = url 
      link.setAttribute('download', type) 
      document.body.appendChild(link) 
      link.click()
}

export function excelDownLoad(id) {
      let link = document.createElement('a') 
      link.style.display = 'none' 
      link.href = `${BASEURL}/activity/exportEnroll?activityId=${id}` 
      document.body.appendChild(link) 
      link.click()
}


// 判断是否pc端
export function IsPC() {
    var userAgentInfo = navigator.userAgent;
    var Agents = ["Android", "iPhone","SymbianOS", "Windows Phone","iPad", "iPod"];
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
}