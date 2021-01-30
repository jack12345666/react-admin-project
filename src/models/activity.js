import { getCreActivityList, editActivity, deleteActivity, getEnrollList, getMyEnrollList, checkEnroll, getEnrollDetail, auditActivityList,
   toAuditActivity, changeActivityState } from '@/services/activity'
import { getMyOrg } from '@/services/union'
import { message } from 'antd'
const namespace = 'activity'
export default {
  namespace,
  state: {
    myActivityConf: {
      currentPage: 1,
      pageSize: 10,
      alliance: localStorage.getItem('alliance'),
      companyId: localStorage.getItem('orgId')
    },
    myActivityList: [],
    myActivityTotal: 0,
    companyList: [],
    activityListConf: {
      currentPage: 1,
      pageSize: 10,
      status: '',
      alliance: localStorage.getItem('alliance'),
      companyId: localStorage.getItem('orgId')
    },
    activityList: [],
    activityListTotal: 0,
    enrollListConf: {
      currentPage: 1,
      pageSize: 10, 
      activityId: null,
      checkStatus: '',
      alliance: localStorage.getItem('alliance'),
      companyId: localStorage.getItem('orgId')
    },
    enrollList: [],
    enrollTotal: 0,
    showEnrollList: false,
    showEnrollCheck: false,
    activityDetail: null,
    activityId: null,
    needAllow: null,
    enrollDetail: null,
    auditActivityConf: {
      currentPage: 1,
      pageSize: 10, 
      auditType: 0,
      alliance: localStorage.getItem('alliance'),
    },
    auditActivityList: [],
    auditActivityTotal: 0,
  },
  effects: {
    *fetchMyActivity(_, {call, put, select}) {
       const searchConf = yield select(state => state[namespace].myActivityConf)
       const rsp = yield call(getMyEnrollList, searchConf)
       if(rsp && rsp.code === 0) {
          yield put({
            type: 'changeMyActivity',
            payload: {
              myActivityList: rsp.data.data.items,
              myActivityTotal: rsp.data.data.totalNum
            }
         })
       }    
    },
    *fetchActivityList(_,{call, put, select}) {
       const searchConf = yield select(state => state[namespace].activityListConf)
       const rsp = yield call(getCreActivityList, searchConf)
       if(rsp && rsp.code === 0) {
       yield put({
         type: 'changeActivityList',
         payload: {
          activityList: rsp.data.data.items,
          activityListTotal: rsp.data.data.totalNum,
         }
       }) 
      }
      },
      *fetchAuditActivity(_, {call, put, select}) {
        const searchConf = yield select(state => state[namespace].auditActivityConf)
        const rsp = yield call(auditActivityList, searchConf)
        if(rsp && rsp.code === 0) {
           yield put({
             type: 'changeAuditActivity',
             payload: {
              auditActivityList: rsp.data.data.items,
              auditActivityTotal: rsp.data.data.totalNum
             }
          })
        }    
     },
     *toAuditActivity({payload}, {call}) {
        const rsp = yield call(toAuditActivity, payload)
        return rsp
     },
      *fetchEnrollList(_,{call, put, select}) {
        const searchConf = yield select(state => state[namespace].enrollListConf)
        const rsp = yield call(getEnrollList, searchConf)
        if(rsp && rsp.code === 0) {
           yield put({
            type: 'changeEnrollList',
            payload: {
              enrollList: rsp.data.data.items,
              enrollTotal: rsp.data.data.totalNum,
            }
          }) 
        }
       },
       *fetchMyOrg(_, {call, put}) {
        const rsp = yield call(getMyOrg, localStorage.getItem('userId')) 
        if(rsp && rsp.code === 0) {
           yield put({
               type: 'changeCompanyList',
               payload: rsp.data.data
           })
        }
      },
       *saveActivity({payload}, {call, put}) {
         const rsp = yield call(editActivity, payload)
         return rsp
       },
       *toDeleteActivity({payload}, {call, put}) {
          const rsp  = yield call(deleteActivity, payload)
          if(rsp && rsp.code === 0) {
            message.success('删除成功')
            yield put({
              type: 'fetchActivityList'
            })
          }
       },
       *toCheckEnroll({payload}, {call, put}) {
         const rsp = yield call(checkEnroll, payload)
         if(rsp && rsp.code === 0) {
           message.success('审核成功')
           yield put({
             type: 'changeEnrollCheck',
             payload: false
           })
           yield put({
             type: 'fetchEnrollList'
           })
         }
       },
       *fetchEntrollDetail({payload}, {call, put}) {
         const rsp = yield call(getEnrollDetail, payload)
         if(rsp && rsp.code === 0) {
            yield put({
              type: 'changeEnrollDetail',
              payload: rsp.data.data
            })
         }
       },
      *toChangeActivityState({payload}, {call, put}) {
        const rsp = yield call(changeActivityState, payload)
        if(rsp && rsp.code === 0) {
          message.success("操作成功")
          yield put({
            type: 'fetchActivityList'
          })
        }
      },
      *auditChangeActivityState({payload}, {call, put}) {
        const rsp = yield call(changeActivityState, payload)
        if(rsp && rsp.code === 0) {
          message.success("操作成功")
          yield put({
            type: 'fetchAuditActivity'
          })
        }
      },
  },
  reducers: {
    changeMyActivityConf(state, {payload}) {
      return {
        ...state,
        myActivityConf: payload
      }
    },
    changeMyActivity(state, {payload}) {
      return {
        ...state,
        myActivityList: payload.myActivityList,
        myActivityTotal: payload.myActivityTotal
      }
    },
    changeAuditActivity(state, {payload}) {
        return {
          ...state,
          auditActivityList: payload.auditActivityList,
          auditActivityTotal: payload.auditActivityTotal
        }
    },
    changeActivityListConf(state, {payload}) {
      return {
        ...state,
        activityListConf: payload
      }
    },
    changeAuditConf(state, {payload}) {
      return {
        ...state,
        auditActivityConf: payload
      }
    },
    changeCompanyList(state, {payload}) {
      return {
        ...state,
        companyList: payload
      }
    },
    changeActivityList(state, {payload}) {
      return {
        ...state,
        activityList: payload.activityList,
        activityListTotal: payload.activityListTotal
      }
    },
    changeEnrollListConf(state, {payload}) {
      return {
        ...state,
        enrollListConf: payload
      }
    },
    changeEnrollList(state, {payload}) {
      return {
        ...state,
        enrollList: payload.enrollList,
        enrollTotal: payload.enrollTotal
      }
    },
    changeEnrollCheck(state, {payload}) {
      return {
        ...state,
        showEnrollCheck: payload
      }
    },
    changeShowEnrollList(state, {payload}) {
      return {
        ...state,
        showEnrollList: payload.showEnrollList,
        activityId: payload.activityId
      }
    },
    changeActivityDetail(state, {payload}) {
      return {
        ...state,
        activityDetail: payload
      }
    },
    changeNeedAllow(state, {payload}) {
      return {
        ...state,
        needAllow: payload
      }
    },
    changeEnrollDetail(state, {payload}) {
      return {
        ...state,
        enrollDetail: payload
      }
    }
  }
}