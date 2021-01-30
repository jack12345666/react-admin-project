import request from '@/utils/request';
import { stringify } from 'qs'

// 问题列表-联盟主席
export function appealList(data) {
    return request({
        url: '/question/list',
        method: 'post',
        data: stringify(data)
    })
}
// 新增沟通
export function addCommucation(data) {
    return request({
        url: '/question/savePost',
        method: 'post',
        data: stringify(data)
    })
}
// 问题详情
export function appealDetail(id) {
    return request({
        url: '/question/detail',
        method: 'post',
        data: `id=${id}`
    })
}
// 受理问题
export function acceptAppeal(id) {
    return request({
        url: '/question/accept',
        method: 'post',
        data: `questionId=${id}`
    })
}
// 办结或未解决
export function matterAppeal(data) {
    return request({
        url: '/question/result',
        method: 'post',
        data: stringify(data)
    })
}
