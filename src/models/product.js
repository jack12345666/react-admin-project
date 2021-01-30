import { getProductList, saveProduct, getStoreList, getStoreDetail, changeProductState, getProductDetail, auditGoods, auditGoodsList } from '@/services/product'
import { getCateGory } from '@/services/common'
import { message } from 'antd'
const namespace = 'product'
export default {
    namespace,
    state: {
        productConf: {
            currentPage: 1,
            pageSize: 10,
        },
        productList: [],
        productTotal: 0,
        storeList: [],
        storeDetail: null,
        productKind: [],
        productTypeList: [],
        productDetail: null,
        auditConf: {
            currentPage: 1,
            pageSize: 10,
            auditType: 0,
            alliance: localStorage.getItem('alliance')
        },
        auditList: [],
        auditTotal: 0
    },

    effects: {
        *fetchProductList(_, {call, put, select}) {
            const searchConf = yield select(state => state[namespace].productConf)
            const rsp = yield call(getProductList, searchConf)
            if(rsp && rsp.code === 0) {
                yield put({
                type: 'changeProductList',
                payload: {
                    productList: rsp.data.data.items,
                    productTotal: rsp.data.data.totalNum
                }
             })
            } 
        },
        *fetchAuditList(_, {call, put, select}) {
            const searchConf = yield select(state => state[namespace].auditConf)
            const rsp = yield call(auditGoodsList, searchConf)
            if(rsp && rsp.code === 0) {
                yield put({
                type: 'changeAuditList',
                payload: {
                    auditList: rsp.data.data.items,
                    auditTotal: rsp.data.data.totalNum
                }
             })
            } 
        },
        *saveProduct({payload}, {call}) {
            const rsp = yield call(saveProduct, payload)
            return rsp
        },
        *fetchStoreList({payload}, {call, put}) {
            const rsp = yield call(getStoreList, payload)
            if(rsp.data.data.items.length > 0) {
                localStorage.setItem('storeId', rsp.data.data.items[0].id)
                localStorage.setItem('storeName', rsp.data.data.items[0].name)
            }
            if(rsp && rsp.code === 0) {
                yield put({
                    type: 'changeStoreList',
                    payload: rsp.data.data.items
                })
            }
        },
        *fetchStoreDetail({payload}, {call, put}) {
            const rsp = yield call(getStoreDetail, payload)
            if(rsp && rsp.code === 0) {
                yield put({
                    type: 'changeStoreDetail',
                    payload: rsp.data.data
                })
            }
        },
        *changeProductState({payload}, {call, put}) {
            const rsp = yield call(changeProductState, payload)
            if(rsp && rsp.code === 0) {
                message.success('操作成功！')
                yield put({
                    type: 'fetchProductList'
                })
            }
        },
        *fetchCategoryList({payload}, {call, put}) {
            const rsp = yield call(getCateGory)
            if(rsp && rsp.code === 0) {
              let firstArr = []
              let secondArr = []
              if(rsp.data.data.length > 0) {
                  firstArr = rsp.data.data.filter(item => item.category === payload.firstId && !item.parentId)
                  if(payload.secondId) {
                    secondArr = rsp.data.data.filter(item => item.category === payload.firstId && item.parentId === +payload.secondId )
                  }
                  yield put({
                      type: 'changeProductTypeList',
                      payload: {
                         productTypeList: secondArr,
                         productKind: firstArr
                      }
                  }) 
              } 
            } 
        },
        *fetchProductDetail({payload}, {call, put}) {
            const rsp = yield call(getProductDetail, payload)
            if(rsp && rsp.code === 0) {
                yield put({
                    type: 'changeProductDetail',
                    payload: rsp.data.data
                })
            }
        },
        *toAuditGoods({payload}, {call}) {
            const rsp = yield call(auditGoods, payload) 
            return rsp
        },
        *auditChangeState({payload}, {call, put}) {
            const rsp = yield call(changeProductState, payload)
            if(rsp && rsp.code === 0) {
                message.success('操作成功！')
                yield put({
                    type: 'fetchAuditList'
                })
            }
        },
    },

    reducers: {
        changeProductList(state, {payload}) {
           return {
               ...state,
               productList: payload.productList,
               productTotal: payload.productTotal
           }     
        },
        changeAuditList(state, {payload}) {
            return {
                ...state,
                auditList: payload.auditList,
                auditTotal: payload.auditTotal
            }     
        },
        changeProductConf(state, {payload}) {
            return {
                ...state,
                productConf: payload
            }
        },
        changeAuditConf(state, {payload}) {
            return {
                ...state,
                auditConf: payload
            }
        },
        changeStoreList(state, {payload}) {
            return {
                ...state,
                storeList: payload
            }
        },
        changeStoreDetail(state, {payload}) {
            return {
                ...state,
                storeDetail: payload
            }
        },
        changeProductTypeList(state, {payload}) {
            return {
                ...state,
                productTypeList: payload.productTypeList,
                productKind: payload.productKind
            }
        },
        changeProductDetail(state, {payload}) {
            return {
                ...state,
                productDetail: payload
            }
        },

    }
}