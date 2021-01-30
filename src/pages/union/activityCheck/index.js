import React, { Component } from 'react'
import { connect } from 'dva'
import { Button, Table, Select, Tag, Input, Modal, Radio, message, Popconfirm } from 'antd'
import EllipsisTooltip from '@/components/ellipsisTooltip'
import ActivityDetail from '../../components/activityDetail'
import Share from '../../components/share'
import style from './index.scss'

const namespace = 'activity'
const { Option } = Select
const { TextArea } = Input

@connect(({ activity, loading }) => ({ activity, dataLoading: loading.effects[`${namespace}/fetchAuditActivity`] }))
class MyActivity extends Component {
    state = {
        showAudit: false,
        activityId: null,
        showActivity: false,
        activityDetail: null,
        remark: '',
        auditRadio: null,
        showShare: false,
        shareId: null,
    }
    componentDidMount() {
        this.props.dispatch({
            type: `${namespace}/fetchAuditActivity`
        })
    }
    componentWillUnmount() {
        let searchConf = {
            currentPage: 1,
            pageSize: 10,
            status: '',
        }
        this.props.dispatch({
            type: `${namespace}/changeAuditActivity`,
            payload: searchConf,
        })
    }
    onSearchChange = value => {
        const { auditActivityConf } = this.props[namespace];
        auditActivityConf.currentPage = 1;
        auditActivityConf.status = value
        this.props.dispatch({
            type: `${namespace}/changeAuditActivity`,
            payload: auditActivityConf,
        });
        this.props.dispatch({
            type: `${namespace}/fetchAuditActivity`,
        })
    }
    handleTableChange = pagination => {
        const { auditActivityConf } = this.props[namespace];
        auditActivityConf.currentPage = pagination.current;
        auditActivityConf.pageSize = pagination.pageSize;
        this.props.dispatch({
            type: `${namespace}/changeAuditActivity`,
            payload: auditActivityConf,
        });
        this.props.dispatch({
            type: `${namespace}/fetchAuditActivity`,
        })
    }
    onAudit = (record) => {
        this.setState({
            activityId: record.id,
            showAudit: true
        })
    }

    onActivityDetail = record => {
        this.setState({
            activityDetail: record,
            showActivity: true
        })
    }

    closeBox = () => {
        this.setState({
            showAudit: false,
            activityId: null
        })
    }

    closeActivityDetail = () => {
        this.setState({
            showActivity: false,
            activityDetail: null
        })
    }

