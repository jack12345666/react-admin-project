import request from '@/utils/request';
import { stringify } from 'qs'

// 我的需求列表
export function getMyNeedsList(data) {
    return request({
        url: '/buy/listMy',
        method: 'post',
        data: stringify(data)
    })
}

// 需求详情
export function getNeedsDetail(id) {
    return request({
        url: '/buy/detail',
        method: 'post',
        data: `id=${id}`
    })
}

// 新增，修改需求
export function saveNeeds(data) {
    return request({
        url: '/buy/saveOrUpdate',
        headers: {'Content-Type': 'application/json'},
        method: 'post',
        data: data
    })
}

// 需求审核
export function auditNeeds(data) {
    return request({
        url: '/buy/audit',
        method: 'post',
        data: stringify(data)
    })
}

// 删除需求
export function delNeeds(id) {
    return request({
        url: '/buy/del',
        method: 'post',
        data: `id=${id}`
    })
}

// 需求列表（联盟主席）
export function auditNeedsList(data) {
    return request({
        url: '/buy/listAll',
        method: 'post',
        data: stringify(data)
    })
}

// 修改需求上下架
export function changeNeedState(data) {
    return request({
        url: '/buy/changeState',
        method: 'post',
        data: stringify(data)
    })
}