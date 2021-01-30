import request from '@/utils/request'
import { stringify } from 'qs'

// 获取月度工作列表(联盟主席)
export function getMonthWorkPresident(data) {
    return request({
        url: "/monthwork/listForPresident",
        method: 'post',
        data: stringify(data)
    })
}

// 获取月度工作列表(用户)
export function getMonthWorkUser(data) {
    return request({
        url: '/monthwork/listForUser',
        method: 'post',
        data: stringify(data)
    })
}

// 保存/提交月度工作(计划)
export function saveOrUpdateJH(data) {
    return request({
        url: '/monthwork/saveOrUpdateJH',
        method: 'post',
        data: stringify(data)
    })
}

// 保存/提交月度工作(例会)
export function saveOrUpdateLH(data) {
    return request({
        url: '/monthwork/saveOrUpdateLH',
        method: 'post',
        data: stringify(data)
    })
}

// 保存/提交月度工作(总结)
export function saveOrUpdateZJ(data) {
    return request({
        url: '/monthwork/saveOrUpdateZJ',
        method: 'post',
        data: stringify(data)
    })
}

// 获取年度工作列表(联盟主席)
export function getYearWorkPresident(data) {
    return request({
        url: '/yearwork/listForPresident',
        method: 'post',
        data: stringify(data)
    })
}

// 获取年度工作列表(用户)
export function getYearWorkUser(data) {
    return request({
        url: '/yearwork/listForUser',
        method: 'post',
        data: stringify(data)
    })
}

// 保存/提交年度工作(计划)
export function saveOrUpdateYearJH(data) {
    return request({
        url: '/yearwork/saveOrUpdateJH',
        method: 'post',
        data: stringify(data)
    })
}

// 保存/提交年度工作(总结)
export function saveOrUpdateYearZJ(data) {
    return request({
        url: '/yearwork/saveOrUpdateZJ',
        method: 'post',
        data: stringify(data)
    })
}

// 特色工作分类
export function unionWorkType(data) {
    return request({
        url: '/common/codes',
        method: 'post',
        data: stringify(data)
    })
}

// 获取月度总结明细列表(用户)
export function getWorkEventUser(data) {
    return request({
        url: '/workevent/listForUser',
        method: 'post',
        data: stringify(data)
    })
}

// 获取月度总结明细列表(联盟主席)
export function getWorkEventPresident(data) {
    return request({
        url: '/workevent/listForPresident',
        method: 'post',
        data: stringify(data)
    })
}

// 删除月度总结明细
export function deleteUnionWork(id) {
    return request({
        url: '/workevent/remove',
        method: 'post',
        data: `id=${id}`
    })
}

// 新增/修改月度总结明细
export function editUnionWork(data) {
    return request({
        url: '/workevent/saveOrUpdate',
        method: 'post',
        data: stringify(data)
    })
}