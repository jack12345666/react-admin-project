import request from '@/utils/request';
import { stringify } from 'qs'

// 上传文件
export function uploadFile(data) {
    return request({
        url: '/common/uploadFiles',
        method: 'post',
        data: data
    })
}

// 获取分类
export function getCateGory() {
    return request({
        url: '/common/commoncategorys',
        method: 'post'
    })
}

// 用户登录
export function userLogin(data) {
    return request({
        url: '/user/login',
        method: 'post',
        data: stringify(data)
    })
}