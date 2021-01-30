import { getExtendlist, delExtend, saveAllianceExtend } from '@/services/union'
import { message } from 'antd'
const namespace = 'memorabilia'

export default {
    namespace,
    state: {
        memorabiliaConf: {
            currentPage: 1,
            pageSize: 10,
            category: '',
            alliance: localStorage.getItem('alliance'),
        },
        memorabiliaList: [],
        memorabiliaTotal: 0,
    },
    effects: {
        *fetchMemorabiliaList(_,{call, put, select}) {
            const searchConf = yield select(state => state[namespace].memorabiliaConf)
            const rsp = yield call(getExtendlist, searchConf)
            if(rsp && rsp.code === 0) {
                yield put({
                    type: 'changeMemorabiliaList',
                    payload: {
                        memorabiliaList: rsp.data.data.items,
                        memorabiliaTotal: rsp.data.data.totalNum
                    }
                })
            }
        },
        *toDelmemorailia({payload}, {call, put}) {
            const rsp = yield call(delExtend, payload)
            if(rsp && rsp.code === 0) {
                message.success('删除成功!')
                yield put({
                    type: 'fetchMemorabiliaList'
                })
            }
        },
        *saveAllianceExtend({payload}, {call}) {
            const rsp = yield call(saveAllianceExtend, payload)
            return rsp
        }
    },
    reducers: {
        changeMemorabiliaConf(state, {payload}) {
            return {
                ...state,
                memorabiliaConf: payload
            }
        },
        changeMemorabiliaList(state, {payload}) {
            return {
                ...state,
                memorabiliaList: payload.memorabiliaList,
                memorabiliaTotal: payload.memorabiliaTotal
            }
        }
    }
}