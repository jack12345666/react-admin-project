import { allianceOrgRank, allianceRankList, getScoreList, getWorkScoreList } from '@/services/rank'
const namespace = 'rank'
export default {
    namespace,
    state: {
        allianceRankList: [],
        allianceRanConf: {
            currentPage: 1,
            pageSize: 100,
        },
        orgRankList: [],
        orgRankConf: {
            currentPage: 1,
            pageSize: 10,
            alliance: localStorage.getItem('alliance')
        },
        orgRankTotal: 0,
        scoreList: [],
        scoreConf: {
            currentPage: 1,
            pageSize: 100,
            alliance: localStorage.getItem('alliance')
        },
        scoreListTotal: 0,
        unionScoreList: [],
        unionScoreConf: {
            currentPage: 1,
            pageSize: 1000,
            alliance: localStorage.getItem('alliance')
        },
        unionScoreListTotal: 0,
    },
    effects: {
        *fetchAllianceRankList(_, {call, put, select}) {
            const searchConf = yield select(state => state[namespace].allianceRanConf)
            const rsp = yield call(allianceRankList, searchConf)
            if(rsp && rsp.code === 0) {
                yield put({
                    type: 'changeAllianceRankList',
                    payload: rsp.data.data.items
                })
            }
        },
        *fetchOrgRankList(_, {call, put, select}) {
            const searchConf = yield select(state => state[namespace].orgRankConf)
            const rsp = yield call(allianceOrgRank, searchConf)
            if(rsp && rsp.code === 0) {
                yield put({
                    type: 'changeOrgRankList',
                    payload: {
                        orgRankList: rsp.data.data.items,
                        orgRankTotal: rsp.data.data.totalNum 
                    }
                })
            }
        },
        *fetchScoreList(_, {call, put, select}) {
            const searchConf = yield select(state => state[namespace].scoreConf)
            const rsp = yield call(getScoreList, searchConf)
            if(rsp && rsp.code === 0) {
                yield put({
                    type: 'changeScoreList',
                    payload: {
                        scoreList: rsp.data.data.items,
                        scoreListTotal: rsp.data.data.totalNum
                    }
                })
            }
        },
        *fetchUnionScoreList(_, {call, put, select}) {
            const searchConf = yield select(state => state[namespace].unionScoreConf)
            const rsp = yield call(getWorkScoreList, searchConf)
            if(rsp && rsp.code === 0) {
                yield put({
                    type: 'changeUnionScoreList',
                    payload: {
                        unionScoreList: rsp.data.data.items,
                        unionScoreListTotal: rsp.data.data.totalNum
                    }
                })
            }
        },

    },
    reducers: {
        changeAllianceRankList(state, {payload}) {
            return {
                ...state,
                allianceRankList: payload
            }
        },
        changeOrgRankConf(state, {payload}) {
            return {
                ...state,
                orgRankConf: payload
            }
        },
        changeOrgRankList(state, {payload}) {
            return {
                ...state,
                orgRankList: payload.orgRankList,
                orgRankTotal: payload.orgRankTotal
            }
        },
        changeScoreConf(state, {payload}) {
            return {
                ...state,
                scoreConf: payload
            }
        },
        changeScoreList(state, {payload}) {
            return {
                ...state,
                scoreList: payload.scoreList,
                scoreListTotal: payload.scoreListTotal
            }
        },
        changeUnionScoreList(state, {payload}) {
            return {
                ...state,
                unionScoreList: payload.unionScoreList,
                unionScoreListTotal: payload.unionScoreListTotal
            }
        }
    }
}