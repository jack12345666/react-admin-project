import {appealList, addCommucation, appealDetail, acceptAppeal, matterAppeal} from '@/services/appeal'

const namespace = 'appeal'

export default {
    namespace,
    state: {
        appealList: [],
        appealListTotal: 0,
        appealConf: {
            currentPage: 1,
            pageSize: 10,
            category:'0106',
            allianceId: localStorage.getItem('alliance'),
            innerStatus:'',
            titleLike:'',
        },
        appealDetail: null,
    },
    effects: {
        *fetchAppealList(_,{call, select, put}) {
            const searchConf = yield select(state => state[namespace].appealConf)
            const rsp = yield call(appealList, searchConf)
            if(rsp && rsp.code === 0){
                 yield put({
                type: 'changeAppealList',
                payload: {
                    appealListTotal: rsp.data.data.totalNum,
                    appealList:rsp.data.data.items
                }
                })
            } 
        },
        *fetchAppealDetail({payload}, {call, put}) {
            const rsp = yield call(appealDetail, payload)
            if(rsp && rsp.code === 0) {
                yield put({
                    type: 'changeAppealDetail',
                    payload: rsp.data.data
                })
            }
        },
        *fetchAcceptAppeal({payload}, {call, put}){
            const rsp = yield call (acceptAppeal, payload)
            if(rsp && rsp.code === 0){
                return rsp
            }
        },
        *appendCommucation({payload},{call}){
            const rsp = yield call(addCommucation, payload)
           return rsp
        },
        *concludeAppeal({payload},{call}){
            const rsp = yield call(matterAppeal, payload)
            return rsp
        }
    },
    reducers: {
        changeAppealList(state, {payload}) {
            return {
                ...state,
                appealList: payload.appealList,
                appealListTotal: payload.appealListTotal
            }
        },
        changeAppealConf(state, {payload}) {
            return {
                ...state,
                appealConf: payload
            }
        },
        changeAppealDetail(state, {payload}) {
        return {
            ...state,
            appealDetail: payload
        }
      },
    },
 
}