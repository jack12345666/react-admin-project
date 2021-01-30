import { getUserInfo, getUnionDetail, editUnionInfo, getOrgInfo, editOrgInfo, ddLogin, ddShare, getUnionList } from '@/services/union'
import { routerRedux } from 'dva/router'
import { stringify } from 'querystring'
import { userLogin } from '@/services/common'
import { message } from 'antd'
const namespace = 'union'
export default {
  namespace,
  state: {
    memberListConf: {
      current: 1,
      pageSize: 10
    },
    memberListTotal: 0,
    memberList: [],
    unionDetail: null,
    userName: '',
    userAvatar: '',
    orgList: [],
    allianceList: [],
    orgDetail: null,
    unionListConf: {
      currentPage: 1,
      pageSize: 100,
      name: ''
    },
    unionList: []
  },

  effects: {
    *fetchUserInfo({payload}, {call, put}) {
      if (!localStorage.getItem('userId')) {
        yield put(
          routerRedux.replace({
            pathname: '/',
            search: stringify({
              redirect: window.location.href
            })
          })
        )
        message.error('未登录，请重新登录')
        return
      }
      const rsp = yield call(getUserInfo, payload)
      if(rsp && rsp.code === 0) {
        yield put({
          type: 'changeOrgOfUnion',
          payload: {
              orgList: rsp.data.data.organizations,
              userName: rsp.data.data.name,
              userAvatar: rsp.data.data.avatar
          }
        })
         return rsp
      }
     
    },
    *fetchUnionDetail({payload}, {call, put}) {
      const rsp = yield call(getUnionDetail, payload)
      if(rsp && rsp.code === 0) {
        yield put({
          type: 'changeUnionDetail',
          payload: rsp.data.data
        })
      }
    },
    *toEditUnionInfo({payload}, {call, put}) {
      const rsp = yield call(editUnionInfo, payload)
      return rsp
    },
    *toLogin({payload}, {call}) {
      const rsp = yield call(userLogin, payload)
      return rsp
    },
    *fetchOrgDetail({payload}, {call, put}) {
      const rsp = yield call(getOrgInfo, payload)
      if(rsp && rsp.code === 0) {
        yield put({
          type: 'changeOrgDetail',
          payload: rsp.data.data
        })
      }
    },
    *editOrgInfo({payload}, {call}) {
      const rsp = yield call(editOrgInfo, payload)
      return rsp
    },
    *codeLogin({payload},{call}) {
      const rsp = yield call(ddLogin, payload)
      return rsp
    },
    *dingdingShare({payload}, {call}) {
      const rsp = yield call(ddShare, payload)
      return rsp
    },
    *fetchUnionList({_}, {select, call, put}) {
      const searchConf = yield select(state => state[namespace].unionListConf)
      const rsp = yield call(getUnionList, searchConf)
      if(rsp.code === 0) {
        yield put({
          type: 'changeUnionList',
          payload: rsp.data.data.items
        })
      }
    }
  },

  reducers: {
     changeUnionDetail(state, {payload}) {
       return {
         ...state,
         unionDetail: payload
       }
     },
     changeOrgOfUnion(state, {payload}) {
       return {
         ...state,
         orgList: payload.orgList,
         userName: payload.userName,
         userAvatar: payload.userAvatar
       }
     },
     changeOrgDetail(state, {payload}) {
       return {
         ...state,
         orgDetail: payload
       }
     },
     changeUnionListConf(state, {payload}) {
       return {
         ...state,
         unionListConf: payload
       }
     },
     changeUnionList(state, {payload}) {
       return {
         ...state,
         unionList: payload
       }
     }
   }
}
