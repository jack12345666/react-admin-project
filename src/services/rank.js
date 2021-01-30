import request from '@/utils/request';
import { stringify } from 'qs'

// 获取联盟下单位排名列表
export function allianceOrgRank(data) {
    return request({
        url: '/score/allianceOrgList',
        method: 'post',
        data: stringify(data)
    })
}

// 获取联盟排名列表
export function allianceRankList() {
    return request({
        url: '/score/orderList',
        method: 'post'
    })
}

// 获取分数列表
export function getScoreList(data) {
    return request({
        url: '/score/list',
        method: 'post',
        data: stringify(data)
    })
}

// 获取分数列表-只返回工作相关
export function getWorkScoreList(data) {
    return request({
        url: '/score/listWork',
        method: 'post',
        data: stringify(data)
    })
}
