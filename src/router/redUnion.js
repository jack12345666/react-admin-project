import React, { Component } from 'react';
import { connect } from 'dva'
import { Menu } from 'antd';
import { Route, Link  } from 'dva/router';
import { ClusterOutlined, ShopOutlined, CrownOutlined, VideoCameraOutlined, FileDoneOutlined, RiseOutlined, TrophyOutlined, ExceptionOutlined } from '@ant-design/icons';
import MyHeader from '@/components/header/Header'
import Introduce from '@/pages/union/introduce'
import Member from '@/pages/union/member'
import Memorabilia from '@/pages/union/memorabilia'
import News from '@/pages/union/news'
import Honor from '@/pages/union/honor'
import Product from '@/pages/union/resources/product'
import Serve from '@/pages/union/resources/serve'
import JoinActivity from '@/pages/union/resources/activity/myActivity'
import AddActivity from '@/pages/union/resources/activity/add'
import ActivityList from '@/pages/union/resources/activity/activityList'
import EditActivity from '@/pages/union/resources/activity/edit'
import Needs from '@/pages/union/resources/needs'
import ProductCheck from '@/pages/union/productCheck'
import ServiceCheck from '@/pages/union/serveCheck'
import ActivityCheck from '@/pages/union/activityCheck'
import NeedsCheck from '@/pages/union/needsCheck'
import RoutineWork from '@/pages/union/working/routineWork'
import UniqueWork from '@/pages/union/working/uniqueWork'
import WorkDetail from '@/pages/union/working/workDetail'
import EditWork from '@/pages/union/working/editWork'
import Rank from '@/pages/union/rank'
import Accepted from '@/pages/union/appeal/accepted'
import AppealList from '@/pages/union/appeal/appealList'
import Completed from '@/pages/union/appeal/completed'
import WaitAccepted from '@/pages/union/appeal/waitAccepted'
import Style from './index.scss'

