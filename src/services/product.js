import request from '@/utils/request'
import { stringify } from 'qs'

// 资源列表
export function getProductList(data) {
    return request({
        url: '/goods/listMy',
        method: 'post',
        data: stringify(data)
    })
}
// 新增，编辑资源
export function saveProduct(data) {
    return request({
        url: '/goods/saveOrUpdate',
        method: 'post',
        data: stringify(data)
    })
}

// 获取资源详情
export function getProductDetail(id) {
    return request({
        url: '/goods/detail',
        method: 'post',
        data: `id=${id}`
    })
}

// 修改资源状态
export function changeProductState(data) {
    return request({
        url: '/goods/changeState',
        method: 'post',
        data: stringify(data)
    })
}

// 店铺列表
export function getStoreList(data) {
    return request({
        url: '/store/listMy',
        method: 'post',
        data: stringify(data)
    })
}

// 店铺详情
export function getStoreDetail(id) {
    return request({
        url: '/store/detail',
        method: 'post',
        data: `id=${id}`
    })
}

// 审核商品
export function auditGoods(data) {
    return request({
        url: '/audit/check',
        method: 'post',
        data: stringify(data)
    })
}

// 审核商品列表
export function auditGoodsList(data) {
    return request({
        url: '/audit/listCheckGoods',
        method: 'post',
        data: stringify(data)
    })
}