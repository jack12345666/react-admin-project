import { getMyNeedsList, saveNeeds, auditNeeds, delNeeds,  getNeedsDetail, auditNeedsList, changeNeedState } from '@/services/needs'
import { message } from 'antd'
const namespace = 'needs'

export default {
    namespace,
    state: {
        needsList: [],
        needsConf: {
            currentPage: 1,
            pageSize: 10,
            alliance: localStorage.getItem('alliance'),
            companyId: localStorage.getItem('orgId')
        },
        needsListTotal: 0,
        needsDetail: null,
        needsAuditConf: {
            currentPage: 1,
            pageSize: 10,
            auditType: 0,
            alliance: localStorage.getItem('alliance'),
        },
        needsAuditList: [],
        needsAuditTotal: 0,
    },
    effects: {
       *fetchNeedsList(_, {call, select, put}) {
           const searchConf = yield select(state => state[namespace].needsConf)
           const rsp = yield call(getMyNeedsList, searchConf)
           if(rsp && rsp.code === 0) {
               yield put({
                   type: 'changeNeedsList',
                   payload: {
                      needsList: rsp.data.data.items,
                      needsListTotal: rsp.data.data.totalNum
                   }
               })
           }
       },
       *fetchAuditList(_, {call, select, put}) {
        const searchConf = yield select(state => state[namespace].needsAuditConf)
        const rsp = yield call(auditNeedsList, searchConf)
        if(rsp && rsp.code === 0) {
            yield put({
                type: 'changeNeedsAuditList',
                payload: {
                    needsAuditList: rsp.data.data.items,
                    needsAuditTotal: rsp.data.data.totalNum
                }
            })
        }
    },
       *saveNeeds({payload}, {call}) {
           const rsp = yield call(saveNeeds, payload)
           return rsp
       },
       *delNeeds({payload}, {call, put}) {
            const rsp = yield call(delNeeds, payload)
            if(rsp && rsp.code === 0) {
                message.success('删除成功!')
                yield put({
                    type: 'fetchNeedsList'
                })
            }
       },
       *auditNeeds({payload}, {call}) {
           const rsp = yield call(auditNeeds, payload)
           return rsp
       },
       *fetchNeedsDetail({payload}, {call, put}) {
           const rsp = yield call(getNeedsDetail, payload)
           if(rsp && rsp.code === 0) {
               yield put({
                   type: 'changeNeedsDetail',
                   payload: rsp.data.data
               })
           }
       },
       *toChangeNeedState({payload}, {call, put}) {
           const rsp = yield call(changeNeedState, payload)
          if(rsp && rsp.code === 0) {
              message.success("操作成功")
              yield put({
                  type: 'fetchNeedsList'
              })
          }
       },
       *auditChangeNeedState({payload}, {call, put}) {
        const rsp = yield call(changeNeedState, payload)
       if(rsp && rsp.code === 0) {
           message.success("操作成功")
           yield put({
               type: 'fetchAuditList'
           })
       }
    }


    },
    reducers: {
        changeNeedsList(state, {payload}) {
            return {
                ...state,
                needsList: payload.needsList,
                needsListTotal: payload.needsListTotal
            }
        },
        changeNeedsAuditList(state, {payload}) {
            return {
                ...state,
                needsAuditList: payload.needsAuditList,
                needsAuditTotal: payload.needsAuditTotal
            }
        },
        changeNeedsConf(state, {payload}) {
            return {
                ...state,
                needsConf: payload
            }
        },
        changeNeedsAuditConf(state, {payload}) {
            return {
                ...state,
                needsAuditConf: payload
            }
        },
        changeNeedsDetail(state, {payload}) {
            return {
                ...state,
                needsDetail: payload
            }
        }
    }
}