const namespace = 'union'
const { SubMenu } = Menu
@connect(({ union, product }) => ({ union, product }))
class Index extends Component {
    state = {
        isMoreOrg: false,
        isMoreAlliance: false,
        orgList: []
    }
    componentDidMount() {
        this.props.dispatch({
            type: `${namespace}/fetchUserInfo`,
            payload: localStorage.getItem('userId')
        }).then(() => {
            const { orgList } = this.props[namespace] 
            this.setState({
                isMoreOrg: orgList.length > 1 ? true : false,
                isMoreAlliance: (orgList.length > 0 && orgList[0].alliances.length > 1) ? true : false,
                orgList: orgList
            })
        })
    }
    render() {
        const openKeysObj  = {
            '#/redUnion/routineWork': ['sub1'],
            '#/redUnion/uniqueWork': ['sub1'],

            '#/redUnion/productManage': ['sub2'],
            '#/redUnion/serviceManage': ['sub2'],
            '#/redUnion/needsManage': ['sub2'],

            '#/redUnion/joinActivity': ['sub2','sub3'],
            '#/redUnion/addActivity': ['sub2','sub3'],
            '#/redUnion/activityList': ['sub2','sub3'],

            '#/redUnion/introduce': ['sub4'],
            '#/redUnion/member': ['sub4'],
            '#/redUnion/memorabilia': ['sub4'],
            '#/redUnion/honor': ['sub4'],

            '#/redUnion/productCheck': ['sub5'],
            '#/redUnion/serviceCheck': ['sub5'],
            '#/redUnion/activityCheck': ['sub5'],
            '#/redUnion/needsCheck': ['sub5'],

            '#/redUnion/accepted': ['sub6'],
            '#/redUnion/appealList': ['sub6'],
            '#/redUnion/completed': ['sub6'],
            '#/redUnion/waitAccepted': ['sub6'],

        }
        const selectedKeyObj = { 
            '#/redUnion/introduce': ['1'],
            '#/redUnion/member': ['2'],
            '#/redUnion/memorabilia': ['3'],
            '#/redUnion/news': ['4'],
            '#/redUnion/honor': ['5'],
            '#/redUnion/routineWork': ['6'],
            '#/redUnion/uniqueWork': ['7'],
            '#/redUnion/productManage': ['11'],
            '#/redUnion/serviceManage': ['12'],
            '#/redUnion/joinActivity': ['13'],
            '#/redUnion/addActivity': ['14'],
            '#/redUnion/activityList': ['15'],
            '#/redUnion/needsManage': ['16'],
            '#/redUnion/productCheck': ['17'],
            '#/redUnion/serviceCheck': ['18'],
            '#/redUnion/activityCheck': ['19'],
            '#/redUnion/needsCheck': ['20'],
            '#/redUnion/rank': ['21'],
            '#/redUnion/waitAccepted': ['22'],
            '#/redUnion/accepted': ['23'],
            '#/redUnion/completed': ['24'],
            '#/redUnion/appealList': ['25'],
        }

        const workRightObj = {
            '#/redUnion/routineWork': true,
            '#/redUnion/uniqueWork': true,
            '#/redUnion/rank': true,
        }
        const { isMoreOrg, isMoreAlliance, orgList } = this.state
        return (
            <div className={Style.container}>
                <div className={Style.header}>
                    <MyHeader isMoreOrg={isMoreOrg} isMoreAlliance={isMoreAlliance} orgList={orgList}/>
                </div>
                <div className={Style.content}>
                    <div className={Style.left}>
                        <Menu
                            mode="inline"
                            defaultSelectedKeys={selectedKeyObj[window.location.hash]}
                            defaultOpenKeys={openKeysObj[window.location.hash]}
                            style={{ height: '100%', width: '200px',background: 'rgba(191, 158, 158, 0.82)', color: '#4B1111' }}
                        >
                            <Menu.Item style={{ borderBottom: '1px solid #f5f5f5' }}>
                                <ClusterOutlined  style={{ fontSize: '20px' }} />
                                <span style={{ fontSize: '18px' }}>我的联盟</span>
                            </Menu.Item>
                            <Menu.Item key="4" icon={<VideoCameraOutlined />}><Link to="/redUnion/news">联盟动态</Link></Menu.Item>
                            <SubMenu key="sub4" icon={<CrownOutlined />} title="联盟风采">
                                <Menu.Item key="1"><Link to="/redUnion/introduce">联盟简介</Link></Menu.Item>
                                <Menu.Item key="2"><Link to="/redUnion/member">联盟成员</Link></Menu.Item>
                                <Menu.Item key="3"><Link to="/redUnion/memorabilia">联盟大事记</Link></Menu.Item>
                                <Menu.Item key="5"><Link to="/redUnion/honor">联盟荣誉</Link></Menu.Item>
                            </SubMenu>
                           <SubMenu key="sub1" icon={<RiseOutlined />} title="联盟直达">
                                <Menu.Item key="6"><Link to="/redUnion/routineWork">常规工作</Link></Menu.Item>
                                <Menu.Item key="7"><Link to="/redUnion/uniqueWork">特色工作</Link></Menu.Item>
                            </SubMenu>
                            <SubMenu key="sub2" icon={<ShopOutlined />} title="我的资源">
                                <Menu.Item key="11"><Link to="/redUnion/productManage">资源项目</Link></Menu.Item>
                                <Menu.Item key="12"><Link to="/redUnion/serviceManage">服务提供</Link></Menu.Item>
                                <Menu.Item key="16"><Link to="/redUnion/needsManage">购买需求</Link></Menu.Item> 
                                <SubMenu key="sub3" title="活动报名">
                                 <Menu.Item key="13"><Link to="/redUnion/joinActivity">参与的活动</Link></Menu.Item>
                                 <Menu.Item key="14"><Link to="/redUnion/addActivity">发布新活动</Link></Menu.Item>
                                 <Menu.Item key="15"><Link to="/redUnion/activityList">发布的活动</Link></Menu.Item>
                                </SubMenu>
                            </SubMenu>
                            {localStorage.getItem('isPresident') == 1 && <SubMenu key="sub5" icon={<FileDoneOutlined />} title="待我审核">
                                <Menu.Item key="17"><Link to="/redUnion/productCheck">资源审核</Link></Menu.Item>
                                <Menu.Item key="18"><Link to="/redUnion/serviceCheck">服务审核</Link></Menu.Item>
                                <Menu.Item key="20"><Link to="/redUnion/needsCheck">需求审核</Link></Menu.Item>
                                <Menu.Item key="19"><Link to="/redUnion/activityCheck">活动审核</Link></Menu.Item>
                            </SubMenu>}
                            <Menu.Item key="21" icon={<TrophyOutlined />}><Link to="/redUnion/rank">联盟积分</Link></Menu.Item> 
                            {localStorage.getItem('isPresident') == 1 && <SubMenu key="sub6" icon={<ExceptionOutlined />} title="问题管理">
                                {/* <Menu.Item key="22"><Link to="/redUnion/waitAccepted">待受理</Link></Menu.Item>
                                <Menu.Item key="23"><Link to="/redUnion/accepted">已受理</Link></Menu.Item>
                                <Menu.Item key="24"><Link to="/redUnion/completed">已办结</Link></Menu.Item> */}
                                <Menu.Item key="25"><Link to="/redUnion/appealList">问题列表</Link></Menu.Item>
                            </SubMenu>}
                        </Menu>
                        </div>
                        <div className={workRightObj[window.location.hash] ? Style.workRight : Style.right} style={{ minHeight: window.innerHeight - 140 }}>
                            <Route exact path="/redUnion/introduce"  component={Introduce} />
                            <Route exact path="/redUnion/member"  component={Member} />
                            <Route exact path="/redUnion/memorabilia"  component={Memorabilia} />
                            <Route exact path="/redUnion/news"  component={News} />
                            <Route exact path="/redUnion/honor"  component={Honor} />
                            <Route exact path="/redUnion/productManage"  component={Product} /> 
                            <Route exact path="/redUnion/serviceManage"  component={Serve} /> 
                            <Route exact path="/redUnion/routineWork"  component={RoutineWork} /> 
                            <Route exact path="/redUnion/uniqueWork"  component={UniqueWork} /> 
                            <Route exact path="/redUnion/joinActivity"  component={JoinActivity} /> 
                            <Route exact path="/redUnion/addActivity"  component={AddActivity} /> 
                            <Route exact path="/redUnion/activityList"  component={ActivityList} /> 
                            <Route exact path="/redUnion/editActivity"  component={EditActivity} /> 
                            <Route exact path="/redUnion/needsManage"  component={Needs} /> 
                            <Route exact path="/redUnion/productCheck"  component={ProductCheck} /> 
                            <Route exact path="/redUnion/serviceCheck"  component={ServiceCheck} /> 
                            <Route exact path="/redUnion/activityCheck"  component={ActivityCheck} /> 
                            <Route exact path="/redUnion/needsCheck"  component={NeedsCheck} /> 
                            <Route exact path="/redUnion/workDetail"  component={WorkDetail} /> 
                            <Route exact path="/redUnion/editWork"  component={EditWork} /> 
                            <Route exact path="/redUnion/rank"  component={Rank} /> 
                            <Route exact path="/redUnion/accepted"  component={Accepted} /> 
                            <Route exact path="/redUnion/appealList"  component={AppealList} /> 
                            <Route exact path="/redUnion/completed"  component={Completed} /> 
                            <Route exact path="/redUnion/waitAccepted"  component={WaitAccepted} /> 
                        </div>
                    </div>
                </div>
            )
     }
}

export default Index;