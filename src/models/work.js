import { getMonthWorkPresident, getMonthWorkUser, saveOrUpdateJH, saveOrUpdateLH, saveOrUpdateZJ,
getYearWorkPresident, getYearWorkUser, saveOrUpdateYearJH, saveOrUpdateYearZJ, unionWorkType, 
getWorkEventUser, getWorkEventPresident, deleteUnionWork, editUnionWork } from '@/services/work'
const namespace = 'work'
export default {
    namespace,
    state: {
        tipsConf: {
            allianceId: localStorage.getItem('alliance'),
            // status: 0,
        },
        tipsList: [],
        workConf: {
            allianceId: localStorage.getItem('alliance'),
        },
        workList: [],
        workDetail: null,
        unionWorkConf: {
            currentPage: 1,
            pageSize: 4,
            allianceId: localStorage.getItem('alliance'),
        },
        unionWorkTotal: 0,
        unionWorkList: [],
        unionTypeList: [],
    },
    effects: {
        *fetchTipsList({payload}, {call, put, select}) {
            const searchConf = yield select(state => state[namespace].tipsConf)
            let rsp = null
            if(payload === 2) {
                 rsp = yield call(getYearWorkPresident, searchConf)
            }else {
                  rsp = yield call(getMonthWorkPresident, searchConf)
            } 
            if(rsp && rsp.code === 0) {
                yield put({
                type: 'changeTipsList',
                payload: rsp.data.data.filter(item => item.checkStatus !== 1)
             }) 
            }
          
        },
        *fetchWorkList({payload}, {call, put, select}) {
            const searchConf = yield select(state => state[namespace].workConf)
            let rsp = null
            if(payload === 2) {
                 rsp = yield call(getYearWorkUser, searchConf) 
            }else {
                 rsp = yield call(getMonthWorkUser, searchConf) 
            }
            if(rsp && rsp.code === 0) {
              yield put({
                type: 'changeWorkList',
                payload: rsp.data.data
             }) 
            }     
        },
        *saveOrUpdateJH({payload}, {call}) {
            const rsp = yield call(saveOrUpdateJH, payload)
            return rsp
        },
        *saveOrUpdateLH({payload}, {call}) {
            const rsp = yield call(saveOrUpdateLH, payload)
            return rsp
        },
        *saveOrUpdateZJ({payload}, {call}) {
            const rsp = yield call(saveOrUpdateZJ, payload)
            return rsp
        },
        *saveOrUpdateYearJH({payload}, {call}) {
            const rsp = yield call(saveOrUpdateYearJH, payload)
            return rsp
        },
        *saveOrUpdateYearZJ({payload}, {call}) {
            const rsp = yield call(saveOrUpdateYearZJ, payload)
            return rsp
        },
        *fetchUnionTypeList({payload}, {call, put}) {
            const rsp = yield call(unionWorkType, payload)
            if(rsp && rsp.code === 0) {
                yield put({
                    type: 'changeUnionTypeList',
                    payload: rsp.data.data
                })
            }
        },
        *fetchUnionWorkList(_, {call, put, select}) {
            let rsp = null
            const searchConf = yield select(state => state[namespace].unionWorkConf)
            if(localStorage.getItem('isPresident') == 1) {
                 rsp = yield call(getWorkEventPresident, searchConf)
            }else {
                rsp = yield call(getWorkEventUser, searchConf)
            }
            if(rsp && rsp.code === 0) {
                yield put({
                    type: 'changeUnionWorkList',
                    payload: {
                        unionWorkTotal: rsp.data.data.totalNum,
                        unionWorkList: rsp.data.data.items
                    }
                })
            } 
        },
        *toDeteleUnionWork({payload}, {call}) {
            const rsp = yield call(deleteUnionWork, payload)
            return rsp
        },
        *toEditUnionWork({payload}, {call}) {
            const rsp = yield call(editUnionWork, payload)
            return rsp
        }

    },
    reducers: {
        changeTipsList(state, {payload}) {
            return {
                ...state,
                tipsList: payload
            }
        },
        changeTipsConf(state, {payload}) {
            return {
                ...state,
                tipsConf: payload
            }
        },
        changeWorkList(state, {payload}) {
            return {
                ...state,
                workList: payload,
            }
        },
        changeWorkConf(state, {payload}) {
            return {
                ...state,
                workConf: payload
            }
        },
        changeWorkDetail(state, {payload}) {
            return {
                ...state,
                workDetail: payload
            }
        },
        changeUnionTypeList(state, {payload}) {
            return {
                ...state,
                unionTypeList: payload
            }
        },
        changeUnionWorkConf(state, {payload}) {
            return {
                ...state,
                unionWorkConf: payload
            }
        },
        changeUnionWorkList(state, {payload}) {
            return {
                ...state,
                unionWorkTotal: payload.unionWorkTotal,
                unionWorkList: payload.unionWorkList
            }
        },
    }
}