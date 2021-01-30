import request from '@/utils/request';
import { stringify } from 'qs'

// 活动列表(我创建的)
export function getCreActivityList(data) {
    return request({
        url: '/activity/listMy',
        method: 'post',
        data: stringify(data)
      })
}

// 我的报名列表
export function getMyEnrollList(data) {
    return request({
        url: '/activity/listMyOrder',
        method: 'post',
        data: stringify(data)
    })
}

// 新增、修改活动
export function editActivity(data) {
    return request({
        url: '/activity/saveOrUpdate',
        method: 'post',
        data: stringify(data)
    })
}

// 删除活动
export function deleteActivity(id) {
    return request({
        url: '/activity/del',
        method: 'post',
        data: `id=${id}`
    })
}

// 活动报名审核
export function checkEnroll(data) {
    return request({
        url: '/activity/enrollCheck',
        method: 'post',
        data: stringify(data)
    })
}

// 报名列表
export function getEnrollList(data) {
    return request({
        url: '/activity/listEnroll',
        method: 'post',
        data: stringify(data)
    })
}

// 报名详情
export function getEnrollDetail(id) {
    return request({
        url: '/activity/enrollDetail',
        method: 'post',
        data: `id=${id}`
    })
}

// 活动列表（联盟主席）
export function auditActivityList(data) {
    return request({
        url: '/activity/list',
        method: 'post',
        data: stringify(data)
    })
}

// 活动审核(联盟主席)
export function toAuditActivity(data) {
    return request({
        url: '/activity/audit',
        method: 'post',
        data: stringify(data)
    })
}

// 修改活动上下架
export function changeActivityState(data) {
    return request({
        url: '/activity/changeState',
        method: 'post',
        data: stringify(data)
    })
}