    closeAudit = () => {
        this.setState({
            showAudit: false,
            auditRadio: null,
            remark: '',
            activityId: null
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

    auditProduct = () => {
        const { auditRadio, remark, activityId } = this.state
        if (auditRadio !== 1 && auditRadio !== 2) {
            message.error('请选择审核意见')
        } else if (auditRadio === 2 && !remark) {
            message.error('请填写审核不通过理由')
        } else {
            this.props.dispatch({
                type: `${namespace}/toAuditActivity`,
                payload: {
                    id: activityId,
                    status: auditRadio,
                    comment: remark
                }
            }).then(rsp => {
                if (rsp && rsp.code === 0) {
                    message.success('审核成功!')
                    this.closeAudit()
                    this.props.dispatch({
                        type: `${namespace}/fetchAuditActivity`
                    })
                }
            })
        }
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
         type: `${namespace}/auditChangeActivityState`,
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
        const { auditActivityList, auditActivityTotal, auditActivityConf } = this.props[namespace]
        const { showAudit, showActivity, activityDetail, auditRadio, remark, showShare, shareId  } = this.state
        const { dataLoading } = this.props
        const columns = [
            {
                title: '活动名称',
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
            {
                title: '主办方',
                dataIndex: 'sponsor',
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
            { title: '上/下架',width: '120px', dataIndex: 'state', align: 'center', render: text => (text === 1 ? '上架' : '下架') },
            { title: '活动类型', width: '100px', dataIndex: 'category', align: 'center', render: text => (text === 1 ? <Tag color="success">线上</Tag> : <Tag color="processing">线下</Tag>) },
            { title: '审核状态', width: '100px', dataIndex: 'statusStr', align: 'center' },
            // { title: '审核结果', width: '100px', dataIndex: 'orderStatusStr', align: 'center', render: text => (text || '-') },
            {
                title: '活动时间', width: '200px', dataIndex: 'x1', align: 'center',
                render: (text, record) => {
                    return (
                        <>
                            <div>起&nbsp;{record.begindate}</div>
                            <div>止&nbsp;{record.enddate}</div>
                        </>
                    )
                }
            },
            {
                title: '联系方式', width: '150px', dataIndex: 'x2', align: 'center',
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
                fixed: 'right',
                width: 230,
                onCell: () => ({
                    style: {
                        whiteSpace: 'nowrap',
                        maxWidth: 230,
                    },
                }),
                render: (text, record) => {
                    return (
                        <span>
                            {
                              <Button disabled={record.status === '1' ? false : true} style={{marginRight: '10px'}} type="primary" onClick={() => { this.onShare(record) }}>分享</Button> 
                            }
                            {record.status === '1' ?  
                            <Popconfirm
                            title={record.state === 0 ? '确认要上架该需求' : '确认要下架该需求'}
                            onConfirm={() => {this.onChangeState(record)}}
                            okText="确认"
                            cancelText="取消"
                          > 
                            <Button>{record.state === 0 ? '上架' : '下架'}</Button>
                          </Popconfirm>
                           : 
                            <Button disabled={record.status === '0' ? false : true} onClick={() => { this.onAudit(record) }}>审核</Button>}
                            <Button style={{marginLeft: '10px'}} type="primary" onClick={() => { this.onActivityDetail(record) }}>详情</Button>
                        </span>
                    )
                }
            }
        ]
        const pagination = {
            pageSize: auditActivityConf.pageSize,
            total: auditActivityTotal,
            showQuickJumper: true,
            current: auditActivityConf.currentPage,
            showTotal: (total, range) => (
                <span>
                    目前显示{range[0]}-{range[1]} 条,共 {total} 条
                </span>
            )
        }
        return (
            <div>
                <span style={{ marginRight: '15px' }}>审核状态</span>
                <Select
                    style={{ width: 150, margin: '10px 0 20px 0' }}
                    placeholder="请选择审核状态"
                    onChange={this.onSearchChange}
                >   <Option value="">全部</Option>
                    <Option value="0">待审核</Option>
                    <Option value="1">审核通过</Option>
                    <Option value="2">审核不通过</Option>
                    <Option value="10">失效</Option>
                </Select>
                <Table
                    className="gobal-table"
                    rowKey="id"
                    style={{ width: '925px' }}
                    scroll={{ x: 980 }}
                    columns={columns}
                    dataSource={auditActivityList}
                    loading={dataLoading}
                    pagination={pagination}
                    onChange={this.handleTableChange}
                />

                {showAudit &&
                    <Modal
                        title="审核需求"
                        visible={true}
                        onOk={this.auditProduct}
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
                            {
                                auditRadio === 2 && <div className={style.item}>
                                <div className={style.label}>审核不通过理由</div>
                                <div className={style.value}>
                                    <TextArea
                                        onChange={this.changeRemark}
                                        value={remark}
                                        placeholder="请填写审核不通过理由"
                                        autoSize={{ minRows: 2, maxRows: 3 }}
                                    />
                                </div>
                            </div>
                            }   
                        </div>
                    </Modal>}
                {showActivity && <ActivityDetail data={activityDetail} closeBox={this.closeActivityDetail} />}
                {showShare && <Share id={shareId} closeShare={this.closeShare} dingMsgTempType={'2505'}/>}   
                    
            </div>
        )
    }
}

export default MyActivity
