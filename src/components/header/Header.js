import React, { Component } from 'react'
import { connect } from 'dva'
import { UserOutlined } from '@ant-design/icons'
import { Avatar, Tooltip, Modal, Cascader } from 'antd'
import Style from './style.scss'
import { imgFormat } from '@/utils/utils'
import OrgItem from './orgItem'
const namespace = 'union'

@connect(({ union, product }) => ({ union, product }))
class Header extends Component {
    state = {
        showChangeBox: false,
        changeList: [],
        checkOrgValue: [],
        checkOrgLabel: [],
        showOrgBox: false,
    }

    changeOrg = () => {
        const { isMoreAlliance, isMoreOrg, orgList } = this.props
        let options = []
        let arr = []
        if (orgList.length > 0) {
            orgList.forEach((item, index) => {
                options.push({
                    value: item.id,
                    label: item.name,
                })
                if (item.alliances.length > 0) {
                    item.alliances.forEach(i => {
                        if (!arr.find(arrItem => arrItem.value === i.id)) {
                            arr.push({
                                value: i.id,
                                label: i.name
                            })
                        }
                    })
                }
                options[index].children = arr
                arr = []
            })
          this.setState({
            changeList: options
          })
        }
        if (isMoreAlliance || isMoreOrg) {
            this.setState({
                showChangeBox: true
            })
        }
    }

    onChange = (value, label) => {
        console.log(value, label)
        this.setState({
            checkOrgValue: value,
            checkOrgLabel: label
        })
    }

    handleCancel = () => {
        this.setState({
            showChangeBox: false
        })
    }

    handleOk = () => {
        const { checkOrgValue, checkOrgLabel} = this.state
        this.setState({
            showChangeBox: false
        })
        localStorage.setItem('orgId', checkOrgValue[0])
        localStorage.setItem('alliance', checkOrgValue[1])
        localStorage.setItem('orgName', checkOrgLabel[0].label)
        localStorage.setItem('allianceName', checkOrgLabel[1].label)
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
            payload: localStorage.getItem('alliance')
           }).then(() => {
            const { unionDetail } = this.props[namespace]
            if(unionDetail.operators.length > 0 && unionDetail.operators.find(item => item.orgUserId == localStorage.getItem('userId'))) {
                localStorage.setItem('isPresident', 1)
            }else {
                localStorage.setItem('isPresident', 0)
            }
            localStorage.setItem('allianceLogo', unionDetail.logopath) 
            window.location.reload()
        })
    }

    editOrgBox = () => {
        this.setState({
            showOrgBox: true
        })
    }

    closeBox = () => {
        this.setState({
            showOrgBox: false
        })
    }
    
    render() {
        const { isMoreAlliance, isMoreOrg } = this.props
        const { showChangeBox, changeList, showOrgBox } = this.state
        let tipText = ''
        let title = ''
        if (isMoreAlliance && !isMoreOrg) {
            tipText = '点击切换联盟'
            title = '切换联盟'
        }
        if (isMoreOrg) {
            tipText = '点击切换单位'
            title = '切换单位'
        }
        return (
            <div className={Style.box}>
                <div className={Style.header}>
                    <div className={Style.logo}>
                        <img alt="logo" src={localStorage.getItem('allianceLogo') ? imgFormat(localStorage.getItem('allianceLogo')) : require('../../assets/redUnion.png')} />
                        <Tooltip placement="right" title={tipText} defaultVisible={false}>
                        <div className={Style.name} onClick={this.changeOrg}>
                            <div className={Style.chinese}>{localStorage.getItem('allianceName')}</div>
                            <div className={Style.english}>{localStorage.getItem('orgName')}</div>
                        </div>
                        </Tooltip>
                    </div>
                    <div className={Style.info}>
                        <div className={Style.username}>你好，{localStorage.getItem('userName')}</div>
                        <div className={Style.avatar}>
                            <Tooltip placement="bottom" title={'点击修改单位信息'}>
                                {localStorage.getItem('userAvatar') ? <Avatar src={localStorage.getItem('userAvatar')} size={36}  onClick={this.editOrgBox}/> : <Avatar size={36} icon={<UserOutlined />} onClick={this.editOrgBox} />}
                            </Tooltip>
                        </div>
                    </div>
                </div>
                {showChangeBox &&
                    <Modal
                        title={title}
                        visible={true}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                    >   <div style={{height: '150px'}}>
                          <Cascader style={{width: '100%', marginBottom: '10px'}} options={changeList} onChange={this.onChange} placeholder="请切换单位联盟" />
                          <p>当前所在单位: {localStorage.getItem('orgName')}</p>
                          <p>当前所在联盟: {localStorage.getItem('allianceName')}</p>
                        </div>
                    </Modal>
                }
               {showOrgBox && <OrgItem orgId={localStorage.getItem('orgId')} closeBox={this.closeBox}/>}
            </div>
        )
    }
}

export default Header