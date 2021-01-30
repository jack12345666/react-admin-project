import React, { Component } from 'react'
import { connect } from 'dva'
import {Modal, Row, Col, Radio, Input, message, Tooltip, Button} from 'antd'
import Style from './index.scss'

const namespace = 'activity'
const { TextArea } = Input
@connect(({ activity }) => ({ activity }))
class EnrollDetail extends Component {
    state = {
        checkRadio: null,
        remark: '',
        showMember: false,
    }

    componentDidMount() {
        const { activityId } = this.props
        this.props.dispatch({
            type: `${namespace}/fetchEntrollDetail`,
            payload: activityId
        }).then(() => {
            const { enrollDetail } = this.props[namespace]
            this.setState({
                checkRadio: enrollDetail.status || null,
                remark: enrollDetail.comment || ''
            })
        })
    }

    onChangeRadio = e => {
        this.setState({
            checkRadio: e.target.value,
        })
    }

    onChangeRemark = e => {
        this.setState({
            remark: e.target.value,
        }) 
    }

    changeShowMember = () => {
        this.setState({
            showMember: true
        })
    }

    closeMemberList = () => {
        this.setState({
            showMember: false
        })
    }

    submitCheck = () => {
        const {checkRadio, remark} = this.state
        const { enrollDetail } = this.props[namespace]
        
        if(!checkRadio) {
            message.error('请选择审核意见')
            return
        }else if(checkRadio === 2 && !remark) {
            message.error('请填写审核备注')
        }else {
            this.props.dispatch({
                type: `${namespace}/toCheckEnroll`,
                payload: {
                    id: enrollDetail.id,
                    status: checkRadio,
                    comment: remark
                }
            })
        }  
    }

    render() {
        const { closeBox } = this.props
        const { checkRadio, remark, showMember } = this.state
        const { needAllow, enrollDetail } = this.props[namespace]
        let footerObj = null
        let readOnly = false
        if((enrollDetail && enrollDetail.checkStatus === 1) || needAllow === 0) {
            footerObj = null
            readOnly = true
          }else {
            footerObj = [
              <Button onClick={closeBox}>取消</Button>,
              <Button type="primary" onClick={this.submitCheck.bind(this)}>确认提交审核</Button>
            ]
            readOnly = false
          }
        return (
        <div>
            {enrollDetail && 
            <Modal
              bodyStyle={{maxHeight: '500px', overFlow: 'auto'}}
              title="报名详情"
              visible={true}
              onCancel={closeBox}
              width={showMember ? 1200 : 700}
              maskClosable={false}
              footer={footerObj}
              >
              <div className={Style.box}>
              <Row>
              <Col span={showMember ? 16 : 24}>
              <Row>
                  <Col span={24}>
                  <div className={Style.Item}>
                      <div className={Style.name}>活动名称</div>
                      <div className={Style.value}>{enrollDetail.activityName}</div>
                  </div>
                  </Col>
                  <Col span={12}>
                  <div className={Style.Item}>
                      <div className={Style.name}>所属联盟</div>
                      <div className={Style.value}>{enrollDetail.userAllianceName}</div>
                  </div>
                  </Col>
                  <Col span={12}>
                  <div className={Style.Item}>
                      <div className={Style.name}>公司名称</div>
                      <div className={Style.value}>{enrollDetail.userCompanyName}</div>
                  </div>
                  </Col>
                  <Col span={12}>
                  <div className={Style.Item}>
                      <div className={Style.name}>申请人</div>
                      <div className={Style.value}>{enrollDetail.userName}</div>
                  </div>
                  </Col>
                  <Col span={12}>
                  <div className={Style.Item}>
                      <div className={Style.name}>联系电话</div>
                      <div className={Style.value}>{enrollDetail.userPhone}</div>
                  </div>
                  </Col>
                  <Col span={12}>
                  <div className={Style.Item}>
                      <div className={Style.name}>邮箱</div>
                      <div className={Style.value}>{enrollDetail.userEmail || '暂未填写'}</div>
                  </div>
                  </Col>
                  <Col span={12}>
                  <div className={Style.Item}>
                      <div className={Style.name}>报名人数</div>
                      <div className={Style.value}>
                       {enrollDetail.details.length === 0 ? <span style={{cursor: 'pointer'}}>{enrollDetail.enrollNum}</span> : <Tooltip defaultVisible={true} placement="bottom" title="点击查看具体参加活动人员" arrowPointAtCenter><span onClick={this.changeShowMember} style={{color: '#108ee9',cursor: 'pointer'}}>{enrollDetail.enrollNum}</span></Tooltip>} 
                    </div>
                  </div>
                  </Col>
              </Row>
              <div className={Style.title}>活动审核</div>
                 <div className={Style.Item}>
                      <div className={Style.name}>审核意见</div>
                      <div className={Style.value}>
                      <Radio.Group disabled={readOnly} onChange={this.onChangeRadio} value={checkRadio}>
                          <Radio value={1}>审核通过</Radio>
                          <Radio value={2}>审核不通过</Radio>
                      </Radio.Group> 
                     </div>
                 </div>
                 <div className={Style.Item}>
                      <div className={Style.name}>审核备注</div>
                      <div className={Style.value}>
                      <TextArea
                          disabled={readOnly}
                          style={{width: '500px',marginTop: '10px'}}
                          value={remark}
                          onChange={this.onChangeRemark}
                          placeholder="请填写审核备注"
                          autoSize={{ minRows: 3, maxRows: 5 }}
                          />
                     </div>
                 </div>
                 </Col>
                 { (enrollDetail.details.length > 0 && showMember) &&
                    <Col span={8}>
                      <div className={Style.rightTitle}>
                          <div className={Style.title}>参加人员</div>
                          <div className={Style.icon} onClick={this.closeMemberList}>关闭列表</div>
                      </div>
                      <div className={Style.listTitle}>
                            <div className={Style.no}>序号</div>
                            <div className={Style.name}>姓名</div>
                            <div className={Style.phone}>联系电话</div>
                            <div className={Style.zhiwu}>职务</div>
                        </div>
                       <div className={Style.memberList}>
                         {
                            enrollDetail.details.map((item, index) => (
                              <div className={Style.memberItem} key={item.no}>
                                  <div className={Style.no}>{index+1}</div>
                                  <div className={Style.name}>{item.userName}</div>
                                  <div className={Style.phone}>{item.userPhone}</div>
                                  <div className={Style.zhiwu}>{item.userPosition}</div>
                             </div>  
                            ))
                        }
                      </div>
                    </Col> 
                 }  
                 </Row>
              </div>
            </Modal>
            }
        </div>
        )
    }
}

export default EnrollDetail