import { getMemberList, delMember, getOrgList, saveAlliceOrg } from '@/services/union'
import { message } from 'antd'
const namespace = 'member'
export default {
    namespace,
    state: {
        memberListConf: {
            currentPage: 1,
            pageSize: 10,
            contact: '',
            name: ''
        },
        memberListTotal: 0,
        memberList: [],
        orgConf: {
            currentPage: 1,
            pageSize: 10,
        },
        orgList: [],
    },

    effects: {
        *fetchMemberList(_, { call, put, select }) {
            const searchConf = yield select(state => state[namespace].memberListConf)
            const rsp = yield call(getMemberList, searchConf)
            if (rsp && rsp.code === 0) {
                yield put({
                    type: 'changeMemberList',
                    payload: {
                        memberList: rsp.data.data.items,
                        memberListTotal: rsp.data.data.totalNum
                    }
                })
            }
        },
        *toDelMember({ payload }, { call, put }) {
            const rsp = yield call(delMember, payload)
            if (rsp && rsp.code === 0) {
                message.success('删除成功')
                yield put({
                    type: 'fetchMemberList'
                })
            }
        },
        *fetchOrgList(_, { call, put, select }) {
            const searchConf = yield select(state => state[namespace].orgConf)
            const orgList = yield select(state => state[namespace].orgList)
            const rsp = yield call(getOrgList, searchConf)
            if (rsp && rsp.code === 0) {
                let arr = orgList.concat(rsp.data.data.items)
                yield put({
                    type: 'changeOrgList',
                    payload: arr
                })
            }
        },
        *saveAllianceOrg({payload}, {call}) {
            const rsp = yield call(saveAlliceOrg, payload)
            return rsp
        }
    },
    reducers: {
        changeMemberList(state, { payload }) {
            return {
                ...state,
                memberList: payload.memberList,
                memberListTotal: payload.memberListTotal
            }
        },
        changeMemberListConf(state, { payload }) {
            return {
                ...state,
                memberListConf: payload
            }
        },
        changeOrgConf(state, { payload }) {
            return {
                ...state,
                orgConf: payload
            }
        },
        changeOrgList(state, { payload }) {
            return {
                ...state,
                orgList: payload
            }
        }
    }
}
