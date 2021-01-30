import React, { Component } from 'react'
import { connect } from 'dva'
import { Button, Table, Input, Modal, Radio, message, Popconfirm } from 'antd'
import EllipsisTooltip from '@/components/ellipsisTooltip'
import NeedsDetail from '../../components/needsDetail'
import Share from '../../components/share'
import style from './index.scss'
import moment from 'moment'


const format = 'YYYY-MM-DD HH:mm'
const { TextArea } = Input
const namespace = 'needs'
@connect(({ needs, loading }) => ({ needs, dataLoading: loading.effects[`${namespace}/fetchAuditList`] }))
class Needs extends Component {
    state = {
        name: '',
        showDetail: false,
        needsId: null,
        showAudit: false,
        remark: '',
        auditRadio: null,
        showShare: false,
        shareId: null,
    }
    componentDidMount() {
        this.props.dispatch({
            type: `${namespace}/fetchAuditList`
        })     
    }

    onChangeName = e => {
        this.setState({
          name: e.target.value
        })
    }
    
  toSearch = () => {
    const { needsAuditConf } = this.props[namespace];
    const { name } = this.state
    needsAuditConf.currentPage = 1;
    needsAuditConf.companyNameLike = name
    this.props.dispatch({
      type: `${namespace}/changeNeedsAuditConf`,
      payload: needsAuditConf,
    });
    this.props.dispatch({
      type: `${namespace}/fetchAuditList`,
    })
  }

  handleTableChange = pagination => {
    const { needsAuditConf } = this.props[namespace];
    needsAuditConf.currentPage = pagination.currentPage;
    needsAuditConf.pageSize = pagination.pageSize;
    this.props.dispatch({
      type: `${namespace}/changeNeedsAuditConf`,
      payload: needsAuditConf,
    });
    this.props.dispatch({
      type: `${namespace}/fetchAuditList`,
    })
  }
  
  onAudit = id => {
    this.setState({
      showAudit: true,
      needsId: id
    })
  }

  closeAudit = () => {
      this.setState({
          showAudit: false,
          auditRadio: null,
          remark: '',
          needsId: null
      })
  }

  changeAudit = e => {
    this.setState({
        auditRadio: e.target.value,
      })
  }

  changeRemark = ({ target: { value } }) => {
    this.setState({ 
        remark: value
     })
  }


  auditNeeds = () => {
    const { auditRadio, remark, needsId } = this.state
    if(auditRadio !== 1 && auditRadio !== 2) {
        message.error('请选择审核意见')
    }else if(auditRadio === 2 && !remark) {
        message.error('请填写审核不通过理由')
    }else {
        this.props.dispatch({
            type: `${namespace}/auditNeeds`,
            payload: {
               id: needsId,
               status: auditRadio,
               comment: remark
            }
        }).then(rsp => {
            if(rsp && rsp.code === 0) {
                message.success('审核成功!')
                this.closeAudit()
                this.props.dispatch({
                    type: `${namespace}/fetchAuditList`
                })
            }
        })
    }
  }

  onDetail = record => {
    this.setState({
      needsId: record.id,
      showDetail: true
    })
  }

  closeDetail = () => {
    this.setState({
      showDetail: false,
      needsId: null
    })
  }

  onChangeState = record => {
    let state = null
    if(record.state === 0) {
      state = 1
    }else {
      state = 0
    }
    let data = {
     id: record.id,
     state
   }
   this.props.dispatch({
     type: `${namespace}/auditChangeNeedState`,
     payload: data
  })
 }

 onShare = record => {
  this.setState({
    showShare: true,
    shareId: record.id
  })
}

closeShare = () => {
 this.setState({
   showShare: false,
   shareId: null
 })
}

