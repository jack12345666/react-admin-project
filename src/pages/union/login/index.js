import React, { Component } from 'react'
import { connect } from 'dva'
import * as dd from 'dingtalk-jsapi'
import { UserOutlined, LockOutlined, TabletOutlined, FolderOutlined  } from '@ant-design/icons'
import { Form, Input, Button, Tabs, message, notification } from 'antd'
import { getDdCorPId, ddLogin } from '@/services/union'
import { getBrowserType, IsPC } from '@/utils/utils'
import style from './index.scss'
const namespace = 'union'
const { TabPane } = Tabs
@connect(({ union, product }) => ({ union, product }))
class Login extends Component {
    state= {
        tabKey: 1
    }

    componentDidMount() {
        if(!IsPC()) {
            // message.warning("前往钉钉PC端操作")
            const key = `open${Date.now()}`;
            const btn = (
                <Button type="primary" size="small" onClick={() => notification.close(key)}>确定</Button>
              );
              notification.open({
                message: '提示',
                description:
                  '前往钉钉PC端操作',
                btn,
                key,
                duration: null
              });
            return
        }
        let that = this
        if(getBrowserType() === 'dd') {
            getDdCorPId().then(rsp => {
            if(rsp &&　rsp.code === 0) {
             dd.ready(function() {
               dd.runtime.permission.requestAuthCode({
                   corpId: rsp.data.corpId,
                   onSuccess: function(res) {
                     ddLogin(res.code).then(rsp => {
                         if(rsp && rsp.code === 0) {
                           localStorage.setItem('userId', rsp.data.data.id)
                           localStorage.setItem('token', rsp.data.data.token)
                           that.fetchInfo()
                         }else {
                            window.location.href = 'http://183.136.177.198:8443/mcenterHMH5/?redirect='+encodeURIComponent(window.location.href)
                         }
                     })
                   },
                   onFail : function(err) {
                     if (err.errorCode == 3) { 
                       window.location.href = 'http://183.136.177.198:8443/mcenterHMH5/?redirect='+encodeURIComponent(window.location.href)
                    }
                   }
               })
             })
            }
         })  
        }
     }
    checkTab = key => {
        this.setState({
            tabKey: key
        })
    }
    onFinish = values => {
        if(!IsPC()) {
            // message.warning("前往钉钉PC端操作")
            const key = `open${Date.now()}`;
            const btn = (
                <Button type="primary" size="small" onClick={() => notification.close(key)}>确定</Button>
              );
              notification.open({
                message: '提示',
                description:
                  '前往钉钉PC端操作',
                btn,
                key,
                duration: null
              });
            return
        }
        let that = this
        if(this.state.tabKey === 1) {
            this.props.dispatch({
                type: `${namespace}/toLogin`,
                payload: values
            }).then(rsp => {
                if(rsp && rsp.code === 0) {
                    localStorage.setItem('userId', rsp.data.data.id)
                    localStorage.setItem('token', rsp.data.data.token)
                     message.success('登录成功')
                     that.fetchInfo()
                }
            })
        } 
    }

    fetchInfo = () => {
        this.props.dispatch({
            type: `${namespace}/fetchUserInfo`,
            payload: localStorage.getItem('userId')
          }).then(() => {
            const { orgList, userName, userAvatar } = this.props['union'] 
            if(orgList.length > 0) {
                localStorage.setItem('alliance', orgList[0].alliances[0].id)
                localStorage.setItem('orgId', orgList[0].id)
                localStorage.setItem('orgName', orgList[0].name)
                localStorage.setItem('userName', userName)
                localStorage.setItem('userAvatar', userAvatar)
                localStorage.setItem('allianceLogo', orgList[0].alliances[0].logopath)
                localStorage.setItem('allianceName', orgList[0].alliances[0].name)
                let data = {
                    currentPage: 1,
                    pageSize: 10,
                    name: localStorage.getItem('orgName')
                  }
                this.props.dispatch({
                    type: `product/fetchStoreList`,
                    payload: data
                })
                this.props.dispatch({
                    type: `${namespace}/fetchUnionDetail`,
                    payload: orgList[0].alliances[0].id
                   }).then(() => {
                    const { unionDetail } = this.props[namespace]
                    if(unionDetail.operators.length > 0 && unionDetail.operators.find(item => item.orgUserId == localStorage.getItem('userId'))) {
                        localStorage.setItem('isPresident', 1)
                    }else {
                        localStorage.setItem('isPresident', 0)
                    }
                    window.location.href = window.location.href.substring(0, window.location.href.length - window.location.hash.length) + '#/redUnion/news'
                })
              }
           })
    }

    render() {
        const { tabKey } = this.state
        return (
            <div className={style.login}>
                <div className={style.loginBox}>
                <div className={style.descBox}>
                    <div className={style.logo}>
                        <img src={require('@/assets/redLogo.png')} alt="logo"/>
                    </div>
                    <div className={style.desc}>红盟单位管理后台</div>
                </div>
             <Tabs defaultActiveKey={tabKey} >
                <TabPane tab="账号密码登录" key="1" onChange={this.checkTab}>
                <Form
                    name="basic"
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={this.onFinish}
                >
                <Form.Item
                        name="no"
                        rules={[
                            {
                                required: true,
                                message: '请输入你的账号',
                            },
                        ]}
                    >
                        <Input prefix={<UserOutlined  className={style.icon} />}  style={{width: '368px', height: '40px'}} placeholder="账号" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: '请输入你的密码',
                            },
                        ]}
                    >
                         <Input
                            prefix={<LockOutlined  className={style.icon} />}
                            type="password"
                            placeholder="密码"
                            style={{width: '368px', height: '40px'}}
                            />
                    </Form.Item>
                    <Form.Item style={{textAlign: 'center'}}>
                        <Button type="primary" htmlType="submit" block style={{height: '40px'}}>登录</Button>
                    </Form.Item>
                    </Form>
                    
                </TabPane>
                <TabPane tab="手机号登录" key="2">
                <Form
                    name="basic"
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={this.onFinish}
                >
                <Form.Item
                        name="phone"
                        rules={[
                            {
                                required: true,
                                message: '请输入你的手机号',
                            },
                        ]}
                    >
                        <Input prefix={<TabletOutlined  className={style.icon} />}  style={{width: '368px', height: '40px'}} placeholder="手机号" />
                    </Form.Item>

                    <Form.Item
                        name="code"
                        rules={[
                            {
                                required: true,
                                message: '请输入你的验证码',
                            },
                        ]}
                    >
                         <Input
                            prefix={<FolderOutlined  className={style.icon} />}
                            placeholder="验证码"
                            style={{width: '368px', height: '40px'}}
                            addonAfter={<Button className={style.defaultBtn}>获取验证码</Button> }
                            />
                    </Form.Item> 
                    <Form.Item style={{textAlign: 'center'}}>
                        <Button type="primary" htmlType="submit" block style={{height: '40px'}}>登录</Button>
                    </Form.Item>
                  </Form>
                </TabPane>
              </Tabs>
                   
              
                </div>
            </div>
        )
    }
}

export default Login