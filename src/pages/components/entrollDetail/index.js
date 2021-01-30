import React, { Component } from 'react'
import { connect } from 'dva'
import { Modal, Row, Col, Tooltip } from 'antd'
import Style from './index.scss'

const namespace = 'activity'
@connect(({ activity }) => ({ activity }))
class EnrollDetail extends Component {
    state = {
        showMember: false,
    }

    componentDidMount() {
        const { enrollId } = this.props
        this.props.dispatch({
            type: `${namespace}/fetchEntrollDetail`,
            payload: enrollId
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


    render() {
        const { closeBox } = this.props
        const { showMember } = this.state
        const { enrollDetail } = this.props[namespace]
        return (
        <div>
            {enrollDetail && 
            <Modal
              bodyStyle={{maxHeight: '500px',minHeight: '300px', overFlow: 'auto'}}
              title="报名详情"
              visible={true}
              onCancel={closeBox}
              width={showMember ? 1200 : 700}
              maskClosable={false}
              footer={null}
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
                  <Col span={12}>
                  <div className={Style.Item}>
                      <div className={Style.name}>审核状态</div>
                      <div className={Style.value}>{enrollDetail.checkStatusStr}</div>
                  </div>
                  </Col>
                  <Col span={12}>
                  <div className={Style.Item}>
                      <div className={Style.name}>审核结果</div>
                      <div className={Style.value}>{enrollDetail.statusStr || '暂无审核结果'}</div>
                  </div>
                  </Col>
                  <Col span={24}>
                  <div className={Style.Item}>
                      <div className={Style.name}>审核说明</div>
                      <div className={Style.value}>{enrollDetail.comment || '暂无审核说明'}</div>
                  </div>
                  </Col>
              </Row>
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