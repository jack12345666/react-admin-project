import React, { Component } from 'react'
import { connect } from 'dva'
import { Modal, Radio, Select, message } from 'antd'
import style from './index.scss'

const namespace = 'union'
const { Option } = Select
@connect(({union}) => ({union}))
class Share extends Component {
    state = {
        defaultRadio: null,
        unionId: null
    }
    onChange = e => {
        this.setState({
            defaultRadio: e.target.value
        })
        if(e.target.value === 0) {
            this.props.dispatch({
                type: `${namespace}/fetchUnionList`
            })
        }
    }

    handleChange = value => {
        this.setState({
            unionId: value
        })
    }

    onSearch = val => {
        const { unionListConf } = this.props[namespace]
        unionListConf.name = val
        this.props.dispatch({
            type: `${namespace}/changeUnionListConf`,
            payolad: unionListConf
        })
        this.props.dispatch({
            type: `${namespace}/fetchUnionList`
        })
    }

    handleOk = () => {
        const { dingMsgTempType, id, closeShare } = this.props
        const { defaultRadio, unionId } = this.state
        if(defaultRadio !== 0 && defaultRadio !== 1) {
            message.error('请选择分型类型')
            return
        }
        if(defaultRadio === 0 && !unionId) {
            message.error('请选择分享的联盟')
            return
        }

        let data = {
            dingMsgTempType,
            id,
            type: defaultRadio,
            allianceId: defaultRadio === 1 ? null : unionId
        }
        this.props.dispatch({
            type: `${namespace}/dingdingShare`,
            payload: data
        }).then(rsp => {
            if(rsp.code === 0) {
                message.success('分享成功')
                closeShare()
            }
        })
    } 

    render() {
        const { closeShare } = this.props
        const { unionList } = this.props[namespace]
        const { defaultRadio } = this.state
        return (
            <div>
              <Modal
                title="分享"
                visible={true}
                onOk={this.handleOk}
                onCancel={closeShare}
                >
              <div className={style.item}>
                  <div className={style.label}>分享类型</div>
                  <div className={style.value}>
                  <Radio.Group onChange={this.onChange} value={defaultRadio}>
                    <Radio value={1}>全部联盟</Radio>
                    <Radio value={0}>指定联盟</Radio>
                  </Radio.Group>
                  </div>
              </div>
              {defaultRadio === 0 &&
                 <div className={style.item}>
                <div className={style.label}>选择联盟</div>
                <Select style={{ width: 200 }} onChange={this.handleChange}>
                 {
                     unionList.length > 0 && unionList.map(item => 
                     <Option key={item.id} value={item.id}>{item.name}</Option>  
                    )
                 }
                </Select>
              </div>  
              }
             
            </Modal> 
            </div>
        )
    }
}

export default Share