    render() {
        const { needsAuditList, needsAuditTotal, needsAuditConf } = this.props[namespace]
        const { needsId, showDetail, showAudit, auditRadio, remark, showShare, shareId } = this.state
        const { dataLoading } = this.props
        const columns = [
            { title: '编号',width: '180px', dataIndex: 'no', align: 'center' },
            { title: '采购名称',
              dataIndex: 'name',
              align: 'center',
              width: 180,
              onCell: () => ({
                  style: {
                    whiteSpace: 'nowrap',
                    maxWidth: 180,
                  },
                }),
              render: text => (
                <EllipsisTooltip title={text}>{text}</EllipsisTooltip>
              ),
            },
            { title: '求购内容',
            dataIndex: 'content',
            align: 'center',
            width: 200,
            onCell: () => ({
                style: {
                  whiteSpace: 'nowrap',
                  maxWidth: 200,
                },
              }),
            render: text => (
              <EllipsisTooltip title={text}>{text}</EllipsisTooltip>
            ),
          },
        { title: '上/下架',width: '120px', dataIndex: 'state', align: 'center', render: text => (text === 1 ? '上架' : '下架') },
        { title: '状态',width: '120px', dataIndex: 'statusStr', align: 'center' },
        { title: '采购时间',width: '180px', dataIndex: 'x1', align: 'center', 
         render: (text, record) => {
            return (
                <>
                <div>起&nbsp;{moment(record.expirybegindate).format(format)}</div>
                <div>止&nbsp;{moment(record.expiryenddate).format(format)}</div>
                </>
            )
          } 
        },
        { title: '公司名称',
        dataIndex: 'companyName',
        align: 'center',
        width: 150,
        onCell: () => ({
            style: {
              whiteSpace: 'nowrap',
              maxWidth: 150,
            },
          }),
        render: text => (
          <EllipsisTooltip title={text}>{text}</EllipsisTooltip>
        ),
      },
        { title: '联系方式',width: '150px', dataIndex: 'x2', align: 'center', 
         render: (text, record) => {
            return (
                <> 
                <div>{record.tel}</div>
                <div>{record.contact}</div>
                </>
            )
          } 
        },
        {
        title: '操作',
        dataIndex: 'x',
        align: 'center',
        width: 230,
        fixed: 'right',
        onCell: () => ({
            style: {
              whiteSpace: 'nowrap',
              maxWidth: 230,
            },
          }),
        render: (text, record) => {
            return (
              <>
              <div>
              {
                <Button disabled={record.status === 1 ? false : true} style={{marginRight: '10px'}} type="primary" onClick={() => { this.onShare(record) }}>分享</Button> 
              } 
              {record.status === 1 ?  
                   <Popconfirm
                   title={record.state === 0 ? '确认要上架该需求' : '确认要下架该需求'}
                   onConfirm={() => {this.onChangeState(record)}}
                   okText="确认"
                   cancelText="取消"
                 > 
                   <Button>{record.state === 0 ? '上架' : '下架'}</Button>
                 </Popconfirm>
                  : 
                   <Button disabled={record.status === 10 || record.status === 1 || record.status === 2 ? true : false} onClick={() => {this.onAudit(record.id)}}>审核</Button>}
                   <Button style={{marginLeft: '10px'}} type="primary" onClick={() => {this.onDetail(record)}}>详情</Button>
              </div>
            </>  
            )
          }
         }
        ]  
        const pagination = {
            pageSize: needsAuditConf.pageSize,
            total: needsAuditTotal,
            showQuickJumper: true,
            current: needsAuditConf.currentPage,
            showTotal: (total, range) => (
              <span>
                目前显示{range[0]}-{range[1]} 条,共 {total} 条
              </span>
            )
       }
        return (
            <div>
                    <div className={style.searchBox}>
                    <div className={style.searchItem}>
                        <span className={style.label}>公司名称</span>
                        <Input placeholder="请输入公司名称" allowClear onChange={this.onChangeName} style={{ width: '200px' }} />
                    </div>
                    <div className={style.searchItem}>
                        <Button type="primary" onClick={this.toSearch}>查询</Button>
                    </div>
                    </div>
                    <Table
                        rowKey="id"
                        style={{width: '925px'}}
                        scroll={{ x: 980 }}
                        columns={columns}
                        dataSource={needsAuditList}
                        loading={dataLoading}
                        pagination={pagination}
                        onChange={this.handleTableChange}
                    /> 
                    {showAudit &&  
                     <Modal
                        title="审核需求"
                        visible={true}
                        onOk={this.auditNeeds}
                        onCancel={this.closeAudit}
                        >
                       <div className={style.auditBox}>
                            <div className={style.item}>
                                 <div className={style.label}>审核意见</div>
                                 <div className={style.value}>
                                 <Radio.Group onChange={this.changeAudit} value={auditRadio}>
                                    <Radio value={1}>审核通过</Radio>
                                    <Radio value={2}>审核不通过</Radio>
                                </Radio.Group> 
                                </div>
                            </div>
                          {auditRadio === 2 &&  <div className={style.item}>
                                 <div className={style.label}>审核不通过理由</div>
                                 <div className={style.value}>
                                 <TextArea
                                    onChange={this.changeRemark}
                                    value={remark}
                                    placeholder="审核不通过理由"
                                    autoSize={{ minRows: 2, maxRows: 3 }}
                                />
                                </div>
                            </div>}
                       </div>
                    </Modal>}
             {showDetail && <NeedsDetail needsId={needsId} closeBox={this.closeDetail}/>}   
             {showShare && <Share id={shareId} closeShare={this.closeShare} dingMsgTempType={'2506'}/>}   
            </div>
        )
    }
}

export default Needs