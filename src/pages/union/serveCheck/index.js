import React, { Component } from 'react'
import { connect } from 'dva'
import { Button, Table, Select, Input, Modal, Radio, message, Popconfirm } from 'antd'
import EllipsisTooltip from '@/components/ellipsisTooltip'
import GoodsDetail from '../../components/goodsDetail'
import Share from '../../components/share'
import style from './index.scss'

const namespace = 'product'
const { Option } = Select
const { Search, TextArea } = Input

@connect(({ product, loading }) => ({ product, dataLoading: loading.effects[`${namespace}/fetchAuditList`] }))
class Product extends Component {
    state = {
        storeId: null,
        productId: null,
        showAudit: false,
        remark: '',
        auditRadio: null,
        showDetail: false,
        goodsId: null,
        showShare: false,
        shareId: null,
    }
    componentDidMount() {
        const { auditConf } = this.props[namespace]
        auditConf.isPromotion = 0
        this.props.dispatch({
          type: `${namespace}/changeAuditConf`,
          payload: auditConf,
        })
        this.props.dispatch({
            type: `${namespace}/fetchAuditList`
        })
    }

    componentWillMount() {
        const { auditConf } = this.props[namespace]
        auditConf.isPromotion = ''
        auditConf.currentPage = 1
        this.props.dispatch({
          type: `${namespace}/changeAuditConf`,
          payload: auditConf,
        })
      }

    onCheckStatus = value => {
        const { auditConf } = this.props[namespace];
        auditConf.currentPage = 1;
        auditConf.verify = value
        this.props.dispatch({
          type: `${namespace}/changeAuditConf`,
          payload: auditConf,
        })
        this.props.dispatch({
          type: `${namespace}/fetchAuditList`,
        })
    }

    searchName = value => {
        const { auditConf } = this.props[namespace];
        auditConf.currentPage = 1;
        auditConf.name = value
        this.props.dispatch({
          type: `${namespace}/changeAuditConf`,
          payload: auditConf,
        })
        this.props.dispatch({
          type: `${namespace}/fetchAuditList`,
        })
      }

      handleTableChange = pagination => {
        const { auditConf } = this.props[namespace];
        auditConf.currentPage = pagination.current;
        auditConf.pageSize = pagination.pageSize;
        this.props.dispatch({
          type: `${namespace}/changeAuditConf`,
          payload: auditConf,
        })
        this.props.dispatch({
          type: `${namespace}/fetchAuditList`,
        })
    }


    onAudit = id => {
      this.setState({
        productId: id,
        showAudit: true
      })
    }

