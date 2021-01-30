import request from '@/utils/request';
import { stringify } from 'qs'

// 用户详情
export function getUserInfo(id) {
    return request({
        url: '/user/detail',
        method: 'post',
        data: `id=${id}`
    })
}

// 获取成员列表
export function getMemberList(data) {
    return request({
        url: '/allianceorganization/list',
        method: 'post',
        data: stringify(data)
    })
}

// 获取机构列表
export function getOrgList(data) {
    return request({
        url: '/organization/list',
        method: 'post',
        data: stringify(data)
    })
}

// 删除成员
export function delMember(id) {
    return request({
        url: '/allianceorganization/remove',
        method: 'post',
        data: `id=${id}`
    })
}

// 获取红盟详情
export function getUnionDetail(id) {
    return request({
        url: '/alliance/detail',
        method: 'post',
        data: `id=${id}`
    })
}

// 修改红盟
export function editUnionInfo(data) {
    return request({
        url: '/alliance/saveOrUpdate',
        method: 'post',
        // data: `category=${data.category}&displayno=${data.displayno}&name=${data.name}
        // &description=${data.description}&id=${data.id}&logopath=${data.logopath}
        // &presidentorgid=${data.presidentorgid}&presidentorguserid=${data.presidentorguserid}&operators=${data.operators}`
        data: stringify(data)
    })
}

// 获取（荣誉/大事记/新闻动态）列表
export function getExtendlist(data) {
    return request({
        url: '/allianceextend/list',
        method: 'post',
        data: stringify(data)
    })
}

// 删除（荣誉/大事记/新闻动态）
export function delExtend(id) {
    return request({
        url: '/allianceextend/remove',
        method: 'post',
        data: `id=${id}`
    })
}

// 新增、编辑（荣誉/大事记/新闻动态）
export function saveAllianceExtend(data) {
    return request({
        url: `/allianceextend/saveOrUpdate?${stringify(data.file)}`,
        method: 'post',
        data: stringify(data.info)
    })
}

// 查询机构
export function getMyOrg(id) {
    return request({
        url: '/user/listOrg',
        method: 'post',
        data: `userId=${id}`
    })
}

// 获取单位所属红盟列表
export function getOrgOfUnion(data) {
    return request({
        url: '/alliance/list',
        method: 'post',
        data: stringify(data)
    })
}

// 新增、修改成员
export function saveAlliceOrg(data) {
    return request({
        url: '/allianceorganization/saveOrUpdate',
        method: 'post',
        data: stringify(data)
    })
}

// 获取机构详情
export function getOrgInfo(id) {
    return request({
        url: '/organization/detail',
        method: 'post',
        data: `id=${id}`
    })
}

// 修改机构信息
export function editOrgInfo(data) {
    return request({
        url: '/organization/saveOrUpdate',
        method: 'post',
        data: stringify(data)
    })
}

// 获取钉钉corpId
export function getDdCorPId() {
    return request({
        url: '/common/getDDCorpId',
        method: 'post'
    })
}

// 用户钉钉登录
export function ddLogin(code) {
    return request({
        url: '/user/ddLogin',
        method: 'post',
        data: `code=${code}`
    })
}

// 钉钉分享
export function ddShare(data) {
    return request({
        url: '/dingding/share',
        method: 'post',
        data: stringify(data)
    })
}

// 获取联盟列表
export function getUnionList(data) {
    return request({
        url: '/alliance/list',
        method: 'post',
        data: stringify(data)
    })
}