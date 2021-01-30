import React from 'react'
import zhCN from 'antd/es/locale/zh_CN'
import { ConfigProvider } from 'antd'
import { Router, Route, Switch } from 'dva/router'
import RedUnion from './router/redUnion'
import Login from '@/pages/union/login'
import './router/style.scss'
import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')


function RouterConfig({ history }) {
  return (
    <ConfigProvider locale={zhCN}>
    <Router history={history}>
      <Switch>
        <Route path="/redUnion/" component={RedUnion}/>
        <Route path="/" component={Login}/>
      </Switch>
    </Router>
    </ConfigProvider>
  )
}

export default RouterConfig