    closeAudit = () => {
      this.setState({
          showAudit: false,
          auditRadio: null,
          remark: '',
          productId: null
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

  auditServe = () => {
    const { auditRadio, remark, productId } = this.state
    if(auditRadio !== 0 && auditRadio !== 1) {
        message.error('请选择审核意见')
    }else if(auditRadio === 0 && !remark) {
        message.error('请填写审核不通过理由')
    }else {
        this.props.dispatch({
            type: `${namespace}/toAuditGoods`,
            payload: {
               objId: productId,
               status: auditRadio,
               type: 1,
               cont: remark
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
      goodsId: record.id,
      showDetail: true
    })
  }

  closeDetailBox = () => {
    this.setState({
      showDetail: false,
      goodsId: null,
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
     type: `${namespace}/auditChangeState`,
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
        const { auditList, auditTotal, auditConf } = this.props[namespace]
        const { showAudit, auditRadio, remark, showDetail, goodsId, showShare, shareId } = this.state
        const { dataLoading } = this.props
        const pagination = {
            pageSize: auditConf.pageSize,
            total: auditTotal,
            showQuickJumper: true,
            current: auditConf.currentPage,
            showTotal: (total, range) => (
              <span>
                目前显示{range[0]}-{range[1]} 条,共 {total} 条
              </span>
            )
        }
        const columns = [
            { title: '序号',
              width: 80,
              render:(text,record,index)=>`${index+1}`   
              },
              { title: '单位名称',
              dataIndex: 'storename',
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
              { title: '服务名称',
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
          { title: '上/下架',width: '120px', dataIndex: 'state', align: 'center', render: text => (text === 1 ? '上架' : '下架') },
          { title: '审核结果', width: '120px', dataIndex: 'verifyStr', align: 'center', render: text => (text ||  '-') },
          { title: '价格(元)',width: '120px', dataIndex: 'price', align: 'center', render: (text, record) => {
            if(text === 0) {
                return '免费'
            }else if(text === -1) {
                return '面议'
            }else {
                return text
            }
          }},
          { title: '添加时间',width: '150px', dataIndex: 'addtime', align: 'center'},
          {
          title: '操作',
          dataIndex: 'x',
          align: 'center',
          onCell: () => ({
              style: {
                whiteSpace: 'nowrap',
                maxWidth: 230,
              },
            }),
          render: (text, record) => {
              return (
                  <span className={style.box}>
                  {
                    <Button disabled={record.auditStatus === 1 ? false : true} style={{marginRight: '10px'}} type="primary" onClick={() => { this.onShare(record) }}>分享</Button> 
                  } 
                  {record.auditStatus === 1 ?  
                   <Popconfirm
                   title={record.state === 0 ? '确认要上架该服务' : '确认要下架该服务'}
                   onConfirm={() => {this.onChangeState(record)}}
                   okText="确认"
                   cancelText="取消"
                 > 
                   <Button>{record.state === 0 ? '上架' : '下架'}</Button>
                 </Popconfirm>
                  : <Button disabled={record.audtiCheckStatus === 0  ? false : true}  onClick={() => { this.onAudit(record.id) }}> 审核 </Button>}
                   <Button style={{marginLeft: '10px'}}  type="primary"  onClick={() => { this.onDetail(record) }}>详情</Button> 
                  </span>
              )
            }
           }
          ]  
        return (
            <div>
                    <div style={{display: 'flex', alignContent: 'center', marginTop: '10px'}}>
                    <div style={{margin: '5px 15px 0 15px'}}>审核结果</div> 
                    <Select
                        style={{ width: 150, marginBottom: '20px'}}
                        placeholder="请选择服务状态"
                        onChange={this.onCheckStatus}>   
                        <Option value="">全部</Option>
                        <Option value="1">通过</Option>
                        <Option value="0">不通过</Option>
                        <Option value="10">审核中</Option>
                    </Select>
                    <Search
                        style={{width: '360px', marginLeft: '20px'}}
                        placeholder="请输入服务名称"
                        enterButton="搜索"
                        size="middle"
                        allowClear={true}
                        onSearch={value => this.searchName(value)}
                      />
                   </div>
                   <Table
                        rowKey="id"
                        columns={columns}
                        dataSource={auditList}
                        loading={dataLoading}
                        pagination={pagination}
                        onChange={this.handleTableChange}
                   />   
                    {showAudit &&  
                     <Modal
                        title="审核服务"
                        visible={true}
                        onOk={this.auditServe}
                        onCancel={this.closeAudit}
                        >
                       <div className={style.auditBox}>
                            <div className={style.item}>
                                 <div className={style.label}>审核意见</div>
                                 <div className={style.value}>
                                 <Radio.Group onChange={this.changeAudit} value={auditRadio}>
                                    <Radio value={1}>审核通过</Radio>
                                    <Radio value={0}>审核不通过</Radio>
                                </Radio.Group> 
                                </div>
                            </div>
                            {
                                auditRadio === 0 && <div className={style.item}>
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
                    {showDetail && <GoodsDetail title={'服务详情'} closeBox={this.closeDetailBox} goodsId={goodsId}/>}   
                    {showShare && <Share id={shareId} closeShare={this.closeShare} dingMsgTempType={'2504'}/>}     
            </div>
        )
    }
} 

export default Product